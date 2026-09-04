/* Sim-Ready Asset Library — grid, filters, viewer sheet, cart, accounts,
   payment-gated downloads, i18n (EN default). */
import { CONFIG } from "./config.js";
import { account } from "./account.js";

const priceOf = (a) => a.price ?? CONFIG.pricing[a.kind] ?? CONFIG.pricing.rigid;
const fmt = (n) => `${CONFIG.pricing.symbol}${n}`;

const I18N = {
  en: {
    nav_home: "Animis AI", nav_cart: "Cart",
    stat_online: "assets online",
    f_all: "All", f_articulated: "Articulated", f_rigid: "Rigid",
    search_ph: "search…", empty: "No matching assets",
    empty_none: "Assets coming soon. Tell us which ones your simulation needs.",
    cart_head: "Cart", cart_checkout: "Checkout", cart_total: "Total",
    cart_note: "Pay to unlock the downloads for every asset in the list. Sign-in required at checkout.",
    cart_empty: "Your cart is empty — add assets from their detail view.",
    nav_signin: "Sign in",
    auth_signin: "Sign in", auth_register: "Register", auth_signout: "Sign out",
    auth_email: "Email", auth_password: "Password",
    auth_noaccount: "No account yet?", auth_haveaccount: "Already registered?",
    auth_sub_demo: "Sandbox accounts — stored in this browser only.",
    auth_sub_live: "Sign in to purchase and download assets.",
    auth_name: "Full name", auth_org: "Institution / school / company",
    auth_followup: "I'm open to a follow-up conversation about how I use the assets.",
    auth_err_badcreds: "Wrong email or password.",
    auth_err_exists: "This email is already registered — sign in instead.",
    auth_err_generic: "Something went wrong — try again.",
    auth_err_profile: "Please fill in your name and institution.",
    lic_head: "License terms",
    lic_sub: "Please read before purchase — your acceptance is recorded with the order.",
    lic_t1: "The assets are licensed to you (and your immediate team or lab) for your own research, development, training and evaluation.",
    lic_t2: "No resale, sublicensing, redistribution or public re-hosting of the assets or derivative asset packages.",
    lic_t3: "Your registration details and this acceptance are kept on record with your purchases.",
    lic_agree_label: "I have read and agree to the terms above.",
    lic_continue: "Agree & continue to payment",
    pay_head: "Checkout",
    pay_sandbox: "SANDBOX PAYMENT — no real charge. Use card 4242 4242 4242 4242.",
    pay_card: "Card number", pay_exp: "Expiry",
    pay_submit: (total) => `Pay ${total}`,
    pay_processing: "Processing…",
    pay_err_card: "Card declined — in the sandbox, use 4242 4242 4242 4242.",
    pay_success: "Payment successful — downloads unlocked.",
    acct_head: "Account", acct_purchases: "Purchases",
    acct_none: "No purchases yet.",
    acct_order: (n, total, date) => `${n} asset(s) · ${total} · ${date}`,
    dl_package: "Get the package", purchased: "Purchased ✓",
    dl_by_email: "Request logged — we email the full package to your account address.",
    nav_request: "Request an asset",
    req_head: "Request a custom asset",
    req_sub: "Tell us what your sim needs — we build new assets on request and reply by email.",
    req_title: "What do you need?", req_detail: "Details",
    req_ref: "Reference link (optional)", req_submit: "Submit request",
    req_sending: "Submitting…",
    req_ok: "Request received — we will get back to you by email.",
    req_err: "Could not submit — try again or email us directly.",
    kind_articulated: "ARTICULATED", kind_rigid: "RIGID", featured: "FEATURED",
    overview: "OVERVIEW", joints: "JOINTS", physics: "PHYSICS", files: "FILES",
    k_category: "Category", k_source: "Source", k_dof: "DOF", k_formats: "Formats",
    k_mass: "Mass", k_friction: "Friction", k_restitution: "Restitution",
    k_material: "Material", k_engine: "Engine",
    preview: "Preview GLB", add_cart: "Add to cart", in_cart: "In cart ✓",
    meta_note: "Purchase unlocks delivery of the full package — URDF / MJCF / USD, visual meshes with PBR textures, convex collision bodies and the physics report. Previews on this page are offline renders of that package.",
    clip_hinge: "Hinge motion", clip_collision: "Collision bodies",
    clip_physics: "Physics drop",
    rigid_label: "rigid", dof_suffix: "DOF",
  },
  zh: {
    nav_home: "Animis AI", nav_cart: "选购清单",
    stat_online: "件资产在线",
    f_all: "全部", f_articulated: "铰接", f_rigid: "刚体",
    search_ph: "搜索…", empty: "没有匹配的资产",
    empty_none: "资产上架中。告诉我们你的仿真需要哪些资产。",
    cart_head: "选购清单", cart_checkout: "去支付", cart_total: "合计",
    cart_note: "支付成功后，清单内所有资产解锁下载。结算需要先登录。",
    cart_empty: "清单是空的——在资产详情页点击「加入选购」。",
    nav_signin: "登录",
    auth_signin: "登录", auth_register: "注册", auth_signout: "退出登录",
    auth_email: "邮箱", auth_password: "密码",
    auth_noaccount: "还没有账号？", auth_haveaccount: "已有账号？",
    auth_sub_demo: "沙盒账号——仅保存在当前浏览器。",
    auth_sub_live: "登录后即可购买并下载资产。",
    auth_name: "姓名", auth_org: "机构 / 学校 / 公司",
    auth_followup: "接受我们后续就资产使用情况进行回访。",
    auth_err_badcreds: "邮箱或密码不正确。",
    auth_err_exists: "该邮箱已注册，请直接登录。",
    auth_err_generic: "出错了，请重试。",
    auth_err_profile: "请填写姓名和机构/学校。",
    lic_head: "许可协议",
    lic_sub: "购买前请阅读——你的确认将随订单一并记录。",
    lic_t1: "资产仅授权你本人（及你所在团队/课题组）用于自己的研究、开发、训练与评测。",
    lic_t2: "不得转卖、再授权、二次分发，或公开托管资产及衍生资产包。",
    lic_t3: "你的注册信息与本次确认将与购买记录一同留档。",
    lic_agree_label: "我已阅读并同意上述协议。",
    lic_continue: "同意并继续支付",
    pay_head: "结算",
    pay_sandbox: "沙盒支付——不产生真实扣款。测试卡号 4242 4242 4242 4242。",
    pay_card: "卡号", pay_exp: "有效期",
    pay_submit: (total) => `支付 ${total}`,
    pay_processing: "处理中…",
    pay_err_card: "支付被拒——沙盒环境请使用测试卡号 4242 4242 4242 4242。",
    pay_success: "支付成功——下载已解锁。",
    acct_head: "账户", acct_purchases: "已购资产",
    acct_none: "还没有购买记录。",
    acct_order: (n, total, date) => `${n} 件 · ${total} · ${date}`,
    dl_package: "获取资产包", purchased: "已购买 ✓",
    dl_by_email: "已记录——完整资产包将发送到你的注册邮箱。",
    nav_request: "定制需求",
    req_head: "提交定制资产需求",
    req_sub: "告诉我们你的仿真需要什么——我们按需求新建资产，并通过邮件回复。",
    req_title: "需要什么资产？", req_detail: "详细说明",
    req_ref: "参考链接（可选）", req_submit: "提交需求",
    req_sending: "提交中…",
    req_ok: "需求已收到——我们会尽快邮件回复。",
    req_err: "提交失败——请重试或直接给我们发邮件。",
    kind_articulated: "铰接", kind_rigid: "刚体", featured: "精选",
    overview: "概览", joints: "关节", physics: "物理", files: "文件",
    k_category: "品类", k_source: "来源", k_dof: "自由度", k_formats: "格式",
    k_mass: "质量", k_friction: "摩擦", k_restitution: "恢复系数",
    k_material: "材质", k_engine: "引擎",
    preview: "预览 GLB", add_cart: "加入选购", in_cart: "已在清单 ✓",
    meta_note: "购买后解锁下载。正式商店交付完整资产包（URDF + 逐链接网格 + 碰撞凸包 + 物理报告）；沙盒环境交付压缩 GLB。",
    clip_hinge: "铰链开合", clip_collision: "碰撞体",
    clip_physics: "物理掉落",
    rigid_label: "刚体", dof_suffix: "DOF",
  },
};

