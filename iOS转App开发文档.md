# Novel Server iOS 转 App 开发文档

更新时间：2026-07-07

本文档用于指导将 `/Users/passerjia/ai-project/novel_server` 当前网页端小说阅读系统转换为 iOS App。目标是先做 iOS 内测安装包，不上架 App Store，并提供一个 iPhone 可访问的安装页面。

## 目标

- 平台：iOS。
- 分发方式：第一版已导出 Apple Development 安装包；正式内测 OTA 分发建议补齐 Ad Hoc 签名，不公开上架 App Store。
- 安装入口：`https://ai.passerjia.com:8848/downloads/ios/`。
- 后端接口：继续使用线上云机 `https://ai.passerjia.com:8848/api`。
- 旧域名：不使用 `novel.passerjia.com`。
- 本地限制：本地目录只做代码编辑、移动端资源构建和 Xcode 打包，不启动本地 NestJS 服务。

## 推荐技术路线

使用 Capacitor 将现有网页端转换为 iOS App。

原因：

- 当前系统已经有完整的移动端网页交互：登录、书架、书城、阅读器、搜索记录、管理员书城管理。
- Capacitor 可以把 Web 前端打包进 iOS 原生工程，并逐步接入相册、相机、安全存储、状态栏等原生能力。
- 第一版不需要重写 React Native，可以更快拿到可安装包。

不推荐第一版做纯远程网页壳。远程网页壳虽然最快，但体验、离线能力、审核风险和可维护性都差。第一版应采用“App 内置前端静态资源 + 调用线上 API”的方式。

## 当前项目现状

当前项目是 NestJS 服务：

- 根路径 `/` 返回内置单页网页端。
- 网页端 HTML/CSS/JS 目前写在 `src/modules/web/web.controller.ts` 的模板字符串里。
- API 前缀是 `/api`。
- 线上入口是 `https://ai.passerjia.com:8848/`。
- 线上服务运行目录是 `/home/ubuntu/novel_server`。

移动端改造时必须处理两点：

1. 当前前端请求使用相对路径 `/api`，在 Capacitor App 里需要改为绝对地址 `https://ai.passerjia.com:8848/api`。
2. App 的 WebView 源通常是 `capacitor://localhost`，跨域访问线上 API 时后端需要允许该 Origin。

## 前置条件

本地已经安装 Xcode 后，还需要确认：

```bash
xcode-select -p
xcodebuild -version
```

如果第一次使用 Xcode，需要在 Xcode 界面完成初始化组件安装，并接受许可协议。

还需要准备：

- Apple Developer Program 账号。仅安装 Xcode 不等于具备 Ad Hoc 分发能力。
- iPhone 真机 UDID。Ad Hoc 安装包只能安装到已登记的设备。
- Bundle ID，建议使用：`com.passerjia.novelreader`。
- App 名称，建议使用：`小说阅读器`。
- App 图标和启动图。没有正式图时可先使用临时图标。

Apple Ad Hoc 分发要求创建 App ID、登记设备、创建分发证书和 Ad Hoc Provisioning Profile。每台 iPhone 都需要提前登记 UDID。

当前已生成的第一版 IPA 使用 Apple Development 签名，可以用于已登记或已连接调试设备安装。Safari `itms-services` 一键安装更适合 Ad Hoc 或企业签名包；如果 Development 包一键安装失败，使用 Xcode、Finder 或 Apple Configurator 安装 IPA。

官方参考：

- Capacitor iOS 文档：https://capacitorjs.com/docs/ios
- Apple Ad Hoc Provisioning Profile：https://developer.apple.com/help/account/provisioning-profiles/create-an-ad-hoc-provisioning-profile
- Apple 设备登记说明：https://developer.apple.com/help/account/devices/devices-overview
- TestFlight 备选方案：https://developer.apple.com/testflight/

## 目录规划

建议在当前项目下新增移动端相关目录：

```text
novel_server/
  apps/
    mobile-web/                 由脚本生成的移动端前端静态资源
  mobile-dist/                  移动端前端构建产物，供 Capacitor 使用
  ios/                          Capacitor 生成的 iOS 原生工程
  release/
    ios/                        本地导出的 ipa、manifest、安装页模板
```

当前实现已新增 `scripts/build_mobile.js`，通过 `npm run build:mobile` 从 `src/modules/web/web.controller.ts` 生成 `apps/mobile-web/` 和 `mobile-dist/`。后续再考虑把网页端和 App 前端统一成独立前端工程。

