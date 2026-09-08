/* SimGallery (Sim-Ready Asset Library) store configuration.
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

  /* 内测:所有资产免费领取。前提是领取前填写一份问卷(单位 / 职位 / 未来几年的资产需求量 /
   * 可接受售价区间 / 资产要求),并与注册信息、许可确认一起留痕。enabled=false 即恢复付费流程。 */
  beta: { enabled: true },

  /* 留痕收口:注册 / 许可确认 / 内测问卷 / 免费领取 / 下载申请 / 定制需求,每条记录都 POST 到这里。
   * 推荐 Google Apps Script 网页应用(直接写进 Google 表格,配置步骤见 RECORDS.md);Formspree 也可。
   * 为空时记录只存访客自己的浏览器(localStorage),问卷走 mailto 兜底——不会自动到我们手里。 */
  records: { endpoint: "", notifyEmail: "animislab@gmail.com" },

  /* Custom-asset requests. endpoint: a Formspree form URL (or any webhook
   * accepting JSON POST) — every submission is emailed to the owner within
   * seconds. Empty endpoint = fall back to a pre-filled mailto so requests
   * still reach notifyEmail. */
  requests: {
    endpoint: "",       // e.g. https://formspree.io/f/XXXXXXXX
    notifyEmail: "animislab@gmail.com",
  },
};
