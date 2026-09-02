/* Sim-Ready Asset Library accounts + purchases.
 *
 * One interface, two backends:
 *   DemoBackend     — localStorage users/purchases, sandbox payment. Default.
 *   SupabaseBackend — Supabase Auth + purchases table + Stripe Checkout via
 *                     edge functions (see SETUP-PAYMENTS.md). Selected when
 *                     CONFIG.mode === "supabase" and keys are filled in.
 *
 * The rest of the app only talks to `account`.
 */
import { CONFIG } from "./config.js";

const enc = new TextEncoder();
async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* ------------------------------------------------------------ demo backend */
const DemoBackend = {
  name: "demo",
  _users() { return JSON.parse(localStorage.getItem("simgen-users") || "{}"); },
  _saveUsers(u) { localStorage.setItem("simgen-users", JSON.stringify(u)); },

  async register(email, password) {
    email = email.trim().toLowerCase();
    const users = this._users();
    if (users[email]) throw new Error("exists");
    const salt = crypto.randomUUID();
    users[email] = { salt, hash: await sha256(salt + password), created: Date.now() };
    this._saveUsers(users);
    localStorage.setItem("simgen-session", email);
    return { email };
  },

  async signIn(email, password) {
    email = email.trim().toLowerCase();
    const u = this._users()[email];
    if (!u || (await sha256(u.salt + password)) !== u.hash) throw new Error("badcreds");
    localStorage.setItem("simgen-session", email);
    return { email };
  },

  async signOut() { localStorage.removeItem("simgen-session"); },

  async session() {
    const email = localStorage.getItem("simgen-session");
    return email ? { email } : null;
  },

  _pkey(email) { return `simgen-purchases-${email}`; },
  async purchases(user) {
    return JSON.parse(localStorage.getItem(this._pkey(user.email)) || "[]");
  },

  /* Sandbox payment: caller shows the payment modal; this records the result. */
  async completePurchase(user, slugs, total) {
    const orders = await this.purchases(user);
    orders.push({ id: "demo_" + crypto.randomUUID().slice(0, 8), slugs, total,
                  currency: CONFIG.pricing.currency, at: new Date().toISOString() });
    localStorage.setItem(this._pkey(user.email), JSON.stringify(orders));
  },

  async downloadUrl(_user, slug) {
    // Demo mode has only the compressed preview GLB hosted on the static site.
    return `assets/${slug}/model.glb`;
  },
};

/* -------------------------------------------------------- supabase backend */
const SupabaseBackend = {
  name: "supabase",
  _client: null,
  async _sb() {
    if (!this._client) {
      const { createClient } = await import(
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
      this._client = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);
    }
    return this._client;
  },
  async register(email, password) {
    const sb = await this._sb();
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    return { email: data.user.email };
  },
  async signIn(email, password) {
    const sb = await this._sb();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw new Error("badcreds");
    return { email: data.user.email };
  },
  async signOut() { (await this._sb()).auth.signOut(); },
  async session() {
    const { data } = await (await this._sb()).auth.getSession();
    return data.session ? { email: data.session.user.email } : null;
  },
  async purchases() {
    const sb = await this._sb();
    const { data, error } = await sb.from("purchases").select("*").order("at");
    if (error) return [];
    return data.map((r) => ({ id: r.id, slugs: r.slugs, total: r.total,
                              currency: r.currency, at: r.at }));
  },
  /* Real checkout: redirect to Stripe; the webhook records the purchase. */
  async startCheckout(_user, slugs) {
    const sb = await this._sb();
    const { data: { session } } = await sb.auth.getSession();
    const res = await fetch(CONFIG.supabase.checkoutFn, {
      method: "POST",
      headers: { "content-type": "application/json",
                 authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ slugs, return_url: location.href }),
    });
    const { url } = await res.json();
    location.href = url;                       // Stripe-hosted payment page
  },
  async downloadUrl(_user, slug) {
    const sb = await this._sb();
    const { data: { session } } = await sb.auth.getSession();
    const res = await fetch(`${CONFIG.supabase.downloadFn}?slug=${slug}`, {
      headers: { authorization: `Bearer ${session.access_token}` } });
    if (!res.ok) throw new Error("forbidden");
    return (await res.json()).url;             // short-lived signed URL
  },
};

/* ----------------------------------------------------------------- facade */
const backend =
  CONFIG.mode === "supabase" && CONFIG.supabase.url ? SupabaseBackend : DemoBackend;

export const account = {
  user: null,
  owned: new Set(),
  listeners: [],
  isDemo: backend.name === "demo",

  onChange(fn) { this.listeners.push(fn); },
  _emit() { this.listeners.forEach((fn) => fn()); },

  async init() {
    this.user = await backend.session();
    await this._refreshOwned();
    this._emit();
  },

  async _refreshOwned() {
    this.owned = new Set();
    if (!this.user) return;
    for (const order of await backend.purchases(this.user))
      order.slugs.forEach((s) => this.owned.add(s));
  },

  owns(slug) { return this.owned.has(slug); },

  async register(email, password) {
    this.user = await backend.register(email, password);
    await this._refreshOwned(); this._emit();
  },
  async signIn(email, password) {
    this.user = await backend.signIn(email, password);
    await this._refreshOwned(); this._emit();
  },
  async signOut() {
    await backend.signOut();
    this.user = null; this.owned = new Set(); this._emit();
  },

  purchases() { return this.user ? backend.purchases(this.user) : []; },

  /* demo: record sandbox payment; supabase: redirect to Stripe instead */
  async completeSandboxPurchase(slugs, total) {
    await backend.completePurchase(this.user, slugs, total);
    await this._refreshOwned(); this._emit();
  },
  startRealCheckout(slugs) { return backend.startCheckout(this.user, slugs); },

  downloadUrl(slug) { return backend.downloadUrl(this.user, slug); },
};