`apps/mobile-web/` 和 `mobile-dist/` 都是生成目录，不作为手工维护源码；需要更新移动端页面时，优先修改 `src/modules/web/web.controller.ts` 或 `scripts/build_mobile.js`，再执行 `npm run build:mobile` 和 `npx cap sync ios`。

## 第一步：抽出移动端前端

当前网页端内嵌在 NestJS Controller 中。已通过 `scripts/build_mobile.js` 抽出移动端静态页面：

```text
apps/mobile-web/
  index.html
  styles.css
  app.js
  assets/
```

生成后的移动端页面需要保留现有功能：

- 登录、注册、重置密码、退出登录。
- 书架上下滑动、封面全屏铺满、右下角玻璃信息框。
- 书城搜索、搜索记录胶囊、全部记录、单条删除、全部删除。
- 管理员用户管理和书城管理。
- 阅读器、进度保存、偏好设置。
- 头像和封面上传。

## 第二步：改造 API 地址

当前网页端请求类似：

```js
fetch('/api' + path, options)
```

移动端 App 中需要改成：

```js
const API_BASE_URL = 'https://ai.passerjia.com:8848/api';

fetch(API_BASE_URL + path, options);
```

同时，头像、封面等由后端返回的 `/uploads/...` 路径，在 App 内也要转成绝对地址：

```js
const ASSET_BASE_URL = 'https://ai.passerjia.com:8848';

function toAssetUrl(value) {
  if (!value) return value;
  if (/^(https?:|data:|blob:)/.test(value)) return value;
  return ASSET_BASE_URL + value;
}
```

移动端中所有图片展示位置都应经过 `toAssetUrl()` 处理。

## 第三步：后端增加 CORS 支持

Capacitor iOS App 调用线上 API 时，Origin 通常不是 `https://ai.passerjia.com:8848`，而是类似 `capacitor://localhost`。

需要在 `src/main.ts` 中启用 CORS。建议配置：

```ts
app.enableCors({
  origin: ['capacitor://localhost', 'ionic://localhost'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

注意：

- 本配置用于 App 访问线上 API。
- 不要为了本地调试而启动本地服务。
- 修改后仍按现有流程部署到云机，并通过 `https://ai.passerjia.com:8848/` 验证。

## 第四步：接入 Capacitor

安装依赖：

```bash
npm install @capacitor/core @capacitor/ios @capacitor/preferences @capacitor/status-bar @capacitor/splash-screen @capacitor/camera
npm install -D @capacitor/cli
```

初始化：

```bash
npx cap init "小说阅读器" "com.passerjia.novelreader" --web-dir mobile-dist
npx cap add ios
```

推荐 `capacitor.config.ts`：

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.passerjia.novelreader',
  appName: '小说阅读器',
  webDir: 'mobile-dist',
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
```

发布包不要配置 `server.url`。`server.url` 会让 App 变成远程网页壳，不符合第一版推荐方案。

构建移动端资源后同步到 iOS 工程：

```bash
npm run build:mobile
npx cap sync ios
```

`build:mobile` 是后续需要新增的脚本，用于把 `apps/mobile-web/` 构建或复制到 `mobile-dist/`。

## 第五步：iOS 原生工程设置

打开 Xcode 工程：

```bash
npx cap open ios
```

当前项目已生成 Capacitor iOS 工程，路径为 `ios/App/App.xcodeproj`。如果命令行执行 `xcodebuild` 时卡在 Swift Package 下载或出现 `Capacitor.xcframework.zip` 超时，优先在 Xcode 中打开工程，让 Xcode 继续解析 Swift Package；网络可用后再重新构建。

在 Xcode 中检查：

- Team：选择 Apple Developer 账号对应团队。
- Bundle Identifier：`com.passerjia.novelreader`。
- Display Name：`小说阅读器`。
- Signing：使用 Ad Hoc 对应的证书和 Provisioning Profile。
- Deployment Target：按当前 Capacitor iOS 官方要求和目标设备系统版本设置。
- App Icon：补齐所有要求尺寸。
- Launch Screen：设置启动页。

如果使用相册或相机，需要在 `ios/App/App/Info.plist` 中加入权限说明：

```xml
<key>NSCameraUsageDescription</key>
<string>用于拍摄并上传头像或书籍封面。</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>用于从相册选择头像或书籍封面。</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>用于保存应用相关图片。</string>
```

线上接口是 HTTPS，不应增加不必要的 App Transport Security 放行配置。

## 第六步：登录态和原生能力

第一版可以继续使用浏览器存储保存 token，但推荐尽快改为 Capacitor Preferences：

```ts
import { Preferences } from '@capacitor/preferences';

