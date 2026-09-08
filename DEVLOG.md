# 开发文档 · Animis 官网与 SimGallery

本文是这个仓库从 2026-08-22 到 2026-09-08 的开发记录:做了什么、为什么这样做、
踩过哪些坑、下一步是什么。面向接手的人,读完应该能独立上架资产、改界面、上线。
更细的操作命令在 `README.md` 与 `asset-library/README.md`,安全在 `SECURITY.md`,
支付接入在 `asset-library/SETUP-PAYMENTS.md`。

## 1. 现状一览

| 路径 | 内容 | 状态 |
|---|---|---|
| `/` | 公司落地页:slogan + SimGallery 宣传片区块,中英自动切换 | 上线 |
| `/asset-library/` | **SimGallery**(副标题 Sim-Ready Asset Library),资产目录 + 账号 + 购物车 + 许可门禁 | 上线,1 件资产(`laptop_16`) |
| `/asset-library/viewer/` | 浏览器内 3D 查看器(three.js),铰接可拖拽,Details 面板 | 上线 |
| 账号 / 支付 | demo 档(浏览器 localStorage),Supabase + Stripe 接口已预留 | 收款前必须切正式,见 `SECURITY.md` |

技术栈刻意保持最小:纯静态 HTML/CSS/JS,无构建步骤,GitHub Actions 直接发布仓库根目录。
three.js r179 以 ES module 形式 vendored 在 `viewer/vendor/`,不依赖 CDN。

## 2. 时间线

### 2026-08-22 → 08-27 落地页
- 建站:公司落地页(`607af1e`),AnyEgo 产品页(`0cd26a7`,后下线)。
- 多轮排版反复(`1c272ed` … `ac79009`):字体、字号、中文回退栈来回改了六次,最后
  回滚到线上原版。教训:**排版改动先本地预览再提交**,不要在 main 上试。

### 2026-09-02 合仓与品牌
- 采用 current-robotics.com 的字体搭配:正文 Inter、标题 Source Serif 4,暖米白底(`a5abcdd`)。
- 落地页精简到只剩 slogan(`1b02a96`)。
- **两个仓库合成一个**(`415f9ab`):资产库并入 `asset-library/` 子目录,URL 不变。
  旧仓 `Animis-AI/asset-library` 待 owner 在 GitHub 网页删除。
- Logo:抠掉白底,同一 header 用于所有页面(`b457757`、`04957e3`)。

### 2026-09-03 账号、许可、第一件资产
- 语言按浏览器自动选择,中文 UA 默认中文;manifest 请求 `no-cache`(`6c556d8`)。
- 账号体系(`5349f96`):注册需 邮箱 + 姓名 + 机构/学校 + 是否接受回访;购买前必须登录;
  支付前弹许可协议(仅限本人/团队使用,不得转售或再分发),版本号 `v1-2026-09-03`;
  注册、许可确认、购买三类事件都留痕(`record(kind, data)`,demo 档写 localStorage,
  配置 `CONFIG.requests.endpoint` 后同步 POST 一份)。
- 剪刀资产上架(`80d999e`):最初做了实时渲染,纹理丢失、观感差,用户否决;改为
  展示 Blender 离线渲染的三段视频:铰链开合、碰撞体、物理掉落(`4cdc8b9`)。
  (09-07 查看器成熟后三段视频下线,点开卡片直接进 3D。)

### 2026-09-04 交付件替换
- 交付件重打包后整体替换(`7d96e9a`、`d53dc6f`)。**视频取景必须覆盖关节全行程**:
  原先按闭合姿态取景,张开时刀尖出画;改为对关节行程采样求投影包围盒并集。
- 详情表去掉 Source 行,Engine 写 `Isaac Sim · MuJoCo · Genesis`(`b34d03e`)。

### 2026-09-05 → 09-06 交互式 3D 查看器
- 先研究了 Palatial 在线查看器的实现方式(纯浏览器 three.js,铰接是运动学 FK,
  没有物理引擎和像素流),确认可行后自建(`6e126bd`)。
- 渲染路线:HDRI 环境光(`studio_small_09` 1k)+ AgX 色调映射 + 4k PCFSoft 阴影 +
  GTAO + 静止时 8× 超采样 + 轻景深;拉丝钢用各向异性高光 + 离线烘焙的 AO。
  设备弱时自动降到 low 档。