const state = {
  assets: [], filter: "all", query: "", sheetTimer: null, sheetAsset: null,
  lang: localStorage.getItem("simgen-lang")
    || ((navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en"),
};
const t = (key) => I18N[state.lang][key];

const cart = {
  items: JSON.parse(localStorage.getItem("simgen-cart") || "[]"),
  save() { localStorage.setItem("simgen-cart", JSON.stringify(this.items)); },
  has(slug) { return this.items.includes(slug); },
  add(slug) { if (!this.has(slug)) { this.items.push(slug); this.save(); renderCart(); } },
  remove(slug) { this.items = this.items.filter((s) => s !== slug); this.save(); renderCart(); },
};

const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const overlay = document.getElementById("overlay");
const sheetViewer = document.getElementById("sheet-viewer");
const sheetMeta = document.getElementById("sheet-meta");

init();

async function init() {
  applyLang();
  const manifest = await fetch("data/assets.json", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  state.assets = manifest?.assets ?? [];
  document.getElementById("stat-count").textContent = state.assets.length;
  document.getElementById("stats").hidden = state.assets.length === 0;
  render();
  renderCart();

  document.getElementById("chips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    state.filter = chip.dataset.filter;
    render();
  });

  document.getElementById("search").addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    render();
  });

  document.getElementById("lang-toggle").addEventListener("click", (e) => {
    e.preventDefault();
    state.lang = state.lang === "en" ? "zh" : "en";
    localStorage.setItem("simgen-lang", state.lang);
    applyLang();
    render();
    renderCart();
    updateAccountLink();
    if (!overlay.hidden && state.sheetAsset) openSheet(state.sheetAsset);
  });

  document.getElementById("sheet-close").addEventListener("click", closeSheet);
  document.getElementById("overlay-backdrop").addEventListener("click", closeSheet);

  const cartOverlay = document.getElementById("cart-overlay");
  document.getElementById("cart-link").addEventListener("click", (e) => {
    e.preventDefault();
    renderCart();
    cartOverlay.hidden = false;
  });
  document.getElementById("cart-close").addEventListener("click", () => { cartOverlay.hidden = true; });
  document.getElementById("cart-backdrop").addEventListener("click", () => { cartOverlay.hidden = true; });
  document.getElementById("cart-checkout").addEventListener("click", checkout);

  /* ---- accounts ---- */
  await account.init();
  account.onChange(() => {
    updateAccountLink();
    renderCart();
    if (!overlay.hidden && state.sheetAsset) openSheet(state.sheetAsset);
  });
  updateAccountLink();

  document.getElementById("account-link").addEventListener("click", (e) => {
    e.preventDefault();
    if (account.user) openAcctModal(); else openAuthModal();
  });
  document.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", () => closeModal(el.dataset.close)));
  document.getElementById("auth-switch").addEventListener("click", (e) => {
    e.preventDefault();
    state.authMode = state.authMode === "signin" ? "register" : "signin";
    paintAuthModal();
  });
  document.getElementById("auth-form").addEventListener("submit", onAuthSubmit);
  document.getElementById("pay-form").addEventListener("submit", onPaySubmit);
  document.getElementById("lic-form").addEventListener("submit", onLicenseSubmit);
  document.getElementById("lic-agree").addEventListener("change", (e) => {
    document.getElementById("lic-submit").disabled = !e.target.checked;
  });
  document.getElementById("acct-signout").addEventListener("click", async () => {
    await account.signOut();
    closeModal("acct");
  });

  const requestFlow = (e) => {
    e.preventDefault();
    if (!account.user) { openAuthModal(openReqModal); return; }   // login first
    openReqModal();
  };
  document.getElementById("request-link").addEventListener("click", requestFlow);
  document.getElementById("empty-request").addEventListener("click", requestFlow);
  document.getElementById("req-form").addEventListener("submit", onReqSubmit);

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    for (const m of ["auth", "lic", "pay", "acct", "req"]) {
      const el = document.getElementById(`${m}-overlay`);
      if (!el.hidden) { el.hidden = true; return; }
    }
    if (!cartOverlay.hidden) cartOverlay.hidden = true;
    else if (!overlay.hidden) closeSheet();
  });
}

