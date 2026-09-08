# 记录去哪:注册 / 问卷 / 领取 / 定制需求

一句话:**网站是静态站,自己存不了任何东西。** 每一条记录都会 POST 到
`js/config.js` 里 `CONFIG.records.endpoint` 指向的地址;这个地址没配之前,记录只存在
访客自己的浏览器里(`localStorage["simgen-records"]`),问卷靠 mailto 兜底,**不会自动到
我们手里**。所以上线内测前第一件事是把下面的收口配好(10 分钟)。

## 1. 收口:Google 表格 + Apps Script(无限额,记录种类最全)

用 animislab@gmail.com 登录,所有记录一行一条落在一张 Google 表格里,按记录种类分工作表。

1. 新建一张 Google 表格,命名 `SimGallery records`,从地址栏记下表格 ID
   (`https://docs.google.com/spreadsheets/d/<这一段就是 ID>/edit`)。
2. 表格菜单 扩展程序 → Apps Script,把下面的代码全部粘进去,替换 `SHEET_ID`:

```js
const SHEET_ID = "在这里填表格 ID";

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const kind = String(d.kind || "records").replace(/^simgen-/, "");
  const s = d.survey || {};
  const row = [d.at || new Date().toISOString(), kind, d.email || d.user || "",
               d.name || "", d.org || s.org || "", d.title || s.title || "",
               d.horizon_years || s.horizon_years || "", d.demand_count || s.demand_count || "",
               d.price_min ?? s.price_min ?? "", d.price_max ?? s.price_max ?? "", d.currency || s.currency || "",
               d.requirements || s.requirements || d.detail || "",
               (d.slugs || (d.slug ? [d.slug] : [])).join(" "), d.page || "", JSON.stringify(d)];
  const head = ["at", "kind", "email", "name", "affiliation", "title", "horizon_years", "demand_count",
                "price_min", "price_max", "currency", "requirements", "assets", "page", "json"];
  for (const name of [kind, "all"]) {
    const sh = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(head);
    sh.appendRow(row);
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. 右上角 部署 → 新建部署 → 类型选「网页应用」→ 执行身份「我」→ 谁可以访问「任何人」
   → 部署,复制得到的 URL(形如 `https://script.google.com/macros/s/…/exec`)。
4. 把 URL 填进 `js/config.js` 的 `records.endpoint`,push 上线。
5. 验证:网站上随便注册一个账号,表格里应立刻多出 `register` 与 `all` 两个工作表各一行。

改过脚本要重新「部署 → 管理部署 → 编辑 → 新版本」,URL 不变。

## 1b. 收口:Formspree(当前选用)

用 animislab@gmail.com 在 https://formspree.io 注册 → New form → 名字 `SimGallery records`
→ 复制端点 `https://formspree.io/f/<id>` → 填进 `js/config.js` 的 `records.endpoint` → push。
第一条提交后 Formspree 会发一封激活邮件到 animislab@gmail.com,点确认后才开始收。

免费档 **每月 50 次提交**,按提交次数算。站点识别到 formspree.io 后只发两种记录:
`beta-survey`(一个用户一条,已包含注册的姓名 / 单位 / 回访意愿和许可版本)和 `asset-request`;
注册、许可、领取、下载申请只进访客本地日志。于是 50 条 ≈ 50 个内测用户 + 定制需求。
每条记录一封邮件,`_subject` 字段就是邮件标题;Formspree 后台也能按表格查看和导出 CSV。
接近上限时切到 1b 上面的 Apps Script 方案(无限额),不用改前端代码,换个 URL 即可,
届时六种记录全部发送。

## 2. 记录种类与字段

| kind | 何时 | 字段 |
|---|---|---|
| `register` | 注册 | email、name(姓名)、org(单位)、followup(是否接受回访) |
| `license-accept` | 领取前确认许可协议 | email、version(协议版本)、slugs |
| `beta-survey` | 内测问卷(每个账号一次) | email、name、followup、**org(单位)、title(职位)、horizon_years(规划年数)、demand_count(资产需求量档位)、price_min / price_max / currency(可接受售价区间)、requirements(资产要求)**、slugs |
| `beta-claim` | 每次免费领取 | email、name、org、title、survey(问卷快照)、slugs、license |
| `download` | 站上直接下载 | email、slug、file |
| `download-request` | 没有站内包的资产点「获取资产包」 | email、slug |
| `asset-request` | 定制需求表单 | user、title、detail、reference |

每条都带 `at`(UTC 时间)、`page`(来源页)、`lang`。问卷答案同时写进用户档案
(`profile.survey`),同一账号之后再领取不再重复填。

## 3. 内测流程

选购 → 「免费领取」→ 登录/注册(邮箱、姓名、单位、回访意愿)→ 许可协议 → 内测问卷 →
领取成功(价签变「已领取」,出现「获取资产包 · 14.2 MB」)→ 点击直接从站上下载 zip
(manifest `download` 字段指向 `packages/<随机串>/…zip`),同时记一条 `download`;没有
`download` 字段的资产仍走人工邮件交付(记 `download-request`)。`CONFIG.beta.enabled=false` 即恢复付费流程(问卷环节跳过,回到支付)。

问卷提交时如果端点已配置但 POST 失败,**不放行**,提示用户重试——保证每一次领取都有对应的
问卷记录。端点未配置时走 mailto 兜底并放行(这是过渡态,不要长期停留)。

## 4. 应急:从访客浏览器导出

没配端点期间的记录只在访客自己的浏览器里。让对方在网站页面打开控制台执行:

```js
copy(localStorage.getItem("simgen-records"))
```

粘贴发给我们即可。本地联调可用 `localStorage.setItem("simgen-records-endpoint", "<url>")`
临时指定端点,不改代码。

## 5. 正式收款后

切到 Supabase 后这些记录仍会 POST 到同一端点(问卷额外写进 `auth.users.raw_user_meta_data`),
表格继续当汇总视图;购买记录以 Stripe webhook 写入的 `purchases` 表为准,见 `SECURITY.md`。
