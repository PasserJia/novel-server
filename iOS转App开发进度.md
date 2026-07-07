# Novel Server iOS 转 App 开发进度

更新时间：2026-07-07

本文档只记录 iOS 转 App 的执行进度。具体实施方案、命令、配置示例和验收标准见 `iOS转App开发文档.md`。

## 当前状态

- 总体状态：已生成并部署第一版 iOS Development 安装包；Ad Hoc 分发仍需 Apple Distribution 证书和 Ad Hoc Provisioning Profile。
- 当前阶段：已完成移动端静态资源拆分、API 地址改造、CORS、Capacitor 初始化、iOS 工程生成、模拟器 Debug 构建、真机 Release 归档、Development IPA 导出和云机下载页部署。
- 当前代码目录：`/Users/passerjia/ai-project/novel_server`。
- 线上后端入口：`https://ai.passerjia.com:8848/api`。
- 目标安装页：`https://ai.passerjia.com:8848/downloads/ios/`。
- 本地运行边界：本地只做代码编辑、移动端资源构建和 Xcode 打包，不启动本地 NestJS 服务。

## 进度总览

| 步骤 | 内容 | 状态 | 备注 |
| --- | --- | --- | --- |
| 第一步 | 抽出移动端前端资源 | 已完成 | 已生成 `apps/mobile-web/`，保留原 NestJS 网页入口 |
| 第二步 | 改造移动端 API 和资源地址 | 已完成 | App 内使用 `https://ai.passerjia.com:8848/api`，图片资源转绝对地址 |
| 第三步 | 增加 App 访问所需 CORS | 已完成 | 已允许 `capacitor://localhost` 和 `ionic://localhost` |
| 第四步 | 增加移动端构建脚本 | 已完成 | 已新增 `npm run build:mobile`，生成 `mobile-dist/` |
| 第五步 | 安装并初始化 Capacitor | 已完成 | 已生成 `capacitor.config.ts` 和 `ios/` |
| 第六步 | 配置 iOS 原生工程 | 已完成 | 已配置 Bundle ID、App 名称、权限说明；模拟器 Debug 构建通过，Team 和签名用于后续真机/IPA |
| 第七步 | 补齐移动端原生体验 | 已完成 | 已接入 Preferences、StatusBar、SplashScreen、Camera 插件；运行态体验待真机验证 |
| 第八步 | 准备 Apple Ad Hoc 签名资料 | 部分完成 | 当前使用 Apple Development 自动签名；Ad Hoc 仍需 Distribution 证书和 Ad Hoc Profile |
| 第九步 | 导出 iOS 安装包 | 已完成 | 已生成 `release/ios/novel-reader.ipa`，签名类型为 Apple Development |
| 第十步 | 生成安装清单和安装页 | 已完成 | 已生成 `downloads/ios/manifest.plist`、`downloads/ios/index.html` 和本地 `release/ios/` 副本 |
| 第十一步 | 部署安装包下载目录 | 已完成 | 已通过 NestJS `/downloads` 静态目录部署到云机 |
| 第十二步 | 真机安装和验收 | 待验证 | 需要在目标 iPhone 上安装并验证 |
| 第十三步 | 记录交付信息 | 已完成 | 已记录版本、构建号、Profile、下载地址和验证结果 |

状态枚举：

- 未开始：还没有执行。
- 进行中：已经开始但未完成。
- 已完成：完成条件已满足。
- 阻塞：需要账号、设备、证书、权限或用户确认后才能继续。

## 当前阻塞项

| 阻塞项 | 状态 | 说明 |
| --- | --- | --- |
| Apple Ad Hoc 分发资料 | 待补齐 | Safari OTA 稳定安装需要 Apple Distribution 证书和 Ad Hoc Provisioning Profile |
| iPhone 真机验收 | 待验证 | 需要在目标 iPhone 上完成安装、登录、上传、书架、书城等验收 |
| Bundle ID | 已确定 | `com.passerjia.novelreader` |
| App 名称 | 已确定 | `小说阅读器` |
| App 图标和启动图 | 待准备 | 可先使用临时图标，后续替换正式图 |
| 本机代码签名证书 | 已生成 | 当前使用 `Apple Development: 2572606441@qq.com (RVVCGQ8XR6)` |
| 本机 Provisioning Profile | 已生成 | 当前使用 `iOS Team Provisioning Profile: com.passerjia.novelreader` |
| Xcode Swift Package 二进制下载 | 已解决 | `Capacitor.xcframework.zip` 已下载完成，模拟器 Debug 构建通过 |

## 下一步任务

1. 用 iPhone 打开 `https://ai.passerjia.com:8848/downloads/ios/`，尝试安装当前 Development 包。
2. 如果 Safari 一键安装不通过，使用 Xcode、Finder 或 Apple Configurator 安装 `release/ios/novel-reader.ipa`。
3. 真机验证登录、书架、书城、阅读器、上传和管理员页面。
4. 如需可分享的 Safari OTA 安装，补齐 Apple Distribution 证书、目标 iPhone UDID 和 Ad Hoc Provisioning Profile 后重新导出 IPA。