await Preferences.set({ key: 'novel_token', value: token });
const saved = await Preferences.get({ key: 'novel_token' });
await Preferences.remove({ key: 'novel_token' });
```

移动端专项能力建议：

- 使用 `@capacitor/status-bar` 控制状态栏颜色和沉浸效果。
- 使用 `@capacitor/splash-screen` 管理启动页。
- 使用 `@capacitor/camera` 调用相册和相机。
- 保留现有文件上传接口，不新增独立上传后端。

## 第七步：Ad Hoc 打包

Apple Developer 后台需要完成：

1. 创建 App ID：`com.passerjia.novelreader`。
2. 登记要安装的 iPhone UDID。
3. 创建 iOS Distribution Certificate。
4. 创建 Ad Hoc Provisioning Profile，并选择已登记设备。
5. 下载 Provisioning Profile 到本地。

Xcode 打包：

1. 选择真实设备或 `Any iOS Device`。
2. `Product > Archive`。
3. Archive 完成后选择 `Distribute App`。
4. 选择 `Ad Hoc`。
5. 导出 `.ipa`。

输出文件建议放到：

```text
release/ios/
  novel-reader.ipa
  manifest.plist
  index.html
  icon-57.png
  icon-512.png
```

每次重新打包都要递增版本号：

- `CFBundleShortVersionString`：例如 `1.0.0`。
- `CFBundleVersion`：例如 `1`、`2`、`3`。

## 第八步：生成安装页

当前实现已在 NestJS 中托管 `downloads/` 静态目录，云机运行目录为 `/home/ubuntu/novel_server/downloads/ios/`。如果后续希望交给 nginx 直接托管，也可以使用下面的独立目录方案。

云机可选目录：

```text
/var/www/novel-ios/
  index.html
  novel-reader.ipa
  manifest.plist
  icon-57.png
  icon-512.png
```

目标访问地址：

```text
https://ai.passerjia.com:8848/downloads/ios/
```

`manifest.plist` 示例：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>items</key>
  <array>
    <dict>
      <key>assets</key>
      <array>
        <dict>
          <key>kind</key>
          <string>software-package</string>
          <key>url</key>
          <string>https://ai.passerjia.com:8848/downloads/ios/novel-reader.ipa</string>
        </dict>
        <dict>
          <key>kind</key>
          <string>display-image</string>
          <key>needs-shine</key>
          <false/>
          <key>url</key>
          <string>https://ai.passerjia.com:8848/downloads/ios/icon-57.png</string>
        </dict>
        <dict>
          <key>kind</key>
          <string>full-size-image</string>
          <key>needs-shine</key>
          <false/>
          <key>url</key>
          <string>https://ai.passerjia.com:8848/downloads/ios/icon-512.png</string>
        </dict>
      </array>
      <key>metadata</key>
      <dict>
        <key>bundle-identifier</key>
        <string>com.passerjia.novelreader</string>
        <key>bundle-version</key>
        <string>1.0.0</string>
        <key>kind</key>
        <string>software</string>
        <key>title</key>
        <string>小说阅读器</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>
```

`index.html` 中的安装链接：

```html
<a href="itms-services://?action=download-manifest&url=https://ai.passerjia.com:8848/downloads/ios/manifest.plist">
  安装小说阅读器
</a>
```

如果 iOS 当前版本或设备策略限制 Safari 直接安装，则保底方案是仍提供 `.ipa` 下载，并使用 Apple Configurator 或 Xcode 安装到已登记设备。

## 第九步：nginx 下载目录

当前已通过 NestJS `app.useStaticAssets(downloadsDir, { prefix: '/downloads' })` 发布下载目录，因此不必须修改 nginx。

如果后续改为 nginx 直接托管，可在云机 `ai.passerjia.com:8848` 对应 server block 中新增静态下载目录。示例：

```nginx
location /downloads/ios/ {
    alias /var/www/novel-ios/;
    add_header Cache-Control "no-store";
    types {
        text/html html;
        application/xml plist;
        application/octet-stream ipa;
        image/png png;
    }
}
```

该 location 要放在通用反向代理 location 之前，避免被代理到 NestJS。

