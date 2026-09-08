# 安全与资产防护

一句话:**这个仓库是 GitHub Pages 静态站,push 上去的每个文件都是公开可下载的。
没有服务器,就没有"防护"可言——唯一有效的防护是:值钱的东西不放这里。**
账号、支付、下载校验现在全在浏览器里跑(demo 档),懂技术的人可以随便绕过;
它没被绕过造成损失,只是因为售卖包本来就不在网站上。

## 现状审计(2026-09-07)

| 内容 | 在公开站上? | 说明 |
|---|---|---|
| 交付包(URDF / MJCF / USD / 原始 OBJ / 贴图 / QC) | 否 | 只在构建机,购买后人工邮件交付 |
| 质量 / 惯量 / 摩擦 / 关节动力学参数 | 是 | `inspect.json` 的 `physics` 块,viewer Details 面板展示(Palatial 同样公开) |
| 三段 Blender 预览视频 + 海报 | 是 | 营销素材,可公开 |
| 查看器视觉网格 `blade_*.glb` | 是 | **与交付件同精度**(共 6 816 三角),含一张 albedo/ORM 贴图 |
| 查看器碰撞体 `collision.glb` | 是 | **27 个凸包全量**,和交付件相同 |
| 关节轴 / 限位 `inspect.json` | 是 | 交互必需 |
| 账号、购买记录 | 访客自己浏览器 | `localStorage`,不是记录系统 |
| 仓库本身 | 公开 | 组织站点仓库必须公开;私有仓库发布出来的文件也一样公开 |

结论:有人可以从网站拼出一个"半成品剪刀"(全精度外观 + 完整凸包 + 关节 + Details
面板里公开的质量/惯量/摩擦),拼不出交付包(三种引擎格式、原贴图、QC、许可、支持)。
物理参数在 viewer 里公开展示是有意为之——它是买家判断"这资产靠不靠谱"的依据,
Palatial 也全部公开。**这是任何网页 3D
查看器的固有属性**:WebGL 里显示过的网格都能被 GPU 抓帧工具提取,Sketchfab、
Palatial 也一样。所以策略不是"防提取",而是**让独占价值留在包里**。

## 内测例外(2026-09-08,用户决定)

内测期间资产包**直接放在站上供下载**:`asset-library/packages/<12 位随机串>/<名字>.zip`。
这是一个公开 URL——"登录 → 许可 → 问卷 → 下载"只是前端的门,拿到链接的人不填问卷也能下。
用户知晓并接受,理由是内测阶段收集问卷比防泄露重要。压风险的三条:路径随机、`robots.txt`
不索引、链接不在任何页面 HTML 里明文出现(点击时由 JS 拼出)。CI 闸门对这个目录放行,但只许
`zip` 且必须在随机目录下。**转正式收款时第一件事就是把 packages/ 删掉**,下载改走第三节的签名 URL。

## 已落地的闸门

1. `scripts/check-public-tree.sh`,GitHub Actions 部署前必跑,命中即停止发布:
   - 全树禁止可售/源格式:`urdf mjcf xml usd* obj mtl stl dae fbx ply tar.gz zip 7z rar`
   - `asset-library/assets/` 白名单:只许 `mp4 webm jpg png webp glb json`
   - 扫密钥:Stripe `sk_live_/sk_test_`、Supabase `service_role`、私钥、JWT
   本地先跑:`bash scripts/check-public-tree.sh`
2. `asset-library/.gitignore`:`/assets/*` 默认全部不入库,上架资产逐个显式放行。
3. `robots.txt`:预览文件与查看器不进搜索引擎索引(只是不主动分发直链,不是访问控制)。
4. 下载入口 demo 档一律"邮件交付",网站上不存在任何可下载的售卖包 URL。

## 收款前必须完成(按顺序)

在 `CONFIG.mode` 从 `demo` 切到正式之前,下面每一条都要做完。原则:**凡是决定
"给不给文件"的判断,必须发生在服务端,并且以支付平台的回调为准,不信任前端。**

1. **账号上服务端**:Supabase Auth。`profiles`、`purchases`、`license_acceptances`
   三张表全部开 RLS,访客只能读自己 `user_id = auth.uid()` 的行,不能写 `purchases`。
2. **支付走 Stripe Checkout,购买记录只由 webhook 写**:
   Edge Function 收 `checkout.session.completed`,校验 `Stripe-Signature`,
   再 `insert purchases`。前端"支付成功"页面只是展示,不是凭证。
   价格定义在 Stripe Price 对象上,前端 `assets.json` 的价格只用于显示。
3. **售卖包放私有存储**(Supabase Storage 私有 bucket / Cloudflare R2),
   永远不进本仓库。下载 Edge Function:校验 JWT → 查 `purchases` 有该 `asset_id`
   → 签发 **60 秒、一次性** 的签名 URL,并把 `(user_id, asset_id, ip, at)` 写入
   `downloads` 表。签名 URL 泄露也只值一分钟。
4. **许可协议留痕在库里**:`license_acceptances(user_id, asset_id, version, at, ip)`,
   `downloadFn` 没有这一行就拒绝签发。
5. **买家水印**:交付包按买家打包(打包脚本已有 `commercial-delivery` 技能可接):
   网格顶点加买家哈希的微扰(1e-5 m 级,肉眼与仿真不可见)+ URDF 注释里写订单号,
   泄露出去能追溯到人。这是资产售卖行业追责的标准做法。
6. **密钥只放 Supabase Secrets / GitHub Environment Secrets**:仓库里只允许
   `anonKey`(设计上可公开,靠 RLS 保护)。Stripe secret、`service_role` 永远不进仓库,
   闸门脚本会扫。
7. **记录端点加校验**:`records.endpoint`(Apps Script / Formspree)是公开端点,会被刷;
   改为 Edge Function + Turnstile 人机验证 + 每 IP 限流。
8. **页面加 CSP**:GitHub Pages 不能设响应头,用
   `<meta http-equiv="Content-Security-Policy">` 把 `script-src` 锁到
   `'self' https://js.stripe.com https://*.supabase.co`,`connect-src` 同理,
   降低第三方脚本被劫持后的影响。上线 Supabase/Stripe 后再加,避免提前把自己拦住。
9. **关闭 demo 档**:`account.js` 的 localStorage 分支在正式模式下彻底不可达,
   不是"有后端就优先后端"。

## 预览暴露的取舍(产品决定,不是技术决定)

现在查看器给的是全精度外观 + 全量凸包 + 物理参数。如果要收紧:

- 碰撞体:查看器用每个凸包 40% 顶点的简化版,肉眼看不出,但拿去仿真会漏碰撞;
- 视觉网格:现在是全精度,降到 1 500 三角以内并去掉贴图(用纯材质常量),看起来仍是
  "金属剪刀",但没人会拿它当资产用;
- 关节参数:必须保留,否则不能交互。

代价是查看器观感下降,和前面"产品级渲染"的目标相冲。建议:**示范资产(剪刀)
保持现状当橱窗;真正贵的资产上架时用简化版预览。**

## 不需要做的

- WAF / DDoS 防护:GitHub Pages 自带 CDN 与限流,静态站没有可打的后端。
- 前端代码混淆:文件本来公开,混淆只会拖慢自己排错。
- 给 GLB 加密再在前端解密:密钥必然在前端,一个断点就拿到,行业里已被反复证伪。
