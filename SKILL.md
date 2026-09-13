---
name: replicating-frontend-websites
description: Replicate an existing website frontend with its original assets and runtime for a faithful local mirror or a reference for maintainable rebuilding. Use for website cloning, mirroring, offline archiving, 网站复刻、克隆、镜像和离线备份, including static pages, SPAs, SSR and WebGL sites.
---

# 高保真网站复刻

优先复用原站 HTML/CSS/JS、字体、图片、模型与动画，让原有前端在本地运行。先识别依赖，再选择发现方式；浏览器请求记录是已访问状态的证据，不能证明所有资源都已发现。

## 交付目标

- **高保真镜像**：保存已覆盖页面的原始响应，在本地回放视觉与交互。默认走此路径。
- **可维护重建**：用户需要持续开发、改布局或增加功能时，以镜像和截图为参考，单独重建组件与数据逻辑。原始包归档不等于可维护源码。
- 找到与线上版本对应的官方仓库时优先使用，但仍需安装、构建、运行并对照验收，不能 clone 后直接宣称完成。
- 编译产物通常不足以恢复完整工程；公开 source map 可能提供部分源码，核实后报告。后端和原始 3D 工程按实际可得性判断。

沿用用户已经给出的范围和授权，只有影响结果的缺失信息才追问；不固定输出开场免责声明或重复索取已有授权。

## 环境与分流

需要 Node.js 20+；只有浏览器捕获和浏览器验收需要 Playwright/Chromium。脚本不依赖 Bash、jq、wget。先解析本 Skill 的绝对位置；以下命令在本 Skill 目录执行，work 应替换成用户工程内的输出路径。

```sh
node scripts/doctor.js
# 依赖缺少时：
npm install
npx playwright install chromium
node scripts/fingerprint.js "https://example.com/"
```

按 [指纹识别](references/fingerprinting.md) 人工确认，只读取适用手册：

| 观察到的形态 | 手册 |
|---|---|
| HTML 直接提供内容，资源主要静态引用 | [静态 / SSG](references/playbook-static.md) |
| 客户端渲染、路由切换或 SSR 水合 | [SPA / SSR](references/playbook-spa.md) |
| Canvas/WebGL、模型、纹理、解码器、Worker | [WebGL](references/playbook-webgl.md) |
| 内容依赖 API、GraphQL、动态服务 | 叠加 [数据快照](references/playbook-hybrid.md) |

## 执行闭环

1. **限定范围**：记录入口、路由、视口、关键交互、数据状态和排除项。根据 sitemap、站内链接、菜单和实际导航发现路由，不把首页当全站。
2. **捕获**：默认保存响应体；为菜单、标签页、项目切换、音频配置明确动作。参考 [动作配置](references/capture-actions.md)，检查 coverage.json。
3. **归档**：导入本次捕获的 run 目录；保留完整 URL、查询参数、来源域和请求体。错误、缺口和响应冲突分别记账。
4. **本地回放**：按 manifest 映射 URL；保留归档字节，运行时适配已知域名。缺失资源返回真实错误。
5. **验证与补抓**：审计资产，并在新浏览器上下文中阻断外网，检查所需路由与动作；根据具体失败补抓，再验受影响部分。
6. **交付**：报告覆盖范围、验证等级、已知差异和剩余缺口。后续部署按用户授权执行；新增的外部变更在结果可审查后再确认。

```sh
node scripts/capture.js "https://example.com/" ./work/HAR --routes ./work/routes.json --actions ./work/actions.json
# 使用捕获命令打印的具体 run 目录，避免混入其他时间的记录：
node scripts/archive.js ./work/HAR/<run-id> ./work/mirror --base "https://example.com/"
node scripts/serve.js ./work/mirror 8080 --spa
node scripts/verify.js ./work/mirror
```

静态站不用 --spa；只有实际依赖跨源隔离能力时加 --isolate。浏览器验收选项见 [verification.md](references/verification.md)。

## 质量约束

- HTTP 状态是必要证据，但不足以单独判真；同时检查传输完整性、内容类型、关键魔数与 soft-404 正文。页面与资源分别判断。
- 不删除查询参数，不仅保留主域名；使用完整请求到本地内容的映射。
- 默认读取已录响应；仅显式 --fetch-missing 补发缺失的 GET。归档工具不会重发 POST 等非 GET 请求。
- DONE.list 是汇总；manifest、文件哈希、MISSING.log 和覆盖报告构成证据。
- 可选内容可降级并记账；入口、核心程序、模型或数据失败只能交付部分结果，占位不算完整。
- 同请求出现不同版本/设备内容时报告冲突；限定一致版本或分开镜像，不静默覆盖。
- 零 404 不等于像素一致；通过对应状态截图核对，重建项目还需功能验收。

问题处置见 [risks-degradation.md](references/risks-degradation.md)。修改工具后运行 npm test；测试只使用本地临时样例。