更新 nginx 后：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 第十步：验收清单

安装与启动：

- iPhone Safari 打开 `https://ai.passerjia.com:8848/downloads/ios/`。
- 点击安装后能看到 iOS 安装确认。
- App 图标正常显示。
- App 启动页正常显示。
- 未登记 UDID 的设备不能安装，这是 Ad Hoc 的正常限制。

账号与接口：

- 登录成功。
- token 能持久化，杀掉 App 后重新打开仍保持登录。
- 被禁用账号能收到禁用提示并退出。

书架：

- 封面等比例放大铺满全屏。
- 右下角玻璃信息框正常。
- 手机端上下滑动跟手，不跳书，不抖动。
- 长按、编辑、删除、上传封面正常。

书城：

- 只显示搜索框和搜索按钮。
- 不显示来源名称。
- 搜索使用管理员启用的来源。
- 搜索记录只显示当前用户自己的记录。
- “全部记录”在最左侧。
- 单条删除和全部删除正常。

阅读器：

- 章节加载正常。
- 阅读进度保存正常。
- 返回书架后进度不丢。
- 状态栏和安全区不遮挡正文。

上传：

- 头像上传正常。
- 封面上传正常。
- JPG、PNG、WebP、HEIC/HEIF、AVIF 处理符合后端当前规则。
- 上传失败时显示可读错误，不出现 `JSON Parse error: Unrecognized token '<'`。

管理员：

- 用户管理可用。
- 书城管理可用。
- 至少保留一个启用来源。

## 风险与限制

- Xcode 已安装不等于可以分发安装包。Ad Hoc 分发需要 Apple Developer Program。
- Ad Hoc 安装包只能安装到 Provisioning Profile 中包含的设备。
- Apple 设备登记有数量限制，并且重置周期由 Apple Developer 账号规则控制。
- 证书或 Provisioning Profile 过期后，需要重新签名打包。
- 新增 iPhone UDID 后，需要重新生成 Provisioning Profile 并重新导出 `.ipa`。
- 如果未来要公开分发，仍需要走 App Store 或 TestFlight 审核流程。
- 小说来源内容存在合规风险，正式公开发布前需要单独评估内容来源和版权策略。

## 推荐实施步骤

下面步骤用于交给其他 AI 或开发者连续执行。除 Apple Developer 后台、Xcode 签名选择和 iPhone 真机确认外，其余步骤应尽量一次性做完，不要按天拆分。

第一步：抽出移动端前端资源

- 通过 `scripts/build_mobile.js` 从 `src/modules/web/web.controller.ts` 抽出网页端 HTML、CSS 和 JS。
- 生成 `apps/mobile-web/index.html`、`apps/mobile-web/styles.css`、`apps/mobile-web/app.js` 和 `apps/mobile-web/assets/`。
- 保持现有网页端功能不减少。
- 保留原 NestJS 网页入口，避免影响当前线上网页端。
- 完成条件：`apps/mobile-web/` 可以作为独立静态前端资源被复制到 `mobile-dist/`。

第二步：改造移动端 API 和资源地址

- 将移动端请求从相对路径 `/api` 改成 `https://ai.passerjia.com:8848/api`。
- 将 `/uploads/...` 等相对资源路径转换为 `https://ai.passerjia.com:8848/uploads/...`。
- 保留 Authorization Bearer token 逻辑。
- 处理非 JSON 错误响应，避免再次出现 `JSON Parse error: Unrecognized token '<'`。
- 完成条件：移动端前端所有接口和图片资源都指向线上入口，不依赖本地服务。

第三步：增加 App 访问所需 CORS

- 在 `src/main.ts` 中加入 `app.enableCors()`。
- 允许 `capacitor://localhost` 和 `ionic://localhost`。
- 允许 `Content-Type` 和 `Authorization` 请求头。
- 本地只执行 `npm run typecheck` 和 `npm run build`，不要启动本地服务。
- 完成条件：构建通过，部署到云机后 App WebView 可以访问线上 API。

第四步：增加移动端构建脚本

- 已新增脚本 `npm run build:mobile`。
- 脚本负责清理并生成 `apps/mobile-web/` 和 `mobile-dist/`。
- 当前第一版会从 `src/modules/web/web.controller.ts` 抽取页面，注入移动端 API/资源地址，再复制到 `mobile-dist/`。
- 如果后续引入 Vite 或其他前端构建器，再将输出目录保持为 `mobile-dist/`。
- 完成条件：执行 `npm run build:mobile` 后生成完整 `mobile-dist/index.html`。

