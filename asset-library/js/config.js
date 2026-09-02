/* Sim-Ready Asset Library store configuration.
 *
 * mode: "demo"     — sandbox accounts + sandbox payment, everything stored in
 *                    this browser's localStorage. Works out of the box on any
 *                    static host. NOT real security: it is a front-end demo of
 *                    the full flow (register → sign in → pay → download).
 * mode: "supabase" — real accounts (Supabase Auth) + real payment (Stripe
 *                    Checkout via an edge function). Fill in the keys below and
 *                    follow SETUP-PAYMENTS.md. Downloads are then served as
 *                    short-lived signed URLs only after a verified purchase.
 */
export const CONFIG = {
  mode: "demo",

  // demo-mode pricing (USD). Per-asset override: `price` field in assets.json.
  pricing: { articulated: 49, rigid: 19, currency: "USD", symbol: "$" },

  supabase: {
    url: "",            // https://<project>.supabase.co
    anonKey: "",        // public anon key (safe to ship client-side)
    checkoutFn: "",     // edge function URL creating a Stripe Checkout session
    downloadFn: "",     // edge function URL minting signed download URLs
  },

  /* Custom-asset requests. endpoint: a Formspree form URL (or any webhook
   * accepting JSON POST) — every submission is emailed to the owner within
   * seconds. Empty endpoint = fall back to a pre-filled mailto so requests
   * still reach notifyEmail. */
  requests: {
    endpoint: "",       // e.g. https://formspree.io/f/XXXXXXXX
    notifyEmail: "animislab@gmail.com",
  },
};
