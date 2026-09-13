# 数据快照与回放

叠加在静态、SPA 或 WebGL 上。交付抓取时刻的状态，没有录制的搜索、翻页、消息或服务端计算不会自动出现。

capture 默认嵌入响应体；配置指定筛选、翻页、详情和搜索动作。会改变外部状态的动作按已有授权执行，不当普通探索。

archive 以 HTTP method + 完整 URL + 原始请求体 SHA256 匹配：
- 保留 query 顺序和重复参数，不假定排序/删除等价。
- POST/GraphQL 使用完整请求体，包括实际 query、operationName、variables。
- 缺失非 GET 响应不会自动重发。
- 同一键不同内容报告冲突。Cookie、Accept、时间戳与会话变体需要限定快照范围，当前不按任意请求头建模。

```sh
node scripts/archive.js ./work/HAR/<run-id> ./work/mirror --base "https://example.com/"
node scripts/serve.js ./work/mirror 8080 --spa
```

serve 回放已录响应与状态，未命中不代理线上。未录状态若做演示 mock 必须明确假数据；不能统一返回成功并称功能还原。

登录服务、支付结果、实时连接和新查询不能随静态快照恢复。动态签名、Cookie/令牌可能需要限定的本地演示逻辑。数据中的 CDN 图片也要实际触发捕获。

验收逐条核对已录路径；未录路径显示明确空态/错误，无外网请求。报告快照时间、动作范围、匹配数量、冲突和未覆盖状态。