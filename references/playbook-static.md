# 静态 / SSG

保留原 HTML/CSS/JS 与素材。多页面、懒加载图片、CSS 字体和响应式图片都会产生额外请求。

1. 从 sitemap、导航、站内链接整理交付路由 routes.json，例如 ["/", "/about/"]。
2. 捕获路由和所需视口；滚动触发懒加载，展开内容加入显式动作。
3. 导入本次 run，启动普通服务：

```sh
node scripts/capture.js "https://example.com/" ./work/HAR --routes ./work/routes.json
node scripts/archive.js ./work/HAR/<run-id> ./work/mirror --base "https://example.com/"
node scripts/serve.js ./work/mirror 8080
```

## 明确清单和序列帧

源码有 manifest 数组或序列总数时按其生成完整清单，优先于猜测。相对资源用 new URL(reference, owningDocumentUrl) 解析，保留 query。

也可直接下载完整 URL 清单：
```json
[
  {"url":"https://example.com/","kind":"page"},
  {"url":"https://example.com/frames/f-0001.webp","kind":"asset"},
  {"url":"https://cdn.example.com/font.woff2?v=2","kind":"asset"}
]
```

```sh
node scripts/archive.js ./work/urls.json ./work/direct-mirror --base "https://example.com/"
```

每次导入重建 manifest，不隐式合并旧版本。补抓后重新导入完整 run，或先合并完整 URL 清单再下载到独立目录。

无权威总数时只做有界探测；连续缺失不能证明后面没有帧，到达请求上限记录未确认范围。

验收覆盖页面直接访问、链接跳转和刷新，核对字体、图片、媒体与滚动状态。按 verification 检查 L0–L3；字节一致只针对归档原始内容。