# 登录 / 支付 / 需求表单 — 配置说明

站点是 GitHub Pages 纯静态托管。**真实的"支付验证后才可下载"必须有服务端参与**;
因此代码分两档,由 `js/config.js` 切换:

## 1. 沙盒模式(当前,开箱即用)

`CONFIG.mode = "demo"`。注册/登录/购物车/支付/下载解锁全流程可走通:

- 账号与购买记录存在**访客自己的浏览器 localStorage** 里(密码经 SHA-256 加盐哈希)。
- 支付是沙盒:只接受测试卡号 `4242 4242 4242 4242`,不产生真实扣款。
- 支付成功后解锁的是站上托管的压缩 GLB(完整 URDF 资产包不在静态站上,
  正式交付走 live 模式的签名 URL)。

**如实说明**:demo 档没有服务端,一切校验在前端,懂技术的访客可以绕过。
切正式模式前必须完成的服务端校验清单见仓库根目录 `SECURITY.md`(下载只能由服务端按支付回调签发)。
它是完整购买体验的演示,不是防盗链。

## 2. 正式模式(Supabase + Stripe)

`CONFIG.mode = "supabase"`,填入 `supabase.url / anonKey / checkoutFn / downloadFn`。

需要你开两个账号(都有免费层):**Supabase**(账号系统+数据库+边缘函数+私有存储)
和 **Stripe**(收款;中国大陆主体也可考虑 Lemon Squeezy / Paddle 这类 MoR 平台)。

服务端三件套(Supabase 侧):

1. 表:`purchases (id, user_id, slugs text[], total numeric, currency text,
   license jsonb, at timestamptz)`,开 RLS:`user_id = auth.uid()` 只读own。
   `license` 存前端传来的 `{version, acceptedAt}`(许可确认留档);
   注册档案(姓名/机构/是否接受回访)在 `auth.users.raw_user_meta_data`,
   前端注册时已通过 `signUp options.data` 写入。
2. 边缘函数 `checkout`:验证 JWT → 按 slugs 计价 → `stripe.checkout.sessions.create`
   (metadata 带 user_id+slugs)→ 返回 Stripe 支付页 URL。
   Stripe webhook(`checkout.session.completed`)→ 写入 `purchases` 表。
3. 边缘函数 `download`:验证 JWT → 查 `purchases` 确认已购 → 对私有 Storage 里的
   资产包 zip 生成 60 秒签名 URL 返回。**下载校验发生在服务端,这一档是真门禁。**

前端代码已经按这个接口写好(`js/account.js` 的 SupabaseBackend),填钥匙即通。

## 3. 定制需求表单的"及时通知"

`CONFIG.requests.endpoint`:

- **最快路径(推荐先用)**:注册 [Formspree](https://formspree.io)(免费 50 条/月),
  建一个 form,把 `https://formspree.io/f/XXXX` 填进 endpoint。此后每条需求
  **数秒内邮件送达** `animislab@gmail.com`,Formspree 后台留存全部记录。
- endpoint 留空时的兜底:提交会拉起访客邮件客户端,预填好需求内容发给你。
- 进阶:走 Supabase 表 + Database Webhook,可同时推**飞书/钉钉群机器人**
  (服务端转发,浏览器直连群机器人会被 CORS 拦)+ 邮件(Resend 免费层)。

## 记录留痕(注册 / 许可确认 / 购买)

前端在三个节点各记一条:注册(邮箱+姓名+机构+是否接受回访)、支付前的许可
协议确认(版本号+时间+资产清单)、支付完成(订单)。每条记录:

- 永远追加到访客浏览器 `localStorage["simgen-records"]`(demo 档的本地留档);
- `CONFIG.requests.endpoint` 配置了 Formspree/webhook 时,同步 POST 一份——
  **配好 endpoint 你的邮箱就有全部注册与购买记录**(强烈建议上线前配好);
- supabase 档另有服务端留档(user metadata + purchases.license)。

购买流程强制顺序:登录 → 许可协议(勾选"已阅读并同意"才能继续)→ 支付;
未登录点结算会先弹注册/登录。协议文本版本号在 `js/app.js` 的
`LICENSE_VERSION`,改协议时同步升版本号,历史记录即可区分新旧协议。

## 定价

`CONFIG.pricing`:铰接 $49 / 刚体 $19(占位价,直接改);单件覆盖:给
`data/assets.json` 里的资产加 `price` 字段。