/* -------------------------------------------------- account UI + payment */

function updateAccountLink() {
  const el = document.getElementById("account-link");
  el.textContent = account.user ? account.user.email.split("@")[0] : t("nav_signin");
}

function closeModal(name) { document.getElementById(`${name}-overlay`).hidden = true; }

function openAuthModal(afterAuth) {
  state.authMode = "signin";
  state.afterAuth = afterAuth || null;
  paintAuthModal();
  document.getElementById("auth-error").hidden = true;
  document.getElementById("auth-overlay").hidden = false;
  document.getElementById("auth-email").focus();
}

function paintAuthModal() {
  const reg = state.authMode === "register";
  document.getElementById("auth-title").textContent = t(reg ? "auth_register" : "auth_signin");
  document.getElementById("auth-submit").textContent = t(reg ? "auth_register" : "auth_signin");
  document.getElementById("auth-switch-label").textContent = t(reg ? "auth_haveaccount" : "auth_noaccount");
  document.getElementById("auth-switch").textContent = t(reg ? "auth_signin" : "auth_register");
  document.getElementById("auth-sub").textContent = t(account.isDemo ? "auth_sub_demo" : "auth_sub_live");
  document.getElementById("auth-profile").hidden = !reg;
  document.getElementById("auth-name").required = reg;
  document.getElementById("auth-org").required = reg;
}

