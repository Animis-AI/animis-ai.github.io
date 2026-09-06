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

## 交互式 3D 查看(`viewer/`)

详情页第四个标签「交互查看」在 iframe 里跑 `viewer/index.html?asset=<slug>&lang=`,
three.js r179 本地 WebGL 渲染,思路照 Palatial(见 `PALATIAL_VIEWER_REFERENCE.md`):

- 渲染:HDRI IBL(`viewer/hdri/studio_small_09.hdr`,1k)+ AgX tone mapping +
  PCFSoft 4k 阴影 + GTAO + 镜面倒影(Reflector + 径向渐变遮罩)+ 静止时 8× 超采样
  + 轻微景深;`?quality=low` 或触屏/低核数设备自动降级(关 GTAO/景深/倒影,4×)。
- 材质:各向异性拉丝金属(`MeshPhysicalMaterial.anisotropy`,切线由管线显式给出)
  + 离线烘焙的 AO(glTF `occlusionTexture`)。
- 交互:拖部件驱动关节(关节轴平面投影解法)、滑杆、idle 正弦往复、视觉/碰撞/叠加切换。

资产接入(构建机 `/data/wangyubin/animis/asset-library/pipeline/`):

    blender -b --factory-startup -noaudio --python pipeline/bake_ao.py -- \
        --asset <URDF包> --out <tmp>/baked            # 重展 UV + 逐 link 烘 AO
    python3 pipeline/build_web_asset.py <URDF包> <tmp>/out --material uniform \
        --visual-dir <tmp>/baked --ao-dir <tmp>/baked --brush-axis 1,0,0 --tex 1024
    cp -r <tmp>/out/inspect assets/<slug>/inspect      # 然后 manifest 里 "inspect": true

`--material uniform` 是因为交付件的 roughness/metallic 贴图是迷彩噪声,实时 PBR 下会渲成
色斑;有干净贴图的资产用默认 `textures`。