- 交互:拖部件驱动关节(关节轴平面投影解法)、滑杆、idle 正弦往复、悬停描边、
  关节表盘控件(屏幕尺寸恒定)。
- 界面对齐 Palatial 的信息架构与视觉语言(`9f5e98f`、`efe1b7c`):黑底、黄绿强调色、
  宽字距展示字、胶囊图标工具栏、关节卡片、入场推镜。镜面倒影做完后按用户要求默认关。

### 2026-09-07 收尾、命名、安全、Details 面板
- 地面网格默认开(`e478254`)。
- 改名 **SimGallery**,Sim-Ready Asset Library 降为副标题(`e138b9b`)。
- 安全(`9315013`):CI 前置 `scripts/check-public-tree.sh`,拦可售格式、assets 白名单、
  密钥;`robots.txt`;`SECURITY.md` 写清威胁模型与收款前清单。
- 剪刀详情页只留交互 3D:三段视频与标签栏移除,点开卡片即查看器。
- 公司主页改成产品介绍页(信息架构参照 lightwheel.ai/asset-library):16 英寸笔记本电脑铰接资产的宣传片开场
  (网页版 1280p、1.8 MB,`media/`)→「按需制作仿真就绪资产」+ 交付内容六条 → 「进入 SimGallery」
  与「定制资产」两个入口;资产库 `#request` 直接打开定制表单(未登录先登录)。

### 2026-09-08
- 主页去掉「为机器人训练任务而建」四个案例卡片(笔记本 / 剪刀 / 止血钳 / GPU 模块),
  用户决定不公开展示具体案例;主页只留 宣传片 → 按需制作 → 交付内容。
- **上架 16 英寸笔记本电脑**(slug `laptop_16`,80 连杆 / 79 关节:1 转动上盖 + 78 移动键帽,
  100 凸包,2.14 kg):管线新增 `build_web_asset_mtl.py`(按 OBJ `usemtl` 分组,颜色/金属度/
  粗糙度/自发光取自 MTL 常量,屏幕壁纸走 emissive 贴图),`inspect_physics.py` 尺寸改为按关节
  原点合成零位姿。inspect.json 新增 `look.material_override=false`,查看器据此保留资产自带
  材质(剪刀那套"丢贴图换常量"的修正不再一刀切)。**页面与日志一律用中性命名,不出现品牌名。**
- 查看器适配关节很多的资产:关节 >12 时表盘只在悬停/拖拽时显示;同类型 + 同限位 + 同名字
  前缀的关节合成一张卡片(`key × 78`),一根滑杆驱动整组,拖某个键时卡片切到该键;长度单位按
  行程自适应(0.8 mm 键程不再显示成 "-0.0 cm");idle 时键帽按 X 位置错相位走波浪。
- **剪刀下架**:从 manifest 与仓库移除(交付件仍在构建机),SimGallery 只保留笔记本。
- **内测模式**(`CONFIG.beta.enabled`):所有资产免费领取,支付环节换成内测问卷——单位、职位、
  规划年数与资产需求量、可接受售价区间(含币种)、资产要求;一个账号填一次,答案写进用户档案,
  每次领取另记一条 `beta-claim`。价签 / 购物车 / 按钮文案全部切到「内测免费」。
- **留痕收口统一**:新增 `sendRecord()`,注册 / 许可 / 问卷 / 领取 / 下载申请 / 定制需求全部
  POST 到 `CONFIG.records.endpoint`;问卷环节必须送达才放行。收口用 Google 表格 + Apps Script
  (脚本与步骤在 `asset-library/RECORDS.md`)。用户选定 **Formspree 免费档**(50 次提交/月):
  站点识别 formspree.io 后只发问卷(已含注册信息与许可版本)和定制需求,其余留痕本地,50 条 ≈ 50 个
  内测用户。**端点待用户注册 Formspree 后填入 `config.js`**,配好前记录只在访客浏览器里。
- 问卷的规划周期 / 需求量 / 币种改成胶囊按钮(用户反馈原生下拉选不了,根因是发布后 10 分钟内
  浏览器仍用旧 app.js,下拉选项是 JS 填的所以为空)。同时给 `?v=dev` 的脚本 / 样式 URL 在
  Actions 部署时替换成提交号,以后每次发布浏览器都强制取新文件。
- Details 面板(`3ada4b4`):Physics / Geometry / Asset hierarchy / Articulation / Package,
  数据由 `pipeline/inspect_physics.py` 从交付件写进 `inspect.json`;着色模式
  Lit / Unlit / Normals / Wireframe;查看器固定英文。

