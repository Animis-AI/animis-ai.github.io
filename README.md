# animis-ai.github.io

Animis AI 的全部官网，单仓库、纯静态、GitHub Pages（Actions）自动部署：

- `/` — 公司落地页：一句 slogan，"We build the world engine for physical AI."，
  双语（英文默认，导航切换中文）。
- `/asset-library/` — SimGallery（副标题 Sim-Ready Asset Library）：仿真资产库（目前空目录占位，
  购物车/登录/沙盒支付/定制需求功能可用）。资产文件与烘焙管线在构建机
  `/data/wangyubin/animis/asset-library/`（`assets_staged/` + `pipeline/`），
  上架流程见 `asset-library/README.md`。
- `anyego/` — AnyEgo 产品页，暂时下线（未跟踪，见 `.gitignore`）。

改动后 `git push` 即上线。字体风格：Source Serif 4 标题 + Inter 正文
（参照 current-robotics.com），中文回退宋体/苹方。

## 开发记录

从建站到 SimGallery / 3D 查看器 / 安全闸门的完整过程、决策理由与踩坑,见 `DEVLOG.md`。

## 安全

仓库公开即发布:售卖包永远不进仓库,部署前 `scripts/check-public-tree.sh`
自动拦截可售格式与密钥。收款前必做清单见 `SECURITY.md`。
