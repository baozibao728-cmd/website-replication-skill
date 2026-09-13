# WebGL / Canvas / 3D

保留原始 JS、着色器、纹理、模型、Worker 与音频。交互捕获发现按状态加载的资源，静态 manifest 可补充，两者互补。

## 捕获状态

- 用明确 selector 等待开场加载完成；固定延时只作辅助。
- 点击实际“开始/声音”控件解锁音频，避免盲点中心造成导航。
- 覆盖关键滚动段、项目与场景切换，并等待对应状态。
- 视口缩小不等于真触屏设备；需要时显式配置移动环境、单独验证。
- 默认浏览器启动参数即可；实际 GPU 问题再调整，并记录与目标设备的差异。

```sh
node scripts/capture.js "https://example.com/" ./work/HAR --actions ./work/actions.json
node scripts/archive.js ./work/HAR/<run-id> ./work/mirror --base "https://example.com/"
node scripts/serve.js ./work/mirror 8080
```

## 关键依赖

核对当前版本实际使用的 WASM 解码器、Worker、字体/MSDF、模型、纹理和音频。不要照抄示例资源名，也不要用某个目录计数为零推断缺失。

archive 检查部分常见格式签名；完整性还需哈希与实际解码。核心解码器缺失不能以空文件替代并称场景通过。

serve 提供所需 MIME；仅实际依赖 SharedArrayBuffer 等能力时加 --isolate 并检查 crossOriginIsolated。普通 WebGL 不普遍要求这些头，COEP 可能阻止跨域资源。

媒体支持单 Range；DRM、特殊流式协议、实时音频和 GPU 能力按实际范围判断。

验收对照开场、关键滚动、场景切换和音频；记录视口、DPR、浏览器、动画时刻与 GPU 差异。运动帧不要求无条件逐像素相等，但仍要核对视觉。