async function onAuthSubmit(e) {
  e.preventDefault();
  const err = document.getElementById("auth-error");
  err.hidden = true;
  const email = document.getElementById("auth-email").value;
  const pw = document.getElementById("auth-password").value;
  try {
    if (state.authMode === "register") {
      const profile = {
        name: document.getElementById("auth-name").value.trim(),
        org: document.getElementById("auth-org").value.trim(),
        followup_ok: document.getElementById("auth-followup").checked,
      };
      if (!profile.name || !profile.org) {
        err.textContent = t("auth_err_profile");
        err.hidden = false;
        return;
      }
      await account.register(email, pw, profile);
      record("register", { email: email.trim().toLowerCase(), ...profile });
    } else {
      await account.signIn(email, pw);
    }
    closeModal("auth");
    if (state.afterAuth) { const fn = state.afterAuth; state.afterAuth = null; fn(); }
  } catch (ex) {
    const key = ex.message === "badcreds" ? "auth_err_badcreds"
      : ex.message === "exists" ? "auth_err_exists" : "auth_err_generic";
    err.textContent = t(key);
    err.hidden = false;
  }
}

/* -------------------------------------------- record keeping (see TODO.md)
   Every registration, license acceptance and purchase is appended to a local
   log, and mirrored to CONFIG.requests.endpoint (Formspree/webhook -> email)
   when one is configured, so the owner holds a copy of every record. In
   supabase mode the backend additionally keeps them server-side. */
const LICENSE_VERSION = "v1-2026-09-03";

function record(kind, data) {
  const entry = { kind: `simgen-${kind}`, ...data,
                  page: location.href, at: new Date().toISOString() };
  const log = JSON.parse(localStorage.getItem("simgen-records") || "[]");
  log.push(entry);
  localStorage.setItem("simgen-records", JSON.stringify(log));
  if (CONFIG.requests.endpoint) {
    fetch(CONFIG.requests.endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(entry),
    }).catch(() => {});                       // best-effort mirror, never blocks UX
  }
}

