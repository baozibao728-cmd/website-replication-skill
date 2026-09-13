# 可复查的浏览器采集

在工作目录安装 `playwright` 并准备 Chromium 后运行：

```text
node scripts/doctor.js
node scripts/capture.js https://example.com ./captures
node scripts/capture.js https://example.com ./captures 6 500 --routes routes.json --actions actions.json
```

`routes.json` 是实际要访问的路径或完整 URL 数组，例如 `["/", "/about"]`。未指定时只访问输入 URL。每次运行创建独立的 `run-日期-随机值/`；每个路由和视口有不同目录、内嵌响应体的 HAR、截图和动作结果。最终 `coverage.json` 包含失败项，部分失败时 CLI 返回非零。上下文关闭后 HAR 才写完，不要提前使用录制中的文件。

`actions.json` 示例：

```json
{
  "viewports": [{"width": 1440, "height": 900}, {"width": 390, "height": 844}],
  "context": {"isMobile": false, "hasTouch": false},
  "settleMs": 1000,
  "timeoutMs": 15000,
  "heuristics": {"centerClick": false, "scrollSteps": 6, "scrollWaitMs": 500, "maxHover": 8},
  "actions": [{"type": "waitForSelector", "selector": "main"}],
  "routes": {
    "/": [
      {"type": "click", "selector": "button[aria-label='Menu']"},
      {"type": "state", "name": "menu-open"},
      {"type": "click", "selector": "button[aria-label='Close menu']"},
      {"type": "hover", "selector": "a[href='/about']"},
      {"type": "scroll", "y": 700, "waitMs": 500},
      {"type": "wait", "ms": 300},
      {"type": "snapshot", "name": "below-fold"}
    ]
  }
}
```

替换示例中的选择器以匹配目标站点。`actions` 在每个路由执行，随后执行 `routes` 中对应路径的动作，再进行启发式滚动和悬停。`waitForSelector` 可指定 `state` 为 `visible`、`hidden`、`attached` 或 `detached`。每个显式动作可指定 `timeoutMs` 和执行后的 `waitMs`；`wait` 的 `ms` 与等待值均有上限。`state` 记录命名状态和当前 URL，`snapshot` 保存命名截图；所有成功动作都会截图，失败动作尽可能保存现场。

默认视口为 1440×900 和 390×844，只改变尺寸；脚本不设置固定 UA，也不据此声称已验证真实手机。需要移动布局和触控模拟时，在单独运行中显式设置 `context.isMobile`、`context.hasTouch`。中心点击默认关闭；仅在已确认点击位置和目的时启用。导航等待 `domcontentloaded`，再做有界等待，避免长连接阻塞 `networkidle`。

采集报告证明的是这些路由、视口、动作和运行时遇到的资源。滚动及有限悬停无法代替菜单、标签、弹窗、音频解锁等站点专属动作。`pageErrors`、`requestFailures` 和 HTTP 错误会使对应场景标记失败，需要结合业务判断；报告保留原始证据。

供验证脚本复用的接口：

```js
const { runAction } = require('./scripts/capture');
await runAction(page, { type: 'click', selector: '#menu' }, {
  outputDir: './comparison', filenamePrefix: '001', timeoutMs: 15000
});
```

调用端需提前创建 `outputDir`，为每次调用提供唯一 `filenamePrefix`；成功返回动作结果和截图路径，失败抛出异常。省略 `outputDir` 时仅执行动作。`capture(url, outDir, config, { chromium })` 支持注入 Chromium，便于使用模拟对象验证文件隔离与错误收尾。
