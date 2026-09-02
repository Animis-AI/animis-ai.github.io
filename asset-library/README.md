# Sim-Ready Asset Library · 仿真资产库

Interactive web catalogue of Animis AI's simulation-ready assets — articulated
appliances and furniture from the Sketch2Arti pipeline, plus rigid logistics
assets with physics parameters.

**Live site:** https://animis-ai.github.io/asset-library/

**目前不发布资产**:`data/assets.json` 的 `assets` 为空数组,页面显示"目录尚未
上线 + 定制需求"入口,筛选栏与统计自动隐藏。已烘焙的 GLB/poster/demo 暂存在构建
机 `asset-library/assets_staged/`(未入库)。重新上线资产:把该目录移回
`site/assets/`,跑 `pipeline/build_manifest.py` 刷新清单,再 commit + push。

- Every asset renders in-browser as a compressed glTF (`<model-viewer>`, loaded
  lazily the first time an asset with a GLB is opened);
  orbit, zoom, play or scrub the joint animation.
- Articulated assets carry their real URDF joint types and limits; the web
  animation is the joint sweeping between its limits.
- `data/assets.json` is the machine-readable manifest.

Static site, no build step. Deployed by `.github/workflows/pages.yml` on every
push to `main`.