## 执行记录

| 时间 | 操作 | 结果 | 备注 |
| --- | --- | --- | --- |
| 2026-07-07 | 创建进度文档 | 已完成 | 初始状态为未开始 |
| 2026-07-07 | 新增移动端构建脚本 `scripts/build_mobile.js` | 已完成 | 可从 `src/modules/web/web.controller.ts` 生成 `apps/mobile-web/` 和 `mobile-dist/` |
| 2026-07-07 | 执行 `npm run build:mobile` | 已完成 | 已生成移动端静态资源 |
| 2026-07-07 | 移动端 API 和资源地址改造 | 已完成 | 生成产物使用 `https://ai.passerjia.com:8848/api` 和 `toAssetUrl()` |
| 2026-07-07 | 在 `src/main.ts` 增加 CORS | 已完成 | 允许 Capacitor App Origin 访问 API |
| 2026-07-07 | 安装 Capacitor 依赖和 CLI | 已完成 | 已安装 `@capacitor/core`、`@capacitor/ios`、`@capacitor/preferences`、`@capacitor/status-bar`、`@capacitor/splash-screen`、`@capacitor/camera`、`@capacitor/cli` |
| 2026-07-07 | 初始化 Capacitor | 已完成 | App ID 为 `com.passerjia.novelreader`，App 名称为 `小说阅读器` |
| 2026-07-07 | 添加 iOS 平台 | 已完成 | 已生成 `ios/` 工程并同步 `mobile-dist/` |
| 2026-07-07 | 配置 iOS 权限说明 | 已完成 | 已加入相机、相册读取、相册保存说明 |
| 2026-07-07 | 接入移动端原生体验代码 | 已完成 | token 优先同步到 Capacitor Preferences，并容错调用 StatusBar 和 SplashScreen |
| 2026-07-07 | 执行 `npm run typecheck` | 通过 | 未启动本地服务 |
| 2026-07-07 | 执行 `npm run build` | 通过 | 未启动本地服务 |
| 2026-07-07 | 执行 `plutil -lint ios/App/App/Info.plist` | 通过 | Info.plist 格式正确 |
| 2026-07-07 | 执行 `xcodebuild` 命令行编译检查 | 曾阻塞 | GitHub 下载 `Capacitor.xcframework.zip` 超时 |
| 2026-07-07 | 重新执行 `xcodebuild` 命令行编译检查 | 通过 | SwiftPM 解析完成，模拟器 Debug 构建成功，产物为 `~/Library/Developer/Xcode/DerivedData/App-cnojfztygunrschcriqkhgjnpmkb/Build/Products/Debug-iphonesimulator/App.app` |
| 2026-07-07 | 配置 Xcode Team 和开发签名 | 已完成 | Team ID 为 `S756R6QRF9`，Bundle ID 为 `com.passerjia.novelreader` |
| 2026-07-07 | 执行 Release Archive | 通过 | 已生成 `release/ios/NovelReader.xcarchive` |
| 2026-07-07 | 导出 Development IPA | 通过 | 已生成 `release/ios/novel-reader.ipa`，大小约 1.1 MB |
| 2026-07-07 | 生成安装页和 manifest | 已完成 | 已生成 `downloads/ios/index.html` 和 `downloads/ios/manifest.plist` |
| 2026-07-07 | 部署下载页到云机 | 已完成 | 已部署到 `https://ai.passerjia.com:8848/downloads/ios/` |
| 2026-07-07 | 公网检查下载页 | 通过 | 页面、IPA、manifest 均返回 HTTP 200 |

## 交付记录

- 代码提交 hash：以本次 Git 提交记录为准。
- App 版本号：`1.0`。
- 构建号：`1`。
- Bundle ID：`com.passerjia.novelreader`。
- IPA 本地路径：`release/ios/novel-reader.ipa`。
- 云机安装页：`https://ai.passerjia.com:8848/downloads/ios/`。
- 云机 IPA：`https://ai.passerjia.com:8848/downloads/ios/novel-reader.ipa`。
- 签名证书：`Apple Development: 2572606441@qq.com (RVVCGQ8XR6)`，SHA1 `CE6A0D65F281CCA3DE40DEA30D420D36D03BBC26`，过期时间 `2027-07-07`。
- Provisioning Profile：`iOS Team Provisioning Profile: com.passerjia.novelreader`，UUID `56fb1f91-2d7d-4e83-8d96-870b870d21cb`，过期时间 `2026-07-14`。
- 已登记测试设备：以当前 Development Profile 包含设备为准。
- 验收结果：已完成构建、导出、部署和 HTTP 可访问性检查；真机功能验收待执行。