## 3. 关键决策与理由

**静态站,不上后端。** 现阶段只有一件资产、没有真实收款,静态站零运维、零成本。
代价是账号/支付只能是 demo,以及"网站上的一切都是公开的"。收款前的服务端改造
清单在 `SECURITY.md`,按顺序做完再切 `CONFIG.mode`。

**售卖包不进仓库。** 购买后走邮件人工交付。CI 闸门保证手滑也推不上去。

**查看器自建而不是嵌第三方。** Sketchfab 之类嵌入不支持铰接交互;自建后关节拖拽、
碰撞体叠加、物理面板都能按需求做。代价是要自己维护渲染质量,坑见第 4 节。

**查看器固定英文。** 查看器是产品的"技术橱窗",受众是国内外研究者,英文是行业默认;
资产库页面本身仍中英双语。

**物理参数公开展示。** 质量、惯量、摩擦是买家判断资产可不可信的依据。
剪刀的 总质量 / 视觉体积 = 7 850 kg/m³,正好是钢,这种自洽性本身就是卖点。

## 4. 踩过的坑(实测结论,别再试)

渲染:
- 第一版金属渲成黑色,一度误判为软件渲染器不支持环境光。真实原因:没开色调映射、
  用 canvas 渐变当环境、three r160 没有 `environmentIntensity`。换 r179 + AgX + 摄影棚 HDRI 后正常。
- 交付件的 roughness / metallic 贴图是噪声,实时 PBR 下渲成色斑;管线 `--material uniform` 用常量。
- 各向异性高光依赖切线,程序展 UV 每个岛方向乱;管线显式写 TANGENT。
- AO 逐 link 独立烘;整体烘会把贴合面烘成全黑。
- `ShadowMaterial` 默认写深度,会挡住下层透明面,要 `depthWrite:false`。
- Bloom 在黑底金属上哪怕很小也晕成一圈,不用。
- 入场推镜期间要关景深和超采样,到位后重新对焦,否则首帧是糊的。
- 关节表盘控件挂在场景树里,取景包围盒必须排除,否则相机被推飞。

工程:
- 三角面计数别用 `*blade_a*.obj` 这种通配,会把碰撞凸包算进去(曾误报 4 倍)。
- 视频取景要覆盖关节全行程,不是静止姿态。
- sed 替换里的 `&` 会展开成匹配串,写 HTML 实体时要转义。
- 加载遮罩淡出期间要 `pointer-events:none`,否则挡住第一下点击。
- 测试机走公司代理,线上资源只有几十 KB/s,无头浏览器验证要等 60–90 秒,不是站点慢。
- GitHub Pages 静态资源缓存 10 分钟:HTML 更新了、JS 还是旧的,凡是"JS 往 HTML 里填内容"的地方
  就会空。脚本 / 样式 URL 必须带版本号(`?v=<sha>`,Actions 部署时替换)。

## 5. 上架一件新资产

1. (可选)用 Blender 渲预览视频,`pipeline/render_collision_anim.py` 自动按关节全行程取景;
   在 manifest 的 `media` 里列出才会显示,现在剪刀不用视频,点开即 3D。
2. `pipeline/bake_ao.py` 重展 UV + 逐 link 烘 AO;`pipeline/build_web_asset.py`
   产出 `inspect/`(逐 link 视觉 GLB + 碰撞 GLB + `inspect.json`)。
3. `pipeline/inspect_physics.py <交付包> inspect.json --material … --formats … --engines …`
   写入物理与几何统计。
4. 放到 `asset-library/assets/<slug>/`,在 `.gitignore` 里显式放行,`data/assets.json`
   加一条(`inspect: true`)。
5. 本地起 `python3 -m http.server` 预览,确认卡片与交互查看都对。
6. `bash scripts/check-public-tree.sh` 通过后 push,Actions 约 20 秒上线。

## 6. 未完成

- 旧仓 `Animis-AI/asset-library` 删除(需 owner 在网页操作)。
- `CONFIG.requests.endpoint` 接 Formspree 或自建函数,让注册/购买记录真正到达邮箱。
- 收款:`SECURITY.md` 第三节九条,按顺序。
- 查看器:撤销/重做、KTX2 压缩贴图、真 GPU 上验证 high 档表现。
- 预览暴露程度(全精度网格 + 全量凸包)是产品决定,贵的资产上架前先定。