/* ------------------------------------------------- license agreement gate */
function openLicenseModal() {
  const agree = document.getElementById("lic-agree");
  agree.checked = false;
  document.getElementById("lic-submit").disabled = true;
  document.getElementById("lic-error").hidden = true;
  document.getElementById("lic-overlay").hidden = false;
}

function onLicenseSubmit(e) {
  e.preventDefault();
  if (!document.getElementById("lic-agree").checked) return;
  state.license = { version: LICENSE_VERSION, acceptedAt: new Date().toISOString() };
  record("license-accept", {
    email: account.user.email,
    version: LICENSE_VERSION,
    slugs: [...cart.items],
  });
  closeModal("lic");
  if (account.isDemo) openPayModal();
  else account.startRealCheckout([...cart.items], state.license);
}

function openPayModal() {
  const items = cart.items.map((slug) => state.assets.find((x) => x.slug === slug))
    .filter(Boolean);
  const total = items.reduce((s, a) => s + priceOf(a), 0);
  state.payTotal = total;
  document.getElementById("pay-summary").innerHTML = items.map((a) =>
    `<div class="pay-line"><span>${aName(a)}</span><b>${fmt(priceOf(a))}</b></div>`).join("") +
    `<div class="pay-line pay-line-total"><span>${t("cart_total")}</span><b>${fmt(total)}</b></div>`;
  const err = document.getElementById("pay-error");
  err.hidden = true;
  const btn = document.getElementById("pay-submit");
  btn.disabled = false;
  btn.textContent = I18N[state.lang].pay_submit(fmt(total));
  document.getElementById("pay-overlay").hidden = false;
}

async function onPaySubmit(e) {
  e.preventDefault();
  const err = document.getElementById("pay-error");
  const btn = document.getElementById("pay-submit");
  const card = document.getElementById("pay-card").value.replace(/\s+/g, "");
  err.hidden = true;
  if (card !== "4242424242424242") {
    err.textContent = t("pay_err_card");
    err.hidden = false;
    return;
  }
  btn.disabled = true;
  btn.textContent = t("pay_processing");
  await new Promise((r) => setTimeout(r, 900));      // sandbox latency
  const slugs = [...cart.items];
  await account.completeSandboxPurchase(slugs, state.payTotal, state.license);
  record("purchase", {
    email: account.user.email,
    slugs,
    total: state.payTotal,
    currency: CONFIG.pricing.currency,
    license: state.license,
  });
  state.license = null;
  cart.items = [];
  cart.save();
  renderCart();
  closeModal("pay");
  document.getElementById("cart-overlay").hidden = true;
  toast(t("pay_success"));
}

async function openAcctModal() {
  const p = account.user.profile;
  document.getElementById("acct-email").textContent =
    (p?.name ? `${p.name} · ${p.org} · ` : "") + account.user.email +
    (account.isDemo ? " · sandbox" : "");
  const box = document.getElementById("acct-purchases");
  const orders = await account.purchases();
  if (!orders.length) {
    box.innerHTML = `<p class="cart-empty">${t("acct_none")}</p>`;
  } else {
    box.replaceChildren(...orders.map((o) => {
      const el = document.createElement("div");
      el.className = "acct-order";
      const date = (o.at || "").slice(0, 10);
      el.innerHTML = `<div class="acct-order-head">${I18N[state.lang].acct_order(
          o.slugs.length, fmt(o.total), date)}</div>` +
        o.slugs.map((s) => {
          const a = state.assets.find((x) => x.slug === s);
          return `<div class="acct-item"><span>${a ? aName(a) : s}</span>
            <a href="#" class="dl-mini" data-slug="${s}">${t("dl_package")}</a></div>`;
        }).join("");
      el.querySelectorAll(".dl-mini").forEach((lnk) =>
        lnk.addEventListener("click", (ev) => { ev.preventDefault(); downloadAsset(lnk.dataset.slug); }));
      return el;
    }));
  }
  document.getElementById("acct-overlay").hidden = false;
}

