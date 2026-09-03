# 开发清单 / Development TODO

单一事实来源:站点与商店的所有待办都记在这里。
`[owner]` = 需要仓库所有者亲自操作(账号/权限/付费决策),代码侧无法代劳。

## P0 — 一键即通的阻塞项

- [ ] `[owner]` 决定资产何时上线。当前**刻意不发布任何资产**:清单为空,页面走
      "目录尚未上线 + 定制需求"路径;已烘焙的资产暂存构建机
      `asset-library/assets_staged/`。恢复方式见 `README.md`。
- [ ] `[owner]` 建公开空仓库 **`Animis-AI/animis-ai.github.io`**
      (https://github.com/organizations/Animis-AI/repositories/new ,不勾 README)。
      公司落地页("We build the world engine for physical AI",双语)已在服务器
      `animis-home/` 备好,建完仓库执行 `git push -u origin main` 即自动部署。
- [ ] `[owner]` 服务器上执行一次
      `sudo chmod -R a+rX .../outputs/textured_release_gpt_image_2_hunyuan_production_v1`,
      解锁 root:600 的成品网格 → 补烘焙剩余铰接资产的交互 GLB
      (`pipeline/bake_all.sh` → `build_manifest.py` → push)。

## P1 — 支付从沙盒切正式(当前线上是 demo 档)

> 现状如实说明:GitHub Pages 纯静态,线上支付是**沙盒**——账号存访客浏览器
> localStorage、只认测试卡 4242 4242 4242 4242、不产生真实扣款、前端校验可被
> 绕过。它演示完整购买流程,不是真门禁。真门禁 = 下面这组服务端。

- [ ] `[owner]` 选定收款主体与通道:Stripe(海外主体)或 Lemon Squeezy / Paddle
      (MoR,中国大陆主体更省事)。定了通道我来写对应边缘函数。
- [ ] `[owner]` 开 Supabase 项目(免费层够用),把 `url` / `anonKey` 填进
      `js/config.js`,`mode` 切 `"supabase"`。
- [ ] 建 `purchases` 表 + RLS(`user_id = auth.uid()` 只读己方),见
      `SETUP-PAYMENTS.md`。
- [ ] 边缘函数 `checkout`:JWT 校验 → 服务端计价 → 创建 Stripe Checkout
      session(metadata 带 user_id + slugs)→ 返回支付页 URL。
- [ ] Stripe webhook(`checkout.session.completed`)→ 写 `purchases` 表。
- [ ] 边缘函数 `download`:JWT + 已购校验 → 私有 Storage 签名 URL(60s)。
- [ ] `[owner]` 把**完整资产包**(URDF + 逐链接网格 + 碰撞凸包 + 物理报告,
      按 slug 打 zip)上传私有 Storage——目前站上只有预览 GLB,沙盒"下载"
      交付的也是 GLB,正式档必须换成完整包。
- [ ] 定价复核:现为占位价(铰接 $49 / 刚体 $19,`config.js`);单件覆盖用
      `assets.json` 的 `price` 字段。
- [ ] 收款前的合规页:许可条款 / 退款政策 / 服务条款(页脚链接)。

## P2 — 定制需求表单的通知升级

- [ ] `[owner]` 注册 Formspree(免费 50 条/月),把 form 地址填进
      `config.js → requests.endpoint`——每条需求数秒内邮件送达,后台留存。
      (当前兜底:拉起访客邮件客户端预填发送,依赖访客配了邮件客户端。)
- [ ] 上了 Supabase 后:需求写表 + Database Webhook 推飞书/钉钉群机器人 + 邮件
      (浏览器直连群机器人被 CORS 拦,必须服务端转发)。
- [ ] 需求看板:账号页里给访客展示自己提交的需求与处理状态。

## P3 — 资产内容与质量

- [ ] **oven_0001 侧/背面贴图发黑**(站内 sim-ready 展示样例,已定位根因:
      参考相机只拍正面,侧/背无观测,烘焙掠射色调拖暗)。修复二选一:
      ① 加背/侧 gpt-image-2 exterior 参考各一张,走 v4 投影管线(每资产 +2 张付费图);
      ② 零成本:无观测外壳面用正面参考的板材中值色重锚(TRELLIS.2 场只保结构)。
- [ ] 软体资产包 v1.1(T 恤 + 抱枕,已加 Isaac PhysX 物理写入版):
      `[owner]` 执行 `sudo mv` 把 staging 换回只读 delivery 目录。
- [ ] 两份 Isaac 物理 USD 在真·Isaac Sim 里跑一遍最终验证(本机无 Isaac Sim,
      目前是 usd-core 结构校验 + Blender 等价解算演示)。
- [ ] 抱枕缺 Isaac 版演示片;可在有 Isaac Sim 的机器上补渲。
- [ ] 软体资产(T 恤/抱枕)是否上架资产库(需烘 GLB 预览 + 定价)。

## P-AnyEgo — 数据扩增/自动标注 SaaS(页面已上线,后端待建)

> 现状:https://animis-ai.github.io/anyego/ 已上线——产品页 + **纯浏览器内的
> 真实扩增演示**(用户选本地视频,亮度/对比/色相/裁切/变速/噪声实时预览,
> 可生成 4 变体、导出 webm,视频不出本机)+ 标注示例(手部姿态输出为我们
> 管线的真实结果)+ API 规格 + 申请接入入口。**云端处理与 API 尚未存在**,
> 页面上已如实标注 private beta。

- [ ] `[owner]` 决策云端算力放哪:自有 GPU 服务器暴露服务 / 租云 GPU
      (Modal、RunPod、阿里云 FC-GPU)。标注模型(手部姿态/检测/分割/描述)
      在自有管线里已有,需要包成推理服务。
- [ ] API 网关:`/v1/videos`(上传→对象存储)、`/v1/augment`、`/v1/annotate`、
      `/v1/jobs/{id}`、webhook,按页面上已发布的规格实现(规格即合同)。
- [ ] API Key 签发与计量计费(可先人工发 Key + 按月账单,规模化再接 Stripe
      metered billing)。
- [ ] 扩增算子服务端实现(ffmpeg/GPU 版,与浏览器演示同参数语义、种子可复现)。
- [ ] 队列 + 任务状态存储(Supabase 表可复用)。
- [ ] `[owner]` 申请表单通知:`anyego/index.html` 里 `REQUEST_ENDPOINT` 填
      Formspree(与商店需求表单同一路径)。

## P-交付 — 大文件商品(3DGS / 视频)的交付方案

> 背景:后续要在站内售卖视频与 3DGS(Gaussian Splatting)成品。此类文件
> GB 级,GitHub Pages(公开+仓库体积限制)不能作为付费内容的交付通道。

- [ ] `[owner]` 定交付通道,推荐 **Cloudflare R2 + Worker 签名 URL**:
      R2 出口流量免费(大文件成本差异巨大),Worker 校验购买记录
      (Supabase JWT)后签 60s 限时 URL;S3 兼容,后续可换。
      备选:Supabase Storage(集成最省事,出口流量收费)/
      Lemon Squeezy 托管交付(零代码,单文件体积上限,控制力弱)。
- [ ] 3DGS 商品:交付 `.spz`/`.splat` 压缩格式(比 .ply 小一个量级),
      站内嵌浏览器 splat 预览器(gsplat.js / antimatter15-splat)放**降采样
      低点数预览版**,全分辨率文件付费后签名 URL 下载。
- [ ] 视频商品:公开页放低清预览(或 HLS 片段),母带 mp4/ProRes 付费后
      签名 URL 下载;更强防护再加签名 Cookie/水印,DRM 暂无必要。
- [ ] 资产库完整资产包(URDF zip)与 3DGS/视频统一走同一条签名 URL 通道
      (见 P1 的 download 边缘函数,存储后端换 R2 即可)。

## P4 — 站点体验(非阻塞)

- [ ] 沙盒模式页角标识("Sandbox store — 测试支付"),避免访客误解已在收款。
- [ ] 邮箱验证 / 找回密码(Supabase 自带,demo 档无)。
- [ ] 订单收据邮件(Stripe 自带,开关即可)。
- [ ] 资产详情页放物理报告摘要(质量/摩擦/凸包数已入 manifest,可扩展)。

## 已完成(近期)

- [x] 登录/注册/退出 + 账户订单页(2026-08-22, c3ccdbf)
- [x] 购物车定价、合计、沙盒支付、支付后解锁下载(同上)
- [x] 定制需求表单(登录后提交,邮件通知兜底)(同上)
- [x] 双后端架构 `js/account.js`(demo / Supabase+Stripe)+ `SETUP-PAYMENTS.md`
- [x] 公司落地页代码完成(待 P0 建仓库)
- [x] E2E 冒烟测试:注册→需求→加购→支付→下载解锁→订单入账(puppeteer)
- [x] 双语目录站上线:96 件资产、交互查看、关节驱动(2026-08-21)
- [x] AnyEgo 产品页上线(浏览器内扩增演示 + 标注示例 + API 规格 + 申请入口),
      落地页与资产库导航已互链(2026-08-22)

## 3D 检视器(2026-09-02)

- 检视器代码已合入(js/inspect3d.js + vendor/three);资产带 `inspect: true`
  且存在 `assets/<slug>/inspect/`(由旧仓 pipeline/build_inspect.py 从
  simready URDF 包生成)即出现 预览/视觉/碰撞/叠加 四个 tab。
- 测试资产 oven_0001 已下架(2026-09-03,manifest 恢复空清单);其
  inspect bundle 仍留在本地 `assets/oven_0001/`(gitignore),本地想再看:
  往 `data/assets.json` 塞回条目即可(条目模板见 git log 或重新跑管线)。
- 正式上架时:visual GLB 建议过 gltf-transform 压缩(oven 检视 bundle
  现在 20 MB);build_manifest.py 需补 `inspect` 字段自动检测。
