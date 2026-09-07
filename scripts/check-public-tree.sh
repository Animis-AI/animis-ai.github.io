#!/usr/bin/env bash
# 上线前闸门:这个仓库 push 即公开发布,任何进来的文件都等于送给全网。
# 1) 站点树里不允许出现可售格式(URDF/MJCF/USD/OBJ/压缩包);
# 2) assets/ 下只允许预览用格式(视频/图片/GLB/JSON);
# 3) 不允许出现密钥。
# 任一条命中 → 退出码 1,GitHub Actions 停止部署。
set -u
cd "$(dirname "$0")/.."
fail=0

# 1) 可售格式,全树(排除 .git 与第三方库)
hits=$(git ls-files | grep -Ei '\.(urdf|mjcf|xml|usd[acz]?|obj|mtl|stl|dae|fbx|ply|tar\.gz|tgz|zip|7z|rar)$' \
       | grep -Ev '^(asset-library/viewer/vendor/|\.github/)' || true)
if [ -n "$hits" ]; then echo "::error::可售/源格式文件不能进公开仓库:"; echo "$hits"; fail=1; fi

# 2) assets/ 白名单
bad=$(git ls-files asset-library/assets | grep -Evi '\.(mp4|webm|jpg|jpeg|png|webp|glb|json)$' || true)
if [ -n "$bad" ]; then echo "::error::assets/ 只允许预览格式(mp4/webm/jpg/png/webp/glb/json):"; echo "$bad"; fail=1; fi

# 3) 密钥
sec=$(git grep -nE 'sk_(live|test)_[0-9A-Za-z]{8,}|service_role|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{20,}' -- . ':!scripts/check-public-tree.sh' ':!SECURITY.md' || true)
if [ -n "$sec" ]; then echo "::error::疑似密钥进了仓库:"; echo "$sec"; fail=1; fi

[ $fail -eq 0 ] && echo "public-tree check: OK ($(git ls-files | wc -l) files)"
exit $fail
