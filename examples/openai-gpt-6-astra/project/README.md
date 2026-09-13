# Astra 本地镜像 · 可运行项目

## 启动

安装 Node.js 20 或更高版本，进入本目录运行：

```sh
npm start
```

无需安装第三方依赖。Windows 也可双击 `start.cmd`。

打开 **http://127.0.0.1:8080/**。首次从根地址进入，由引导页注册 Service Worker，再进入镜像页面。不要直接双击 HTML 文件。

端口可通过环境变量 `PORT` 修改，例如 PowerShell：

```powershell
$env:PORT = '8081'
npm start
```

## 项目结构

- `server.cjs`：本地启动页、资源服务和站点适配。
- `worker.js`：根据归档清单回放请求，保留原站页面及 Next.js 数据结构。
- `astra-quality.cjs`：粒子高画质配置，40,000 粒子预算、完整后处理和最高 2 倍像素比；在响应时应用，归档文件保持原样。
- `lib/serve.cjs`：本 Skill 的静态资源服务模块。
- `mirror/manifest.json`：资源 URL、文件路径及 SHA-256 校验信息。
- `mirror/_assets/`：运行页面所需的已归档 HTML、CSS、JavaScript、字体、图片及文档等资源。

## 使用说明

该项目复刻 Astra 发布页面。其他页面导航返回原站；Vimeo 视频与外嵌演示需要联网。登录、搜索等在线后端功能沿用原站入口。原站统计请求在本地停用。

Service Worker 仅注册在本地地址。若在相同端口运行其他项目，可先在浏览器站点设置中清除该本地地址的数据。

原站页面设计、品牌与动画资源来自 OpenAI；本项目提供本地镜像、回放和渲染适配实现。