第五步：安装并初始化 Capacitor

- 安装 Capacitor 依赖。
- 初始化 App 名称 `小说阅读器`。
- 初始化 Bundle ID `com.passerjia.novelreader`。
- `webDir` 设置为 `mobile-dist`。
- 添加 iOS 平台。
- 完成条件：项目中生成 `capacitor.config.ts` 和 `ios/` 原生工程。

第六步：配置 iOS 原生工程

- 使用 Xcode 打开 `ios/` 工程。
- 设置 Team、Bundle Identifier、Display Name。
- 配置 App Icon 和 Launch Screen。
- 配置相册、相机权限说明。
- 配置状态栏和安全区表现。
- 不配置 `server.url`，避免变成远程网页壳。
- 完成条件：可以通过 Xcode 将 App 安装到已连接真机上进行调试。

第七步：补齐移动端原生体验

- 将 token 持久化从普通 `localStorage` 逐步迁移到 Capacitor Preferences。
- 接入状态栏控制。
- 接入启动页控制。
- 如需原生相册或相机，接入 Capacitor Camera。
- 检查 iPhone 安全区，避免顶部刘海和底部手势条遮挡内容。
- 完成条件：真机上登录、书架、书城、阅读器、上传和管理员页面可用。

第八步：准备 Apple Ad Hoc 签名资料

- 在 Apple Developer 后台创建 App ID：`com.passerjia.novelreader`。
- 登记需要安装的 iPhone UDID。
- 创建 iOS Distribution Certificate。
- 创建包含目标设备的 Ad Hoc Provisioning Profile。
- 下载并安装 Provisioning Profile。
- 完成条件：Xcode Signing 页面可以选择正确 Team 和 Ad Hoc Profile。

第九步：导出 iOS 安装包

- 在 Xcode 中递增版本号和构建号。
- 选择 `Any iOS Device`。
- 执行 `Product > Archive`。
- 选择 `Distribute App > Ad Hoc`。
- 导出 `.ipa` 到 `release/ios/novel-reader.ipa`。
- 完成条件：本地存在可分发的 `release/ios/novel-reader.ipa`。

第十步：生成安装清单和安装页

- 创建 `release/ios/manifest.plist`。
- 创建 `release/ios/index.html`。
- 准备 `icon-57.png` 和 `icon-512.png`。
- 安装页按钮使用 `itms-services://?action=download-manifest&url=https://ai.passerjia.com:8848/downloads/ios/manifest.plist`。
- 完成条件：`release/ios/` 中包含 `.ipa`、`manifest.plist`、`index.html` 和图标文件。

第十一步：部署安装包下载目录

- 将 `release/ios/` 的安装页、manifest、图标和 IPA 放入项目运行目录的 `downloads/ios/`。
- 后端通过 `/downloads` 静态目录对外提供文件。
- 部署后重启 `novel-server.service`。
- 如果改为 nginx 直接托管，再创建 `/var/www/novel-ios/` 并配置 `/downloads/ios/` location。
- 完成条件：`https://ai.passerjia.com:8848/downloads/ios/` 可以打开安装页。

第十二步：真机安装和验收

- 使用已登记 UDID 的 iPhone 打开安装页。
- 点击安装按钮。
- 安装完成后打开 App。
- 按本文档“验收清单”逐项验证。
- 修复发现的问题后重新执行第九步到第十二步。
- 完成条件：目标 iPhone 能正常安装并完整使用主要功能。

第十三步：记录交付信息

- 记录 App 版本号和构建号。
- 记录打包时间。
- 记录使用的 Bundle ID。
- 记录 Provisioning Profile 名称和过期时间。
- 记录已登记测试设备列表。
- 更新项目文档，说明本次 iOS 包对应的代码提交和云机下载地址。
- 完成条件：后续可以根据记录重新签名、重新打包或新增测试设备。

## 最小可交付物

第一版交付应包含：

- iOS App 工程：`ios/`。
- 移动端前端资源：`apps/mobile-web/` 和 `mobile-dist/`。
- iOS 安装包：`release/ios/novel-reader.ipa`。
- 安装清单：`release/ios/manifest.plist`。
- 安装页：`release/ios/index.html`。
- 云机下载地址：`https://ai.passerjia.com:8848/downloads/ios/`。
- 更新后的项目文档，说明打包、安装和重新签名流程。