async function downloadAsset(slug) {
  const url = await account.downloadUrl(slug);
  if (!url) {                       // sandbox: packages are not hosted here
    record("download-request", { email: account.user?.email, slug });
    toast(t("dl_by_email"));
    return;
  }
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}.zip`;
  a.click();
}

/* --------------------------------------------------- custom asset requests */

function openReqModal() {
  document.getElementById("req-error").hidden = true;
  document.getElementById("req-overlay").hidden = false;
  document.getElementById("req-title").focus();
}

async function onReqSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById("req-submit");
  const err = document.getElementById("req-error");
  err.hidden = true;
  const payload = {
    kind: "simgen-asset-request",
    user: account.user.email,
    title: document.getElementById("req-title").value.trim(),
    detail: document.getElementById("req-detail").value.trim(),
    reference: document.getElementById("req-ref").value.trim(),
    page: location.href,
    at: new Date().toISOString(),
  };
  // always keep a local record (the site's own log of what was asked)
  const log = JSON.parse(localStorage.getItem("simgen-requests") || "[]");
  log.push(payload);
  localStorage.setItem("simgen-requests", JSON.stringify(log));

  if (CONFIG.requests.endpoint) {
    btn.disabled = true;
    btn.textContent = t("req_sending");
    try {
      const res = await fetch(CONFIG.requests.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("http " + res.status);
      closeModal("req");
      e.target.reset();
      toast(t("req_ok"));
    } catch {
      err.textContent = t("req_err");
      err.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = t("req_submit");
    }
  } else {
    // no endpoint configured: hand off via a pre-filled email so the request
    // still reaches the owner immediately
    const subject = encodeURIComponent(`[Asset request] ${payload.title}`);
    const body = encodeURIComponent(
      `From: ${payload.user}\n\n${payload.detail}\n\nReference: ${payload.reference || "—"}\n\nSent from ${payload.page}`);
    location.href = `mailto:${CONFIG.requests.notifyEmail}?subject=${subject}&body=${body}`;
    closeModal("req");
    e.target.reset();
    toast(t("req_ok"));
  }
}

let toastTimer = null;
function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
}

function applyLang() {
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const s = I18N[state.lang][el.dataset.i18n];
    if (typeof s === "string") el.textContent = s;
  });
  document.getElementById("search").placeholder = t("search_ph");
  document.getElementById("lang-toggle").textContent = state.lang === "en" ? "中文" : "EN";
}

const aName = (a) => (state.lang === "zh" ? a.name_cn : a.name_en);
const aNameAlt = (a) => (state.lang === "zh" ? a.name_en : a.name_cn);

function matches(a) {
  if (state.filter === "articulated" && a.kind !== "articulated") return false;
  if (state.filter === "rigid" && a.kind !== "rigid") return false;
  if (state.query) {
    const hay = `${a.slug} ${a.name_cn} ${a.name_en} ${a.category} ${a.dataset || ""}`.toLowerCase();
    if (!hay.includes(state.query)) return false;
  }
  return true;
}

function render() {
  const catalogueEmpty = state.assets.length === 0;
  // no catalogue yet: hide the filter bar entirely and invite a request instead
  document.getElementById("controls").hidden = catalogueEmpty;
  document.getElementById("empty-text").textContent = t(catalogueEmpty ? "empty_none" : "empty");
  document.getElementById("empty-request").hidden = !catalogueEmpty;

  const list = state.assets.filter(matches);
  empty.hidden = list.length > 0;
  grid.replaceChildren(...list.map(card));
}

function card(a) {
  const el = document.createElement("article");
  el.className = "card" + (a.hero ? " is-hero" : "");
  el.innerHTML = `
    <div class="card-media">
      <img loading="lazy" src="assets/${a.slug}/poster.jpg" alt="${a.name_en}">
      ${cardClip(a) ? `<video muted loop playsinline preload="none" src="assets/${a.slug}/${cardClip(a)}"></video>` : ""}
    </div>
    <div class="card-body">
      <div class="card-name">${aName(a)}</div>
      <div class="card-badges">
        <span class="badge dof">${a.dof ? `${a.dof} ${t("dof_suffix")}` : t("rigid_label")}</span>
        ${a.formats.map((f) => `<span class="badge">${f}</span>`).join("")}
      </div>
    </div>`;
  const video = el.querySelector("video");
  if (video) {
    el.addEventListener("mouseenter", () => {
      video.classList.add("ready");
      video.play().catch(() => {});
    });
    el.addEventListener("mouseleave", () => {
      video.pause();
      video.classList.remove("ready");
    });
  }
  el.addEventListener("click", () => openSheet(a));
  return el;
}

/* ------------------------------------------------------------- the sheet */

/* Detail sheet plays the Blender-rendered clips shipped with the asset —
   the offline renders keep the delivered textures and lighting, which a
   realtime viewer in the page cannot match. */
// hover clip for the grid card: first shipped render, else the legacy demo
function cardClip(a) {
  return a.media?.[0]?.file || (a.demo ? "demo.mp4" : null);
}

function openSheet(a) {
  state.sheetAsset = a;
  sheetViewer.replaceChildren();
  sheetMeta.replaceChildren();

  const clips = a.media || [];
  if (clips.length) {
    const stage = document.createElement("div");
    stage.className = "stage";
    sheetViewer.appendChild(stage);

    const video = document.createElement("video");
    video.className = "clip";
    video.muted = video.loop = video.autoplay = true;
    video.playsInline = true;
    video.poster = `assets/${a.slug}/poster.jpg`;
    stage.appendChild(video);

    const caption = document.createElement("span");
    caption.className = "viewer-hint";
    stage.appendChild(caption);

    const play = (clip) => {
      video.src = `assets/${a.slug}/${clip.file}`;
      caption.textContent = t(`clip_${clip.key}`);
      video.play?.().catch(() => {});
    };

    if (clips.length > 1) {
      const tabs = document.createElement("div");
      tabs.className = "viewer-tabs";
      tabs.innerHTML = clips.map((c, i) =>
        `<button class="vtab${i === 0 ? " active" : ""}" data-i="${i}">${t("clip_" + c.key)}</button>`
      ).join("");
      tabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".vtab");
        if (!btn) return;
        tabs.querySelectorAll(".vtab").forEach((b) => b.classList.toggle("active", b === btn));
        play(clips[+btn.dataset.i]);
      });
      sheetViewer.appendChild(tabs);
    }
    play(clips[0]);
  } else if (a.demo) {
    const video = document.createElement("video");
    video.className = "clip";
    video.src = `assets/${a.slug}/demo.mp4`;
    video.muted = video.loop = video.autoplay = true;
    video.playsInline = true;
    sheetViewer.appendChild(video);
  }

  sheetMeta.innerHTML = metaPanel(a);
  const addBtn = sheetMeta.querySelector(".add-cart");
  if (addBtn) {
    addBtn.classList.toggle("in-cart", cart.has(a.slug));
    addBtn.addEventListener("click", () => {
      cart.add(a.slug);
      addBtn.textContent = t("in_cart");
      addBtn.classList.add("in-cart");
    });
  }
  const dlBtn = sheetMeta.querySelector("[data-dl]");
  if (dlBtn) dlBtn.addEventListener("click", (e) => {
    e.preventDefault();
    downloadAsset(dlBtn.dataset.dl);
  });
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
}




function metaPanel(a) {
  const phys = a.physics || {};
  const kv = (k, v) => `<div class="meta-kv"><span class="k">${k}</span><span class="v">${v}</span></div>`;
  const joints = (a.joints || [])
    .map((j) => {
      const range = j.lower != null && j.upper != null && j.type !== "continuous"
        ? (j.type === "prismatic"
            ? `${(j.upper - j.lower).toFixed(2)} m`
            : `${Math.round((j.upper - j.lower) * 180 / Math.PI)}°`)
        : "∞";
      return `<div class="joint-row"><span class="jt">${j.type}</span><span>${range}</span></div>`;
    })
    .join("");

  return `
    <div class="meta-kind">${a.hero ? t("featured") + " · " : ""}${a.kind === "articulated" ? t("kind_articulated") : t("kind_rigid")}</div>
    <div class="meta-name">${aName(a)}</div>
    <div class="meta-name-en">${aNameAlt(a)}</div>

    <div class="meta-section">
      <h4>${t("overview")}</h4>
      ${kv(t("k_category"), a.category)}
      ${a.dataset ? kv(t("k_source"), a.dataset) : ""}
      ${kv(t("k_dof"), a.dof || t("rigid_label"))}
      ${kv(t("k_formats"), a.formats.join(" · "))}
    </div>

    ${joints ? `<div class="meta-section"><h4>${t("joints")}</h4>${joints}</div>` : ""}

    ${Object.keys(phys).length ? `<div class="meta-section"><h4>${t("physics")}</h4>
      ${phys.mass != null ? kv(t("k_mass"), `${Number(phys.mass).toFixed(2)} kg`) : ""}
      ${phys.friction != null ? kv(t("k_friction"), Number(phys.friction).toFixed(2)) : ""}
      ${phys.restitution != null ? kv(t("k_restitution"), Number(phys.restitution).toFixed(2)) : ""}
      ${phys.material ? kv(t("k_material"), String(phys.material).replace(/_/g, " ")) : ""}
      ${phys.engine ? kv(t("k_engine"), phys.engine) : ""}
    </div>` : ""}

    <div class="meta-section">
      <h4>${t("files")} · <span class="price-tag">${account.owns(a.slug) ? t("purchased") : fmt(priceOf(a))}</span></h4>
      ${account.owns(a.slug)
        ? `<a class="dl" href="#" data-dl="${a.slug}">${t("dl_package")}</a>`
        : `<button class="add-cart" data-slug="${a.slug}">${cart.has(a.slug) ? t("in_cart") : t("add_cart")}</button>`}
      <p class="meta-note">${t("meta_note")}</p>
    </div>`;
}

function closeSheet() {
  overlay.hidden = true;
  document.body.style.overflow = "";
  sheetViewer.replaceChildren();
  state.sheetAsset = null;
  if (state.sheetTimer) { clearInterval(state.sheetTimer); state.sheetTimer = null; }
}

/* ------------------------------------------------------------------ cart */

function renderCart() {
  document.getElementById("cart-count").textContent = cart.items.length;
  const box = document.getElementById("cart-items");
  if (!box) return;
  if (!cart.items.length) {
    box.innerHTML = `<p class="cart-empty">${t("cart_empty")}</p>`;
  } else {
    box.replaceChildren(...cart.items.map((slug) => {
      const a = state.assets.find((x) => x.slug === slug);
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <div>
          <div class="ci-name"><b>${a ? aName(a) : slug}</b><span>${a ? aNameAlt(a) : ""}</span></div>
          <div class="ci-meta">${slug}${a ? ` · ${a.dof ? a.dof + " " + t("dof_suffix") : t("rigid_label")} · ${a.formats.join("/")}` : ""}</div>
        </div>
        <div class="ci-right">
          <span class="ci-price">${a ? fmt(priceOf(a)) : ""}</span>
          <button class="ci-remove" title="remove">×</button>
        </div>`;
      el.querySelector(".ci-remove").addEventListener("click", () => cart.remove(slug));
      return el;
    }));
  }
  const total = cart.items.reduce((s, slug) => {
    const a = state.assets.find((x) => x.slug === slug);
    return s + (a ? priceOf(a) : 0);
  }, 0);
  document.getElementById("cart-total").textContent = cart.items.length ? fmt(total) : "—";
  document.getElementById("cart-checkout").disabled = !cart.items.length;
}

function checkout() {
  if (!cart.items.length) return;
  if (!account.user) { openAuthModal(checkout); return; }   // login gate
  openLicenseModal();                                       // license gate
}
