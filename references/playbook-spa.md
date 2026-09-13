# DOM SPA / SSR 水合

优先回放原始前端包。渲染后 DOM 静态快照需明确标记为降级，不能保证事件绑定和交互一致。

1. 从 sitemap、导航链接与实际跳转整理有限的交付路由。
2. routes.json 包含所有需要直接打开/刷新的路由。SSR 每条路由 HTML 独立，不能仅抓首页。
3. actions 中加入菜单、标签、弹窗、详情；hover 不能替代 click。
4. 用本次 run 归档；不同视口或时间造成同请求不同响应时拆成独立镜像。

```sh
node scripts/capture.js "https://example.com/" ./work/HAR --routes ./work/routes.json --actions ./work/actions.json
node scripts/archive.js ./work/HAR/<run-id> ./work/mirror --base "https://example.com/"
node scripts/serve.js ./work/mirror 8080 --spa
```

history 路由需要文档 fallback；hash 路由通常不需要。服务先匹配已录路由，JS、WASM、API缺失不回退成首页。

serve 适配 manifest 中已知绝对域名；动态拼接、签名、内嵌 CSP/SRI、Worker/Service Worker仍可能需要站点级修改。修复后做外网阻断验证，不能把逃逸请求仅列为差异就称离线通过。

SSR 导航请求 RSC、JSON、GraphQL 时叠加 hybrid；服务端计算不会随 JS 包恢复。

每条路由检查直接打开、站内导航和刷新，并对照动作截图。水合错误影响展示/操作即失败，确认无影响的警告才可记为差异。