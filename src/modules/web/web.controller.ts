import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class WebController {
  @Get()
  @Header('content-type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'no-store')
  index() {
    return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Novel Server</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #171717;
      --subtle: #666f73;
      --soft: #8a9297;
      --line: #d9dddf;
      --line-strong: #bec5c8;
      --page: #f5f6f3;
      --panel: #ffffff;
      --panel-alt: #f0f3f2;
      --black: #111111;
      --accent: #0f766e;
      --accent-2: #9a6b1f;
      --danger: #b42318;
      --reader-bg: #fffaf0;
      --reader-ink: #2c241d;
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      color: var(--ink);
      background: var(--page);
    }
    button, input, select { font: inherit; }
    button {
      height: 36px;
      border: 1px solid var(--black);
      border-radius: 6px;
      background: var(--black);
      color: #fff;
      padding: 0 13px;
      cursor: pointer;
      white-space: nowrap;
    }
    button.secondary {
      background: #fff;
      color: var(--ink);
      border-color: var(--line);
    }
    button.ghost {
      background: transparent;
      color: var(--ink);
      border-color: transparent;
    }
    button.danger {
      background: var(--danger);
      border-color: var(--danger);
    }
    button:disabled {
      opacity: .45;
      cursor: not-allowed;
    }
    input, select {
      width: 100%;
      height: 38px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: #fff;
      color: var(--ink);
      padding: 0 10px;
      outline: none;
    }
    input:focus, select:focus {
      border-color: var(--black);
      box-shadow: 0 0 0 2px rgba(17, 17, 17, .08);
    }
    label {
      display: block;
      margin: 12px 0 6px;
      color: var(--subtle);
      font-size: 13px;
    }
    h1, h2, h3, p { margin: 0; }
    .hidden { display: none !important; }
    .topbar {
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      padding: 0 22px;
      background: #111;
      color: #fff;
      border-bottom: 1px solid #000;
    }
    .brand {
      display: flex;
      align-items: baseline;
      gap: 10px;
      min-width: 0;
    }
    .brand strong {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 0;
    }
    .brand span {
      color: #c7c7c7;
      font-size: 12px;
    }
    .session {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #d7d7d7;
      font-size: 13px;
    }
    .session button {
      height: 30px;
      background: #fff;
      color: #111;
      border-color: #fff;
    }
    .auth-wrap {
      min-height: calc(100vh - 56px);
      display: grid;
      grid-template-columns: minmax(0, 420px) minmax(0, 520px);
      align-items: center;
      justify-content: center;
      gap: 80px;
      padding: 48px 24px;
      background:
        linear-gradient(90deg, rgba(17,17,17,.06) 1px, transparent 1px),
        linear-gradient(180deg, rgba(17,17,17,.05) 1px, transparent 1px),
        var(--page);
      background-size: 42px 42px;
    }
    .auth-card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 32px 30px 16px;
      box-shadow: 0 18px 48px rgba(17, 17, 17, .07);
    }
    .auth-card h1 {
      font-size: 25px;
      line-height: 1.2;
      margin-bottom: 8px;
    }
    .auth-card > .muted {
      font-size: 14px;
      line-height: 1.6;
    }
    .auth-copy {
      align-self: center;
      padding: 6px 0 6px 40px;
    }
    .auth-copy h2 {
      font-size: 29px;
      line-height: 1.35;
      letter-spacing: .5px;
      margin-bottom: 18px;
    }
    .auth-copy p {
      color: var(--subtle);
      line-height: 1.9;
      font-size: 15px;
      max-width: 540px;
    }
    #loginPanel, #registerPanel, #resetPanel {
      margin-top: 18px;
    }
    .auth-switch {
      margin-top: 12px;
      text-align: center;
      color: var(--subtle);
      font-size: 13px;
    }
    .linklike {
      height: auto;
      padding: 0;
      background: transparent;
      border: 0;
      border-radius: 0;
      color: var(--accent);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .linklike:hover {
      text-decoration: underline;
    }
    .auth-sep {
      margin: 0 10px;
      color: var(--line-strong);
    }
    .auth-card .toolbar {
      margin-top: 32px;
    }
    .auth-card .toolbar button {
      width: 100%;
      height: 44px;
      font-size: 15px;
      font-weight: 600;
    }
    .app-shell {
      height: calc(100vh - 56px);
      display: grid;
      grid-template-columns: 248px 1fr;
    }
    .sidebar {
      background: #ffffff;
      border-right: 1px solid var(--line);
      padding: 18px 14px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
    }
    .userbox {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      background: var(--panel-alt);
    }
    .userbox strong {
      display: block;
      font-size: 15px;
      margin-bottom: 4px;
    }
    .userbox span, .muted {
      color: var(--subtle);
      font-size: 13px;
      line-height: 1.45;
    }
    .nav {
      display: grid;
      gap: 6px;
    }
    .nav button {
      width: 100%;
      justify-content: flex-start;
      text-align: left;
      background: #fff;
      color: var(--ink);
      border-color: transparent;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .nav button.active {
      background: var(--black);
      color: #fff;
      border-color: var(--black);
    }
    .nav small {
      width: 22px;
      color: inherit;
      opacity: .8;
      font-size: 13px;
    }
    .content {
      padding: 22px;
      min-width: 0;
      overflow-y: auto;
    }
    .view {
      display: grid;
      gap: 14px;
      max-width: 1180px;
      margin: 0 auto;
    }
    .view-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .view-head h1 {
      font-size: 22px;
      line-height: 1.25;
    }
    .view-head p {
      margin-top: 4px;
      color: var(--subtle);
      font-size: 13px;
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px;
    }
    .book-list, .result-list, .user-list {
      display: grid;
      gap: 10px;
    }
    .book-row, .result-row, .user-row {
      display: grid;
      grid-template-columns: 76px 1fr auto;
      gap: 13px;
      align-items: center;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      padding: 12px;
    }
    .cover {
      width: 76px;
      height: 102px;
      border-radius: 6px;
      background: #202020;
      color: #fff;
      border: 1px solid #111;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 9px;
      font-size: 13px;
      font-weight: 650;
      line-height: 1.35;
      overflow: hidden;
    }
    .cover.manual { background: #263238; }
    .cover.quanben { background: #5c4324; }
    .cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 5px;
    }
    .book-main {
      min-width: 0;
      display: grid;
      gap: 6px;
    }
    .book-title {
      font-size: 17px;
      font-weight: 700;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }
    .book-meta {
      color: var(--subtle);
      font-size: 13px;
      line-height: 1.55;
    }
    .progress-track {
      height: 6px;
      width: 100%;
      max-width: 360px;
      border-radius: 999px;
      background: #e7e8e8;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      width: 0%;
      background: var(--accent);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .empty {
      border: 1px dashed var(--line-strong);
      border-radius: 8px;
      padding: 24px;
      color: var(--subtle);
      background: rgba(255,255,255,.7);
    }
    .search-bar {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) 180px auto;
      gap: 8px;
    }
    .reader-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
      min-height: calc(100vh - 116px);
    }
    .reader-top-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .reader-top-right button {
      height: 30px;
      padding: 0 14px;
    }
    .reader-top-back {
      height: 32px;
      padding: 0 13px;
      border-radius: 999px;
      background: rgba(17, 17, 17, .92);
      border-color: rgba(17, 17, 17, .92);
      color: #fff;
      font-weight: 650;
      box-shadow: 0 8px 20px rgba(0, 0, 0, .12);
    }
    .reader-panel.night .reader-top-back {
      background: #e6ded1;
      border-color: #e6ded1;
      color: #16191a;
    }
    .reader-panel.eye .reader-top-back {
      background: #233026;
      border-color: #233026;
      color: #fff;
    }
    .chapter-list {
      display: grid;
      gap: 6px;
      overflow: auto;
    }
    .chapter-list button {
      width: 100%;
      height: auto;
      min-height: 36px;
      text-align: left;
      background: #fff;
      color: var(--ink);
      border-color: var(--line);
      padding: 8px 10px;
      white-space: normal;
    }
    .chapter-list button.active {
      background: var(--black);
      color: #fff;
      border-color: var(--black);
    }
    .catalog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, .42);
      z-index: 30;
      display: flex;
      justify-content: flex-end;
    }
    .catalog-drawer {
      width: min(380px, 86vw);
      height: 100%;
      background: #fff;
      border-left: 1px solid var(--line);
      box-shadow: -14px 0 36px rgba(0, 0, 0, .2);
      display: flex;
      flex-direction: column;
    }
    .catalog-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid var(--line);
    }
    .catalog-head strong { font-size: 16px; }
    .catalog-drawer .chapter-list {
      flex: 1;
      max-height: none;
      overflow: auto;
      padding: 12px 14px;
    }
    .drawer-body {
      padding: 16px;
      display: grid;
      gap: 14px;
      align-content: start;
      overflow-y: auto;
    }
    .reader-panel {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--reader-bg);
      min-width: 0;
      display: grid;
      grid-template-rows: auto 1fr auto;
      overflow: hidden;
    }
    .reader-top, .reader-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px 16px;
      background: rgba(255,255,255,.62);
      border-bottom: 1px solid rgba(0,0,0,.08);
    }
    .reader-bottom {
      border-top: 1px solid rgba(0,0,0,.08);
      border-bottom: 0;
    }
    .reader-content {
      overflow: auto;
      padding: 28px clamp(18px, 4vw, 58px);
      color: var(--reader-ink);
      line-height: 1.9;
      font-size: var(--reader-size, 18px);
    }
    .reader-content h2 {
      font-size: 1.35em;
      margin-bottom: 22px;
    }
    .reader-content p {
      margin: 0 0 18px;
      overflow-wrap: anywhere;
    }
    .reader-panel.night {
      --reader-bg: #16191a;
      --reader-ink: #e6ded1;
    }
    .reader-panel.eye {
      --reader-bg: #eef5e9;
      --reader-ink: #233026;
    }
    body.reader-mode {
      background: var(--reader-bg);
    }
    body.reader-mode .app-shell {
      grid-template-columns: 1fr;
    }
    body.reader-mode .sidebar {
      display: none;
    }
    body.reader-mode .content {
      padding: 0;
      overflow: hidden;
      background: var(--reader-bg);
    }
    body.reader-mode #readerView {
      max-width: none;
      width: 100%;
      height: 100%;
      margin: 0;
      gap: 0;
    }
    body.reader-mode #readerView .view-head {
      display: none;
    }
    body.reader-mode .reader-layout {
      min-height: 100%;
      height: 100%;
      gap: 0;
    }
    body.reader-mode .reader-panel {
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }
    body.reader-mode .reader-content {
      padding: 32px clamp(18px, 7vw, 84px);
    }
    body.reader-mode .reader-content h2,
    body.reader-mode .reader-content p {
      max-width: 860px;
      margin-left: auto;
      margin-right: auto;
    }
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(160px, 1fr));
      gap: 12px;
    }
    .setting {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      background: #fff;
    }
    .setting strong {
      display: block;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .toast {
      position: fixed;
      right: 18px;
      bottom: 18px;
      min-width: 220px;
      max-width: min(420px, calc(100vw - 36px));
      padding: 12px 14px;
      border-radius: 8px;
      color: #fff;
      background: var(--black);
      box-shadow: 0 12px 32px rgba(0,0,0,.18);
      z-index: 20;
      font-size: 14px;
    }
    .toast.err { background: var(--danger); }
    .loading-overlay {
      position: fixed;
      inset: 0;
      z-index: 55;
      display: grid;
      place-items: center;
      padding: 18px;
      background: rgba(17, 17, 17, .28);
      backdrop-filter: blur(2px);
    }
    .loading-card {
      min-width: 168px;
      border-radius: 10px;
      background: rgba(255, 255, 255, .96);
      border: 1px solid rgba(217, 221, 223, .92);
      box-shadow: 0 24px 70px rgba(17, 17, 17, .22);
      padding: 20px 22px 18px;
      display: grid;
      justify-items: center;
      gap: 12px;
    }
    .loading-mark {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      border: 3px solid rgba(15, 118, 110, .18);
      border-top-color: var(--accent);
      border-right-color: #111;
      animation: loading-spin .8s linear infinite;
    }
    .loading-text {
      color: var(--ink);
      font-size: 14px;
      font-weight: 650;
      line-height: 1.2;
    }
    @keyframes loading-spin {
      to { transform: rotate(360deg); }
    }
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 60;
      display: grid;
      place-items: center;
      padding: 18px;
      background: rgba(0, 0, 0, .42);
    }
    .message-modal {
      width: min(360px, 100%);
      border-radius: 10px;
      background: #fff;
      border: 1px solid var(--line);
      box-shadow: 0 24px 70px rgba(0, 0, 0, .22);
      padding: 24px;
      text-align: center;
    }
    .message-modal h2 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .message-modal p {
      color: var(--subtle);
      line-height: 1.7;
      margin-bottom: 22px;
    }
    .message-modal button {
      width: 100%;
      height: 42px;
    }
    .form-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(160px, 1fr));
      gap: 10px;
    }
    @media (max-width: 920px) {
      .auth-wrap { grid-template-columns: 1fr; align-items: start; }
      .auth-copy { display: none; }
      .app-shell { grid-template-columns: 1fr; }
      .sidebar {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 18;
        border-right: 0;
        border-top: 1px solid rgba(17, 17, 17, .12);
        padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
        box-shadow: 0 -12px 32px rgba(17, 17, 17, .09);
        background: rgba(255, 255, 255, .96);
        backdrop-filter: blur(12px);
      }
      .nav {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .nav button {
        justify-content: center;
        text-align: center;
        height: 46px;
        border-radius: 999px;
        border-color: transparent;
        background: transparent;
        font-weight: 650;
      }
      .nav small { display: none; }
      .userbox { display: none; }
      .content {
        height: calc(100vh - 56px);
        padding: 16px 14px calc(86px + env(safe-area-inset-bottom));
      }
      .reader-layout { grid-template-columns: 1fr; }
      .chapter-list { max-height: 180px; }
      .catalog-drawer .chapter-list { max-height: none; }
      .search-bar { grid-template-columns: 1fr; }
      body.reader-mode .content {
        height: calc(100vh - 56px);
        padding: 0;
      }
      body.reader-mode .sidebar {
        display: none;
      }
      body.reader-mode .reader-content {
        padding: 26px 18px;
      }
    }
    @media (max-width: 640px) {
      .topbar { padding: 0 14px; }
      .brand span { display: none; }
      .content { padding: 14px 14px calc(86px + env(safe-area-inset-bottom)); }
      .auth-wrap { padding: 28px 16px; }
      .auth-card { padding: 26px 22px; }
      .book-row, .result-row, .user-row {
        grid-template-columns: 58px 1fr;
      }
      .cover {
        width: 58px;
        height: 80px;
        font-size: 12px;
      }
      .actions {
        grid-column: 1 / -1;
        justify-content: flex-start;
      }
      .settings-grid, .form-row { grid-template-columns: 1fr; }
    }
  

    /* ===================================================== */
    /* Ink & Paper redesign — appended; overrides shared rules */
    /* above via cascade. Cloud-only rules (loading modal,    */
    /* message-modal, reader-mode, reader-top-back) preserved.*/
    /* ===================================================== */

    :root {
      color-scheme: light;
      --ink: #1d1a16;
      --subtle: #6c655b;
      --soft: #978d7e;
      --line: #e4ddcd;
      --line-strong: #cbbfa6;
      --page: #f4efe4;
      --panel: #fffdf7;
      --panel-alt: #f1ece0;
      --black: #16140f;
      --accent: #0f766e;
      --accent-strong: #0c655e;
      --accent-soft: rgba(15, 118, 110, .12);
      --accent-2: #9a6b1f;
      --seal: #b23b2e;
      --danger: #b42318;
      --reader-bg: #fbf3e2;
      --reader-ink: #2c241d;
      --font-ui: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      --font-serif: "Songti SC", "STSong", "Noto Serif SC", Georgia, "Times New Roman", "SimSun", serif;
      --font-display: Georgia, "Iowan Old Style", "Songti SC", "Noto Serif SC", serif;
      --shadow-sm: 0 1px 2px rgba(28, 24, 16, .06), 0 2px 8px rgba(28, 24, 16, .05);
      --shadow-md: 0 14px 36px rgba(28, 24, 16, .10);
      --shadow-lg: 0 30px 70px rgba(28, 24, 16, .16);
      --ease: cubic-bezier(.4, 0, .2, 1);
      --ease-out: cubic-bezier(.16, 1, .3, 1);
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font-family: var(--font-ui);
      color: var(--ink);
      background: var(--page);
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    button, input, select { font: inherit; }
    button {
      height: 36px;
      border: 1px solid var(--black);
      border-radius: 8px;
      background: var(--black);
      color: #fff;
      padding: 0 14px;
      cursor: pointer;
      white-space: nowrap;
      font-weight: 600;
      letter-spacing: .01em;
      transition: transform .14s var(--ease), box-shadow .2s var(--ease), background .2s var(--ease), border-color .2s var(--ease), color .2s var(--ease), opacity .2s var(--ease);
    }
    button:hover { box-shadow: var(--shadow-sm); transform: translateY(-1px); }
    button:active { transform: translateY(1px) scale(.985); box-shadow: none; }
    button.secondary {
      background: var(--panel);
      color: var(--ink);
      border-color: var(--line-strong);
    }
    button.secondary:hover { border-color: var(--ink); background: #fff; }
    button.ghost {
      background: transparent;
      color: var(--ink);
      border-color: transparent;
      font-weight: 500;
    }
    button.ghost:hover { background: var(--accent-soft); box-shadow: none; transform: none; color: var(--accent-strong); }
    button.danger {
      background: var(--danger);
      border-color: var(--danger);
    }
    button:disabled {
      opacity: .4;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    input, select {
      width: 100%;
      height: 40px;
      border: 1px solid var(--line-strong);
      border-radius: 8px;
      background: #fff;
      color: var(--ink);
      padding: 0 12px;
      outline: none;
      transition: border-color .18s var(--ease), box-shadow .18s var(--ease), background .18s var(--ease);
    }
    input::placeholder { color: var(--soft); }
    input:focus, select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 4px var(--accent-soft);
    }
    label {
      display: block;
      margin: 13px 0 6px;
      color: var(--subtle);
      font-size: 13px;
      font-weight: 500;
      letter-spacing: .01em;
    }
    h1, h2, h3, p { margin: 0; }
    :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    ::selection { background: rgba(15, 118, 110, .18); }
    .hidden { display: none !important; }
    @keyframes riseIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideInRight { from { transform: translateX(28px); opacity: .4; } to { transform: translateX(0); opacity: 1; } }
    @keyframes toastIn { from { opacity: 0; transform: translateY(12px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .topbar {
      height: 58px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      padding: 0 24px;
      background: linear-gradient(180deg, #1c1a14, #131109);
      color: #fff;
      border-bottom: 1px solid #000;
      box-shadow: 0 1px 0 rgba(15, 118, 110, .5), var(--shadow-sm);
      position: relative;
      z-index: 5;
    }
    .brand {
      display: flex;
      align-items: baseline;
      gap: 12px;
      min-width: 0;
    }
    .brand::before {
      content: "";
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--seal);
      box-shadow: 0 0 0 3px rgba(178, 59, 46, .25);
      align-self: center;
      flex: none;
    }
    .brand strong {
      font-family: var(--font-display);
      font-size: 19px;
      font-weight: 700;
      letter-spacing: .02em;
    }
    .brand span {
      color: #b7b0a2;
      font-size: 12px;
      letter-spacing: .12em;
    }
    .session {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #cfc8ba;
      font-size: 13px;
    }
    .session button {
      height: 32px;
      background: rgba(255, 255, 255, .94);
      color: #16140f;
      border-color: transparent;
    }
    .session button:hover { background: #fff; }
    .auth-wrap {
      min-height: calc(100vh - 58px);
      display: grid;
      grid-template-columns: minmax(0, 430px) minmax(0, 520px);
      align-items: center;
      justify-content: center;
      gap: 72px;
      padding: 48px 24px;
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(1100px 560px at 8% -12%, rgba(15, 118, 110, .12), transparent 60%),
        radial-gradient(920px 520px at 104% 4%, rgba(154, 107, 31, .12), transparent 56%),
        radial-gradient(760px 760px at 50% 128%, rgba(178, 59, 46, .07), transparent 60%),
        var(--page);
    }
    .auth-wrap::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(28, 24, 16, .035) 1px, transparent 1px),
        linear-gradient(180deg, rgba(28, 24, 16, .03) 1px, transparent 1px);
      background-size: 46px 46px;
      mask-image: radial-gradient(120% 120% at 50% 30%, #000 35%, transparent 78%);
      -webkit-mask-image: radial-gradient(120% 120% at 50% 30%, #000 35%, transparent 78%);
      pointer-events: none;
    }
    .auth-card {
      position: relative;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 36px 34px 20px;
      box-shadow: var(--shadow-lg);
      animation: riseIn .6s var(--ease-out) both;
    }
    .auth-card::before {
      content: "";
      position: absolute;
      left: 34px;
      right: 34px;
      top: 0;
      height: 3px;
      border-radius: 0 0 4px 4px;
      background: linear-gradient(90deg, var(--accent), var(--accent-2) 70%, var(--seal));
    }
    .auth-card h1 {
      font-family: var(--font-display);
      font-size: 27px;
      line-height: 1.2;
      margin-bottom: 8px;
      letter-spacing: .01em;
    }
    .auth-card > .muted {
      font-size: 14px;
      line-height: 1.6;
    }
    .auth-copy {
      align-self: center;
      padding: 6px 0 6px 44px;
      position: relative;
      animation: riseIn .7s var(--ease-out) .1s both;
    }
    .auth-copy::before {
      content: "“";
      position: absolute;
      left: -6px;
      top: -38px;
      font-family: var(--font-display);
      font-size: 120px;
      line-height: 1;
      color: var(--accent);
      opacity: .16;
    }
    .auth-copy h2 {
      font-family: var(--font-serif);
      font-size: 31px;
      line-height: 1.5;
      letter-spacing: .02em;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .auth-copy p {
      color: var(--subtle);
      line-height: 2;
      font-size: 15px;
      max-width: 540px;
    }
    #loginPanel, #registerPanel, #resetPanel {
      margin-top: 18px;
      animation: fadeIn .35s var(--ease) both;
    }
    .auth-switch {
      margin-top: 14px;
      text-align: center;
      color: var(--subtle);
      font-size: 13px;
    }
    .linklike {
      height: auto;
      padding: 0;
      background: transparent;
      border: 0;
      border-radius: 0;
      color: var(--accent);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      background-image: linear-gradient(var(--accent), var(--accent));
      background-size: 0% 1.5px;
      background-position: 0 100%;
      background-repeat: no-repeat;
      transition: background-size .25s var(--ease), color .2s var(--ease);
    }
    .linklike:hover {
      background-size: 100% 1.5px;
      box-shadow: none;
      transform: none;
    }
    .linklike.active { color: var(--accent-strong); background-size: 100% 1.5px; }
    .auth-sep {
      margin: 0 10px;
      color: var(--line-strong);
    }
    .auth-card .toolbar {
      margin-top: 30px;
    }
    .auth-card .toolbar button {
      width: 100%;
      height: 46px;
      font-size: 15px;
      font-weight: 600;
      background: linear-gradient(180deg, #1f1c14, #16140f);
      letter-spacing: .04em;
    }
    .app-shell {
      height: calc(100vh - 58px);
      display: grid;
      grid-template-columns: 256px 1fr;
    }
    .sidebar {
      background: linear-gradient(180deg, var(--panel), var(--panel-alt));
      border-right: 1px solid var(--line);
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      overflow-y: auto;
    }
    .userbox {
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 14px;
      background: var(--panel);
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
    }
    .userbox::before {
      content: "";
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: linear-gradient(180deg, var(--accent), var(--accent-2));
    }
    .userbox strong {
      display: block;
      font-family: var(--font-display);
      font-size: 16px;
      margin-bottom: 4px;
    }
    .userbox span, .muted {
      color: var(--subtle);
      font-size: 13px;
      line-height: 1.45;
    }
    .nav {
      display: grid;
      gap: 6px;
    }
    .nav button {
      width: 100%;
      justify-content: flex-start;
      text-align: left;
      background: transparent;
      color: var(--subtle);
      border-color: transparent;
      display: flex;
      align-items: center;
      gap: 12px;
      height: 42px;
      font-weight: 600;
    }
    .nav button:hover {
      background: var(--accent-soft);
      color: var(--accent-strong);
      transform: none;
      box-shadow: none;
    }
    .nav button.active {
      background: var(--black);
      color: #fff;
      border-color: var(--black);
      box-shadow: var(--shadow-sm);
      transform: none;
    }
    .nav small {
      width: 22px;
      color: inherit;
      opacity: .55;
      font-size: 12px;
      font-family: var(--font-display);
      font-style: italic;
    }
    .content {
      padding: 26px;
      min-width: 0;
      overflow-y: auto;
    }
    .view {
      display: grid;
      gap: 16px;
      max-width: 1180px;
      margin: 0 auto;
      animation: riseIn .4s var(--ease-out) both;
    }
    .view-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .view-head h1 {
      font-family: var(--font-display);
      font-size: 24px;
      line-height: 1.25;
      letter-spacing: .01em;
      position: relative;
      padding-left: 14px;
    }
    .view-head h1::before {
      content: "";
      position: absolute;
      left: 0;
      top: .18em;
      bottom: .18em;
      width: 4px;
      border-radius: 3px;
      background: linear-gradient(180deg, var(--accent), var(--accent-2));
    }
    .view-head p {
      margin-top: 6px;
      color: var(--subtle);
      font-size: 13px;
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 18px;
      box-shadow: var(--shadow-sm);
    }
    .book-list, .result-list, .user-list {
      display: grid;
      gap: 12px;
    }
    .book-row, .result-row, .user-row {
      display: grid;
      grid-template-columns: 76px 1fr auto;
      gap: 16px;
      align-items: center;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: var(--panel);
      padding: 14px;
      box-shadow: var(--shadow-sm);
      transition: transform .2s var(--ease), box-shadow .25s var(--ease), border-color .2s var(--ease);
      animation: riseIn .45s var(--ease-out) both;
    }
    .book-row:hover, .result-row:hover, .user-row:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--line-strong);
    }
    .book-list .book-row:nth-child(1), .result-list .result-row:nth-child(1), .user-list .user-row:nth-child(1) { animation-delay: .02s; }
    .book-list .book-row:nth-child(2), .result-list .result-row:nth-child(2), .user-list .user-row:nth-child(2) { animation-delay: .06s; }
    .book-list .book-row:nth-child(3), .result-list .result-row:nth-child(3), .user-list .user-row:nth-child(3) { animation-delay: .10s; }
    .book-list .book-row:nth-child(4), .result-list .result-row:nth-child(4), .user-list .user-row:nth-child(4) { animation-delay: .14s; }
    .book-list .book-row:nth-child(5), .result-list .result-row:nth-child(5), .user-list .user-row:nth-child(5) { animation-delay: .18s; }
    .book-list .book-row:nth-child(n+6), .result-list .result-row:nth-child(n+6), .user-list .user-row:nth-child(n+6) { animation-delay: .22s; }
    .cover {
      width: 76px;
      height: 102px;
      border-radius: 8px;
      background: #202020;
      color: #fff;
      border: 1px solid #111;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 9px;
      font-family: var(--font-serif);
      font-size: 13px;
      font-weight: 650;
      line-height: 1.35;
      overflow: hidden;
      position: relative;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .06), var(--shadow-sm);
      transition: transform .25s var(--ease-out), box-shadow .25s var(--ease);
    }
    .cover::after {
      content: "";
      position: absolute;
      left: 6px; top: 0; bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, rgba(255, 255, 255, .28), rgba(255, 255, 255, .04));
    }
    .book-row:hover .cover { transform: translateY(-2px) rotate(-1deg); box-shadow: var(--shadow-md); }
    .cover.manual { background: linear-gradient(150deg, #2f3d44, #1c2429); }
    .cover.quanben { background: linear-gradient(150deg, #6b4f29, #3f2d16); }
    .cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
    }
    /* ===== 书架卡片放大 + 让用户上传的封面作主角 ===== */
    #bookshelfList .book-row {
      grid-template-columns: 110px 1fr auto;
      gap: 20px;
      padding: 18px;
    }
    #bookshelfList .cover {
      width: 110px;
      height: 160px;
      border-radius: 10px;
    }
    #bookshelfList .book-title {
      font-size: 19px;
    }
    /* 有真实上传封面时:去掉书脊高光线、深色硬边框与内边距,让照片满铺、像一张悬浮的相片 */
    .cover.has-image {
      padding: 0;
      border: 0;
      background: var(--panel-alt);
      border-radius: 10px;
      box-shadow:
        0 0 0 1px rgba(28, 24, 16, .06),
        0 10px 24px rgba(28, 24, 16, .18);
    }
    .cover.has-image::after { content: none; }
    .cover.has-image img {
      border-radius: inherit;
      display: block;
    }
    .book-row:hover .cover.has-image {
      transform: translateY(-3px);
      box-shadow:
        0 0 0 1px rgba(28, 24, 16, .08),
        0 18px 40px rgba(28, 24, 16, .26);
    }
    .book-main {
      min-width: 0;
      display: grid;
      gap: 6px;
    }
    .book-title {
      font-family: var(--font-display);
      font-size: 17px;
      font-weight: 700;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }
    .book-meta {
      color: var(--subtle);
      font-size: 13px;
      line-height: 1.6;
    }
    .user-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 650;
      color: var(--subtle);
      white-space: nowrap;
    }
    .user-status::before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--status-dot);
      box-shadow: 0 0 0 3px var(--status-ring);
      flex: 0 0 auto;
    }
    .user-status.online {
      --status-dot: #1f9d63;
      --status-ring: rgba(31, 157, 99, .16);
      color: #1f7a50;
    }
    .user-status.offline {
      --status-dot: #c9453c;
      --status-ring: rgba(201, 69, 60, .16);
      color: #b0413e;
    }
    .progress-track {
      height: 6px;
      width: 100%;
      max-width: 360px;
      border-radius: 999px;
      background: var(--panel-alt);
      overflow: hidden;
      box-shadow: inset 0 0 0 1px var(--line);
    }
    .progress-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      transition: width .5s var(--ease-out);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .pager {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      padding: 4px 0;
    }
    .pager button {
      min-width: 34px;
      height: 34px;
      padding: 0 12px;
    }
    .pager button.active {
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      border-color: transparent;
      color: #fff;
    }
    .pager button:disabled {
      cursor: default;
      opacity: .48;
      transform: none;
    }
    .pager-info {
      color: var(--subtle);
      font-size: 13px;
      padding: 0 4px;
    }
    .empty {
      border: 1px dashed var(--line-strong);
      border-radius: 14px;
      padding: 30px 24px;
      color: var(--subtle);
      background: rgba(255, 255, 255, .5);
      text-align: center;
      line-height: 1.7;
    }
    .empty::before {
      content: "❦";
      display: block;
      font-size: 28px;
      color: var(--accent);
      opacity: .5;
      margin-bottom: 10px;
    }
    .search-bar {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) 180px auto;
      gap: 10px;
    }
    .reader-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
      min-height: calc(100vh - 120px);
    }
    .reader-top-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .reader-top-right button {
      height: 32px;
      padding: 0 14px;
    }
    .chapter-list {
      display: grid;
      gap: 6px;
      overflow: auto;
    }
    .chapter-list button {
      width: 100%;
      height: auto;
      min-height: 36px;
      text-align: left;
      background: var(--panel);
      color: var(--ink);
      border-color: var(--line);
      padding: 9px 12px;
      white-space: normal;
      font-weight: 500;
      border-radius: 8px;
    }
    .chapter-list button:hover {
      transform: none;
      box-shadow: none;
      border-color: var(--accent);
      background: var(--accent-soft);
      color: var(--accent-strong);
    }
    .chapter-list button.active {
      background: var(--black);
      color: #fff;
      border-color: var(--black);
      transform: none;
    }
    .catalog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(20, 16, 10, .46);
      z-index: 30;
      display: flex;
      justify-content: flex-end;
      animation: fadeIn .2s var(--ease) both;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
    }
    .catalog-drawer {
      width: min(390px, 88vw);
      height: 100%;
      background: var(--panel);
      border-left: 1px solid var(--line);
      box-shadow: -24px 0 60px rgba(0, 0, 0, .26);
      display: flex;
      flex-direction: column;
      animation: slideInRight .32s var(--ease-out) both;
    }
    .catalog-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 18px;
      border-bottom: 1px solid var(--line);
      background: var(--panel-alt);
    }
    .catalog-head strong { font-family: var(--font-display); font-size: 16px; }
    .catalog-drawer .chapter-list {
      flex: 1;
      max-height: none;
      overflow: auto;
      padding: 14px;
    }
    .drawer-body {
      padding: 18px;
      display: grid;
      gap: 14px;
      align-content: start;
      overflow-y: auto;
    }
    .reader-panel {
      border: 1px solid var(--line);
      border-radius: 14px;
      background: var(--reader-bg);
      min-width: 0;
      display: grid;
      grid-template-rows: auto 1fr auto;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: background .35s var(--ease), color .35s var(--ease);
    }
    .reader-top, .reader-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 13px 18px;
      background: rgba(255, 255, 255, .5);
      border-bottom: 1px solid rgba(0, 0, 0, .07);
    }
    .reader-top strong { font-family: var(--font-display); font-size: 15px; }
    .reader-bottom {
      border-top: 1px solid rgba(0, 0, 0, .07);
      border-bottom: 0;
    }
    .reader-content {
      overflow: auto;
      padding: 32px clamp(18px, 4vw, 64px);
      color: var(--reader-ink);
      line-height: 2;
      font-size: var(--reader-size, 18px);
      font-family: var(--font-serif);
    }
    .reader-content h2 {
      font-family: var(--font-display);
      font-size: 1.4em;
      margin-bottom: 24px;
      text-align: center;
      letter-spacing: .02em;
    }
    .reader-content h2::after {
      content: "❖";
      display: block;
      font-size: .42em;
      color: var(--accent);
      opacity: .5;
      margin-top: 14px;
      font-weight: 400;
    }
    .reader-content p {
      margin: 0 0 18px;
      overflow-wrap: anywhere;
      text-indent: 2em;
    }
    .reader-panel.night {
      --reader-bg: #15181a;
      --reader-ink: #e6ded1;
    }
    .reader-panel.night .reader-top, .reader-panel.night .reader-bottom {
      background: rgba(255, 255, 255, .04);
      border-color: rgba(255, 255, 255, .08);
    }
    .reader-panel.eye {
      --reader-bg: #e7f1e0;
      --reader-ink: #233026;
    }
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(160px, 1fr));
      gap: 12px;
    }
    .setting {
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 14px;
      background: var(--panel);
    }
    .setting strong {
      display: block;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .toast {
      position: fixed;
      right: 20px;
      bottom: 20px;
      min-width: 220px;
      max-width: min(420px, calc(100vw - 40px));
      padding: 13px 16px;
      border-radius: 12px;
      color: #fff;
      background: linear-gradient(180deg, #1f1c14, #16140f);
      box-shadow: var(--shadow-lg);
      z-index: 40;
      font-size: 14px;
      border: 1px solid rgba(255, 255, 255, .08);
      animation: toastIn .3s var(--ease-out) both;
    }
    .toast::before {
      content: "";
      position: absolute;
      left: 0;
      top: 12px;
      bottom: 12px;
      width: 3px;
      border-radius: 0 3px 3px 0;
      background: var(--accent);
    }
    .toast.err { background: linear-gradient(180deg, #c23a2c, #a01f15); }
    .toast.err::before { background: #ffd9d2; }
    .form-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(160px, 1fr));
      gap: 10px;
    }
    @media (max-width: 920px) {
      .auth-wrap { grid-template-columns: 1fr; align-items: start; }
      .auth-copy { display: none; }
      .app-shell { grid-template-columns: 1fr; }
      .sidebar {
        position: sticky;
        top: 0;
        z-index: 10;
        border-right: 0;
        border-bottom: 1px solid var(--line);
      }
      .nav {
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }
      .nav button {
        justify-content: center;
        text-align: center;
      }
      .nav small { display: none; }
      .userbox { display: none; }
      .reader-layout { grid-template-columns: 1fr; }
      .chapter-list { max-height: 180px; }
      .search-bar { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .topbar { padding: 0 16px; }
      .brand span { display: none; }
      .content { padding: 16px; }
      .auth-wrap { padding: 28px 16px; }
      .auth-card { padding: 28px 22px; }
      .book-row, .result-row, .user-row {
        grid-template-columns: 58px 1fr;
      }
      .cover {
        width: 58px;
        height: 80px;
        font-size: 12px;
      }
      .actions {
        grid-column: 1 / -1;
        justify-content: flex-start;
      }
      .settings-grid, .form-row { grid-template-columns: 1fr; }
      /* 书架卡片在手机上同样放大,封面更醒目 */
      #bookshelfList .book-row {
        grid-template-columns: 88px 1fr;
        gap: 16px;
        padding: 14px;
      }
      #bookshelfList .cover {
        width: 88px;
        height: 126px;
      }
      #bookshelfList .book-title { font-size: 18px; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: .001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .001ms !important;
      }
    }

    /* ========================================================= */
    /* Mobile reading (fullscreen + tap-to-toggle chrome),        */
    /* bottom tab bar, and loading-popup polish.                  */
    /* Appended last so it wins the cascade.                      */
    /* ========================================================= */

    /* --- Loading popup: Ink & Paper polish --- */
    .loading-overlay {
      z-index: 55;
      background: rgba(20, 16, 10, .34);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      animation: fadeIn .2s var(--ease) both;
    }
    .loading-card {
      min-width: 150px;
      border-radius: 16px;
      background: linear-gradient(180deg, var(--panel), var(--panel-alt));
      border: 1px solid var(--line);
      box-shadow: var(--shadow-lg);
      padding: 22px 26px 18px;
      gap: 14px;
      animation: toastIn .32s var(--ease-out) both;
    }
    .loading-mark {
      width: 38px;
      height: 38px;
      border: 3px solid var(--accent-soft);
      border-top-color: var(--accent);
      border-right-color: var(--accent-2);
    }
    .loading-text {
      font-family: var(--font-display);
      color: var(--ink);
      letter-spacing: .04em;
      font-weight: 600;
    }

    @media (max-width: 920px) {
      /* --- Three tabs fixed at the BOTTOM on mobile --- */
      .sidebar {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: auto;
        z-index: 18;
        border: 0;
        border-top: 1px solid var(--line);
        border-radius: 18px 18px 0 0;
        padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
        background: rgba(255, 253, 247, .92);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        box-shadow: 0 -12px 34px rgba(28, 24, 16, .12);
      }
      .nav {
        display: flex;
        gap: 8px;
      }
      .nav button {
        flex: 1 1 0;
        min-width: 0;
        height: 46px;
        justify-content: center;
        text-align: center;
        border-radius: 999px;
        border-color: transparent;
        background: transparent;
        font-weight: 650;
      }
      .nav button.active {
        background: var(--black);
        color: #fff;
        border-color: var(--black);
      }
      .nav small { display: none; }
      .userbox { display: none; }
      .content {
        height: calc(100vh - 58px);
        padding: 16px 14px calc(86px + env(safe-area-inset-bottom));
      }
    }

    /* ========================================================= */
    /* Reading = true fullscreen + tap-center-to-toggle chrome.   */
    /* Applies on ALL widths (desktop + mobile).                  */
    /* ========================================================= */
    body.reader-mode .topbar { display: none; }
    body.reader-mode .app-shell {
      height: 100vh;
      height: 100dvh;
    }
    body.reader-mode .content {
      height: 100vh;
      height: 100dvh;
      padding: 0;
    }
    body.reader-mode .reader-panel {
      position: relative;
      grid-template-rows: 1fr;
    }
    /* readable cursor hint: the page is tappable to reveal controls */
    body.reader-mode .reader-content { cursor: pointer; }
    /* control bars float over the page; revealed on center tap */
    body.reader-mode .reader-top,
    body.reader-mode .reader-bottom {
      position: absolute;
      left: 0;
      right: 0;
      z-index: 8;
      background: rgba(255, 255, 255, .82);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 0;
      transition: transform .3s var(--ease-out), opacity .25s var(--ease);
      will-change: transform;
    }
    body.reader-mode .reader-top {
      top: 0;
      padding: calc(12px + env(safe-area-inset-top)) 16px 12px;
      border-bottom: 1px solid rgba(0, 0, 0, .06);
    }
    body.reader-mode .reader-bottom {
      bottom: 0;
      padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
      border-top: 1px solid rgba(0, 0, 0, .06);
    }
    /* desktop: align the floating controls with the centered text column */
    @media (min-width: 921px) {
      body.reader-mode .reader-top,
      body.reader-mode .reader-bottom {
        padding-left: max(20px, calc((100vw - 900px) / 2));
        padding-right: max(20px, calc((100vw - 900px) / 2));
      }
    }
    /* immersive default: bars slid off-screen until tapped */
    body.reader-mode.reader-chrome-hidden .reader-top {
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
    }
    body.reader-mode.reader-chrome-hidden .reader-bottom {
      transform: translateY(100%);
      opacity: 0;
      pointer-events: none;
    }
    /* night / eye: tint the floating bars to match the page */
    body.reader-mode .reader-panel.night .reader-top,
    body.reader-mode .reader-panel.night .reader-bottom {
      background: rgba(18, 22, 24, .82);
      border-color: rgba(255, 255, 255, .08);
    }
    body.reader-mode .reader-panel.eye .reader-top,
    body.reader-mode .reader-panel.eye .reader-bottom {
      background: rgba(231, 241, 224, .85);
      border-color: rgba(0, 0, 0, .06);
    }

    /* ========================================================= */
    /* 沉浸式书架(全屏封面 + 上下滑动)与抽屉收纳导航            */
    /* 追加在最后,凭源码顺序/ID 优先级覆盖旧栅格与底栏样式。      */
    /* ========================================================= */
    #appView { grid-template-columns: 1fr; }     /* 抽屉脱离文档流,内容区独占整行 */

    /* 浮动菜单按钮(登录后才出现,阅读时隐藏) */
    #menuBtn, #drawerScrim { display: none; }
    body.logged-in:not(.reader-mode) #menuBtn {
      display: flex;
      position: fixed;
      top: calc(14px + env(safe-area-inset-top));
      left: 14px;
      z-index: 50;
      width: 44px; height: 44px;
      align-items: center; justify-content: center;
      border-radius: 13px;
      font-size: 18px; line-height: 1;
      color: #fff;
      background: rgba(22, 18, 12, .42);
      border: 1px solid rgba(255, 255, 255, .22);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, .28);
      cursor: pointer;
      transition: transform .2s var(--ease), background .2s var(--ease);
    }
    body.logged-in:not(.reader-mode) #menuBtn:hover { transform: translateY(-1px); background: rgba(22, 18, 12, .6); }
    /* 书城/用户页:菜单按钮同样保持深色玻璃态,和深色 topbar 协调;给顶栏留位 */
    body.logged-in:not(.shelf-immersive):not(.reader-mode) .topbar { padding-left: 70px; }

    /* 书城/用户页:隐藏顶栏登录信息和退出按钮,只显示 logo */
    body.logged-in:not(.shelf-immersive):not(.reader-mode) .session { display: none; }

    /* 书架页:隐藏顶栏 + 占满整屏 */
    body.shelf-immersive .topbar { display: none; }
    body.shelf-immersive .app-shell { height: 100vh; height: 100dvh; }

    /* 抽屉(由原 sidebar 改造,用 ID 覆盖原左栏/底栏样式) */
    #drawer {
      position: fixed;
      top: 0; left: 0; bottom: 0; right: auto;
      width: min(82vw, 296px);
      z-index: 60;
      transform: translateX(-100%);
      transition: transform .34s var(--ease-out);
      border: 0;
      border-right: 1px solid var(--line);
      border-radius: 0 20px 20px 0;
      box-shadow: var(--shadow-lg);
      padding: calc(18px + env(safe-area-inset-top)) 16px calc(18px + env(safe-area-inset-bottom));
      gap: 16px;
    }
    body.drawer-open #drawer { transform: translateX(0); }
    #drawer .drawer-head { display: flex; align-items: center; justify-content: space-between; }
    #drawer .drawer-head strong { font-family: var(--font-display); font-size: 20px; letter-spacing: .02em; }
    #drawer .userbox { display: block; }
    #drawer .nav { display: flex; flex-direction: column; gap: 6px; }
    #drawer .nav button { width: 100%; height: 46px; justify-content: flex-start; text-align: left; border-radius: 12px; background: transparent; }
    #drawer .nav button.active { background: var(--black); color: #fff; }
    #drawer .nav small { display: inline; }
    #drawerLogoutBtn { margin-top: auto; width: 100%; }
    #drawerScrim {
      position: fixed; inset: 0; z-index: 55;
      background: rgba(8, 6, 4, .46);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      opacity: 0; pointer-events: none;
      transition: opacity .3s var(--ease);
    }
    body.drawer-open #drawerScrim { display: block; opacity: 1; pointer-events: auto; }

    /* 书架全屏滑动 deck */
    body.shelf-immersive #bookshelfView {
      position: fixed; inset: 0; z-index: 1;
      max-width: none; margin: 0; padding: 0;
      display: block; animation: none;
    }
    .shelf-deck {
      height: 100%;
      overflow-y: auto;
      scroll-snap-type: y mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      background: #0c0a08;
    }
    .shelf-deck::-webkit-scrollbar { display: none; }
    .shelf-slide {
      position: relative;
      height: 100%;
      scroll-snap-align: start;
      scroll-snap-stop: always;
      overflow: hidden;
      display: flex; align-items: center; justify-content: center;
    }
    .shelf-bg {
      position: absolute; inset: -10%;
      z-index: 0;
      background-size: cover; background-position: center;
      filter: blur(36px) brightness(.46) saturate(1.2);
      transform: scale(1.08);
    }
    .shelf-slide.is-text .shelf-bg { filter: brightness(.62) saturate(1); }
    .shelf-cover {
      position: relative; z-index: 1;
      aspect-ratio: 2 / 3;
      height: min(72vh, 132vw);
      max-width: 90vw;
      border-radius: 14px;
      overflow: hidden;
      background: var(--panel-alt);
      box-shadow: 0 34px 80px rgba(0, 0, 0, .55), 0 0 0 1px rgba(255, 255, 255, .1);
      animation: shelfPop .55s var(--ease-out) both;
    }
    .shelf-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .shelf-cover.is-text {
      display: flex; align-items: center; justify-content: center; text-align: center;
      padding: 8% 12%;
      color: #f7f1e6;
      font-family: var(--font-serif);
      font-size: clamp(20px, 5vw, 34px);
      font-weight: 650; line-height: 1.4;
      background: linear-gradient(150deg, #6b4f29, #3f2d16);
    }
    .shelf-cover.is-text.manual { background: linear-gradient(150deg, #2f3d44, #1c2429); }
    @keyframes shelfPop { from { opacity: 0; transform: scale(.96) translateY(10px); } to { opacity: 1; transform: none; } }

    /* 压暗渐变:底部 + 右侧,衬托右下角信息 */
    .shelf-slide::after {
      content: ""; position: absolute; inset: 0; z-index: 2; pointer-events: none;
      background:
        linear-gradient(to top, rgba(6, 4, 2, .78), rgba(6, 4, 2, .12) 32%, transparent 52%),
        linear-gradient(to left, rgba(6, 4, 2, .5), transparent 46%);
    }
    .shelf-info {
      position: absolute; z-index: 3;
      right: 0; bottom: 0;
      max-width: min(82%, 560px);
      padding: 0 22px calc(34px + env(safe-area-inset-bottom));
      text-align: right;
      color: #fff;
    }
    .shelf-title {
      font-family: var(--font-display);
      font-size: clamp(22px, 5.4vw, 34px);
      line-height: 1.2;
      text-shadow: 0 2px 18px rgba(0, 0, 0, .6);
      overflow-wrap: anywhere;
    }
    .shelf-meta {
      margin-top: 8px;
      font-size: 13px; line-height: 1.6;
      color: rgba(255, 255, 255, .82);
      text-shadow: 0 1px 10px rgba(0, 0, 0, .55);
    }
    .shelf-actions {
      margin-top: 14px;
      display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;
    }
    .shelf-actions button { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
    .shelf-actions .ghost-on-dark {
      background: rgba(255, 255, 255, .14);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, .28);
      min-width: 0;
      width: 38px;
      height: 38px;
      padding: 0;
      font-size: 18px;
      line-height: 1;
    }
    .shelf-actions .ghost-on-dark:hover { background: rgba(255, 255, 255, .24); }
    .shelf-icon-btn svg {
      width: 20px;
      height: 20px;
      display: block;
      margin: 0 auto;
    }
    .shelf-read {
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      color: #fff; border: 0;
      font-weight: 650;
      box-shadow: 0 8px 22px rgba(15, 118, 110, .4);
    }

    /* 位置圆点(左侧居中) */
    .shelf-dots {
      position: fixed; z-index: 4;
      left: 12px; top: 50%; transform: translateY(-50%);
      display: flex; flex-direction: column; gap: 8px;
      pointer-events: none;
    }
    body:not(.shelf-immersive) .shelf-dots { display: none; }
    .shelf-dots i {
      width: 6px; height: 6px; border-radius: 999px;
      background: rgba(255, 255, 255, .4);
      transition: height .25s var(--ease), background .25s var(--ease);
    }
    .shelf-dots i.active { background: #fff; height: 18px; }

    /* 空书架 */
    .shelf-empty {
      position: relative; z-index: 3;
      text-align: center; color: #f3ede1;
      padding: 0 28px; max-width: 420px;
    }
    .shelf-empty h2 { font-family: var(--font-display); font-size: 24px; margin-bottom: 10px; }
    .shelf-empty p { color: rgba(255, 255, 255, .78); line-height: 1.7; margin-bottom: 18px; }

    /* 手机端:清晰封面满铺到边,更贴近全屏沉浸 */
    @media (max-width: 920px) {
      .shelf-cover {
        position: absolute; inset: 0;
        height: auto; max-width: none;
        border-radius: 0;
        box-shadow: none;
        animation: fadeIn .4s var(--ease) both;
      }
      .shelf-cover.is-text { padding: 18% 14%; }
      .shelf-dots { left: 8px; }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="brand">
      <strong>Novel Server</strong>
      <span>随时随地，接着读</span>
    </div>
    <div class="session">
      <span id="sessionText">未登录</span>
      <button id="topLogoutBtn" class="hidden">退出</button>
    </div>
  </header>

  <section id="authView" class="auth-wrap">
    <div class="auth-card">
      <h1 id="authTitle">欢迎回来</h1>
      <p class="muted" id="authSubtitle">登录后继续阅读，书架和进度都会自动同步。</p>

      <div id="loginPanel">
        <label for="loginUsername">账号</label>
        <input id="loginUsername" autocomplete="username" placeholder="请输入账号" />
        <label for="loginPassword">密码</label>
        <input id="loginPassword" type="password" autocomplete="current-password" placeholder="请输入密码" />
        <div class="toolbar">
          <button id="loginBtn">登录</button>
        </div>
        <p class="auth-switch">
          <button class="linklike" data-auth-tab="register">注册账号</button>
          <span class="auth-sep">·</span>
          <button class="linklike" data-auth-tab="reset">忘记密码</button>
        </p>
      </div>

      <div id="registerPanel" class="hidden">
        <label for="registerUsername">账号</label>
        <input id="registerUsername" autocomplete="username" />
        <label for="registerPassword">密码</label>
        <input id="registerPassword" type="password" autocomplete="new-password" />
        <div class="form-row">
          <div>
            <label for="registerNickname">昵称</label>
            <input id="registerNickname" />
          </div>
          <div>
            <label for="registerEmail">邮箱</label>
            <input id="registerEmail" type="email" />
          </div>
        </div>
        <div class="toolbar">
          <button id="registerBtn">注册并开始阅读</button>
        </div>
        <p class="auth-switch">
          已有账号？<button class="linklike" data-auth-tab="login">返回登录</button>
        </p>
      </div>

      <div id="resetPanel" class="hidden">
        <label for="resetUsername">账号</label>
        <input id="resetUsername" />
        <label for="resetContact">绑定手机号或邮箱</label>
        <input id="resetContact" />
        <label for="resetPassword">新密码</label>
        <input id="resetPassword" type="password" />
        <div class="toolbar">
          <button id="resetBtn">重置密码</button>
        </div>
        <p class="auth-switch">
          想起来了？<button class="linklike" data-auth-tab="login">返回登录</button>
        </p>
      </div>
    </div>

    <div class="auth-copy">
      <h2>一个账号，带走你追的每一本书。</h2>
      <p>书架、书签和阅读进度自动云端同步，换台设备登录也能接着上次的章节继续读。夜间模式和护眼模式，长夜追书也不累眼。</p>
    </div>
  </section>

  <section id="appView" class="app-shell hidden">
    <button id="menuBtn" type="button" aria-label="菜单">☰</button>
    <div id="drawerScrim"></div>
    <aside class="sidebar" id="drawer">
      <div class="drawer-head">
        <strong>书架</strong>
        <button id="drawerCloseBtn" class="ghost" type="button" aria-label="关闭">✕</button>
      </div>
      <div class="userbox">
        <strong id="sideUsername">-</strong>
        <span id="sideRole">-</span>
      </div>
      <nav class="nav">
        <button class="active" data-view="bookshelf"><small>01</small>书架</button>
        <button data-view="bookstore"><small>02</small>书城</button>
        <button data-view="users"><small>03</small>用户管理</button>
      </nav>
      <button id="drawerLogoutBtn" class="secondary" type="button">退出登录</button>
    </aside>

    <main class="content">
      <div id="bookshelfView" class="view">
        <div id="bookshelfList" class="shelf-deck"></div>
        <div id="shelfDots" class="shelf-dots" aria-hidden="true"></div>
      </div>

      <div id="bookstoreView" class="view hidden">
        <div class="view-head">
          <div>
            <h1>书城</h1>
            <p>当前来源为 quanben.io，搜索结果可直接加入书架。</p>
          </div>
        </div>
        <div class="panel">
          <div class="search-bar">
            <input id="keywordInput" placeholder="输入小说名称" />
            <select id="sourceSelect">
              <option value="quanben">quanben.io</option>
            </select>
            <button id="searchBtn">搜索</button>
          </div>
        </div>
        <div id="searchResults" class="result-list"></div>
        <div id="searchPager" class="pager hidden"></div>
      </div>

      <div id="readerView" class="view hidden">
        <div class="view-head">
          <div>
            <h1 id="readerNovelTitle">阅读器</h1>
            <p id="readerNovelMeta">从书架选择一本书开始阅读。</p>
          </div>
          <div class="toolbar">
            <button id="backBookshelfBtn">返回书架</button>
          </div>
        </div>
        <div class="reader-layout">
          <article id="readerPanel" class="reader-panel">
            <div class="reader-top">
              <button id="readerTopBackBtn" class="reader-top-back" type="button">← 书架</button>
              <div class="reader-top-right">
                <span id="readerProgressText" class="muted">0%</span>
                <button id="openSettingsBtn" class="secondary">设置</button>
                <button id="openCatalogBtn" class="secondary">目录</button>
              </div>
            </div>
            <div id="readerContent" class="reader-content">
              <p class="muted">从书架点击“阅读”。</p>
            </div>
            <div class="reader-bottom">
              <div class="toolbar">
                <button id="prevChapterBtn" class="secondary">上一章</button>
                <button id="nextChapterBtn" class="secondary">下一章</button>
              </div>
              <span id="readerSaveText" class="muted">未保存</span>
            </div>
          </article>
          <div id="catalogOverlay" class="catalog-overlay hidden">
            <div class="catalog-drawer">
              <div class="catalog-head">
                <strong>目录</strong>
                <button id="catalogCloseBtn" class="ghost">关闭</button>
              </div>
              <div id="chapterList" class="chapter-list"></div>
            </div>
          </div>
          <div id="settingsOverlay" class="catalog-overlay hidden">
            <div class="catalog-drawer">
              <div class="catalog-head">
                <strong>阅读设置</strong>
                <button id="settingsCloseBtn" class="ghost">关闭</button>
              </div>
              <div class="drawer-body">
                <div class="setting">
                  <strong>字号</strong>
                  <select id="fontSizeSelect">
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                    <option value="20">20px</option>
                    <option value="22">22px</option>
                    <option value="24">24px</option>
                  </select>
                </div>
                <div class="setting">
                  <strong>夜间模式</strong>
                  <select id="nightSelect">
                    <option value="off">关闭</option>
                    <option value="on">开启</option>
                  </select>
                </div>
                <div class="setting">
                  <strong>护眼模式</strong>
                  <select id="eyeSelect">
                    <option value="off">关闭</option>
                    <option value="on">开启</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="usersView" class="view hidden">
        <div class="view-head">
          <div>
            <h1>用户管理</h1>
            <p>仅管理员可访问。支持查看、禁用和启用普通用户。</p>
          </div>
          <button id="refreshUsersBtn" class="secondary">刷新</button>
        </div>
        <div id="userList" class="user-list"></div>
      </div>
    </main>
  </section>

  <input type="file" id="coverFileInput" accept="image/*" class="hidden" />
  <div id="toast" class="toast hidden"></div>
  <div id="loadingOverlay" class="loading-overlay hidden" role="status" aria-live="polite" aria-label="处理中">
    <div class="loading-card">
      <div class="loading-mark"></div>
      <div id="loadingText" class="loading-text">处理中...</div>
    </div>
  </div>
  <div id="disabledModal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="disabledTitle">
    <div class="message-modal">
      <h2 id="disabledTitle">账号已禁用</h2>
      <p>本用户已被禁用或删除</p>
      <button id="disabledConfirmBtn" type="button">确定</button>
    </div>
  </div>

  <script>
    const state = {
      token: localStorage.getItem('novel_token') || '',
      user: null,
      books: [],
      bookshelfPage: 1,
      bookshelfPageSize: 8,
      searchRows: [],
      searchPage: 1,
      searchPageSize: 8,
      currentBook: null,
      chapters: [],
      currentChapter: null,
      currentNum: null,
      prevNum: null,
      nextNum: null,
      catalogRendered: 0,
      pendingCoverId: null,
      shelfObserver: null,
      preferences: { readerTheme: { fontSize: 18, night: false, eye: false } },
      saveTimer: null,
      sessionTimer: null,
      heartbeatTimer: null,
      loadingDepth: 0,
      loadingShownAt: 0,
      loadingFallbackTimer: null,
      loadingHideTimer: null,
      disabledModalShown: false
    };
    const el = (id) => document.getElementById(id);
    const escapeHtml = (value) => String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    function toast(message, error) {
      const node = el('toast');
      node.textContent = message;
      node.className = 'toast' + (error ? ' err' : '');
      clearTimeout(node._timer);
      node._timer = setTimeout(() => node.classList.add('hidden'), 2600);
    }
    function showLoading(message) {
      clearTimeout(state.loadingHideTimer);
      el('loadingText').textContent = message || '处理中...';
      state.loadingShownAt = Date.now();
      el('loadingOverlay').classList.remove('hidden');
    }
    function hideLoading(force) {
      if (!force && state.loadingDepth > 0) return;
      clearTimeout(state.loadingFallbackTimer);
      clearTimeout(state.loadingHideTimer);
      const wait = Math.max(0, 220 - (Date.now() - state.loadingShownAt));
      state.loadingHideTimer = setTimeout(() => {
        if (state.loadingDepth === 0) {
          el('loadingOverlay').classList.add('hidden');
        }
      }, wait);
    }
    function beginLoading(message) {
      state.loadingDepth += 1;
      showLoading(message);
    }
    function endLoading() {
      state.loadingDepth = Math.max(0, state.loadingDepth - 1);
      if (state.loadingDepth === 0) hideLoading(false);
    }
    function pulseLoading(message) {
      if (state.loadingDepth > 0) return;
      showLoading(message);
      clearTimeout(state.loadingFallbackTimer);
      state.loadingFallbackTimer = setTimeout(() => hideLoading(true), 520);
    }
    const fmtTime = (value) => {
      if (value == null || value === '') return '';
      const d = new Date(value);
      if (isNaN(d.getTime())) return String(value);
      const p = (n) => String(n).padStart(2, '0');
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' +
        p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
    };
    function normalizePage(totalItems, currentPage, pageSize) {
      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
      return Math.min(Math.max(1, currentPage), totalPages);
    }
    function renderPager(containerId, totalItems, currentPage, pageSize, onPageChange) {
      const pager = el(containerId);
      const totalPages = Math.ceil(totalItems / pageSize);
      if (totalPages <= 1) {
        pager.innerHTML = '';
        pager.classList.add('hidden');
        return;
      }

      const page = normalizePage(totalItems, currentPage, pageSize);
      const start = Math.max(1, page - 2);
      const end = Math.min(totalPages, start + 4);
      const first = Math.max(1, end - 4);
      const pageButtons = [];
      for (let n = first; n <= end; n += 1) {
        pageButtons.push('<button class="' + (n === page ? 'active' : 'secondary') + '" data-page="' + n + '">' + n + '</button>');
      }

      pager.classList.remove('hidden');
      pager.innerHTML =
        '<button class="secondary" data-page="' + (page - 1) + '"' + (page <= 1 ? ' disabled' : '') + '>上一页</button>' +
        pageButtons.join('') +
        '<button class="secondary" data-page="' + (page + 1) + '"' + (page >= totalPages ? ' disabled' : '') + '>下一页</button>' +
        '<span class="pager-info">共 ' + totalItems + ' 条</span>';
      pager.querySelectorAll('[data-page]').forEach((btn) => {
        btn.onclick = () => onPageChange(Number(btn.dataset.page));
      });
    }
    async function api(path, options) {
      const opts = options || {};
      const silentLoading = !!opts.silentLoading || !!opts.keepalive;
      const fetchOpts = Object.assign({}, opts);
      delete fetchOpts.silentLoading;
      const isForm = (typeof FormData !== 'undefined') && opts.body instanceof FormData;
      const headers = Object.assign({}, isForm ? {} : { 'Content-Type': 'application/json' }, opts.headers || {});
      if (state.token) headers.Authorization = 'Bearer ' + state.token;
      if (!silentLoading) beginLoading('处理中...');
      try {
        const res = await fetch('/api' + path, Object.assign({}, fetchOpts, { headers }));
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (!res.ok) {
          const message = Array.isArray(data && data.message) ? data.message.join('；') : ((data && data.message) || (data && data.error) || '请求失败');
          if (res.status === 401 && state.token) {
            showDisabledModal();
          }
          throw new Error(message);
        }
        return data;
      } finally {
        if (!silentLoading) endLoading();
      }
    }
    function startSessionWatch() {
      stopSessionWatch();
      if (!state.token) return;
      sendHeartbeat();
      state.sessionTimer = setInterval(checkAccountStatus, 7000);
      state.heartbeatTimer = setInterval(sendHeartbeat, 30000);
    }
    function stopSessionWatch() {
      if (state.sessionTimer) clearInterval(state.sessionTimer);
      if (state.heartbeatTimer) clearInterval(state.heartbeatTimer);
      state.sessionTimer = null;
      state.heartbeatTimer = null;
    }
    async function sendHeartbeat() {
      if (!state.token || !state.user || state.disabledModalShown) return;
      try {
        await api('/auth/heartbeat', { method: 'POST', silentLoading: true });
      } catch {}
    }
    async function checkAccountStatus() {
      if (!state.token || !state.user || state.disabledModalShown) return;
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: 'Bearer ' + state.token },
          cache: 'no-store'
        });
        if (!res.ok) {
          if (res.status === 401) showDisabledModal();
          return;
        }
        const user = await res.json();
        if (!user || user.status === 'disabled') {
          showDisabledModal();
          return;
        }
        state.user = user;
        showApp(true);
      } catch {}
    }
    function showDisabledModal() {
      if (!state.token || state.disabledModalShown) return;
      state.disabledModalShown = true;
      stopSessionWatch();
      el('disabledModal').classList.remove('hidden');
    }
    async function confirmDisabledLogout() {
      el('disabledModal').classList.add('hidden');
      state.disabledModalShown = false;
      await logout(true);
    }
    async function returnToBookshelfFromReader() {
      await saveProgress(false, false, true);
      showView('bookshelf');
    }
    function setAuthTab(name) {
      const titles = { login: '欢迎回来', register: '注册账号', reset: '找回密码' };
      const subtitles = {
        login: '登录后继续阅读，书架和进度都会自动同步。',
        register: '注册一个账号，马上开始追书。',
        reset: '用绑定的手机号或邮箱重置密码。'
      };
      el('authTitle').textContent = titles[name] || titles.login;
      el('authSubtitle').textContent = subtitles[name] || subtitles.login;
      document.querySelectorAll('[data-auth-tab]').forEach((btn) => btn.classList.toggle('active', btn.dataset.authTab === name));
      el('loginPanel').classList.toggle('hidden', name !== 'login');
      el('registerPanel').classList.toggle('hidden', name !== 'register');
      el('resetPanel').classList.toggle('hidden', name !== 'reset');
    }
    function showApp(isLoggedIn) {
      el('authView').classList.toggle('hidden', isLoggedIn);
      el('appView').classList.toggle('hidden', !isLoggedIn);
      el('topLogoutBtn').classList.toggle('hidden', !isLoggedIn);
      document.body.classList.toggle('logged-in', isLoggedIn);
      if (!isLoggedIn) {
        stopSessionWatch();
        document.body.classList.remove('reader-mode');
        document.body.classList.remove('shelf-immersive');
        closeDrawer();
      }
      if (state.user) {
        const roleText = state.user.role === 'admin' ? '管理员' : '普通用户';
        el('sessionText').textContent = state.user.username + ' / ' + roleText;
        el('sideUsername').textContent = state.user.nickname || state.user.username;
        el('sideRole').textContent = roleText + ' · ' + state.user.status;
        document.querySelector('[data-view="users"]').classList.toggle('hidden', state.user.role !== 'admin');
      } else {
        el('sessionText').textContent = '未登录';
      }
    }
    function showView(name) {
      if (name !== 'reader') saveProgress(false);
      document.body.classList.toggle('reader-mode', name === 'reader');
      document.body.classList.toggle('reader-chrome-hidden', name === 'reader');
      document.body.classList.toggle('shelf-immersive', name === 'bookshelf');
      closeDrawer();
      document.querySelectorAll('[data-view]').forEach((btn) => btn.classList.toggle('active', btn.dataset.view === name));
      ['bookshelf', 'bookstore', 'reader', 'users'].forEach((view) => {
        el(view + 'View').classList.toggle('hidden', view !== name);
      });
      if (name === 'bookshelf') loadBookshelf();
      if (name === 'users') loadUsers();
    }
    function openDrawer() { document.body.classList.add('drawer-open'); }
    function closeDrawer() { document.body.classList.remove('drawer-open'); }
    async function login() {
      try {
        const data = await api('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            username: el('loginUsername').value.trim(),
            password: el('loginPassword').value
          })
        });
        state.token = data.token;
        state.user = data.user;
        state.disabledModalShown = false;
        localStorage.setItem('novel_token', state.token);
        showApp(true);
        startSessionWatch();
        await loadPreferences();
        await loadBookshelf();
        showView('bookshelf');
      } catch (error) {
        toast(error.message, true);
      }
    }
    async function registerUser() {
      try {
        const payload = {
          username: el('registerUsername').value.trim(),
          password: el('registerPassword').value,
          nickname: el('registerNickname').value.trim() || undefined,
          email: el('registerEmail').value.trim() || undefined
        };
        const data = await api('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
        state.token = data.token;
        state.user = data.user;
        state.disabledModalShown = false;
        localStorage.setItem('novel_token', state.token);
        showApp(true);
        startSessionWatch();
        await loadPreferences();
        await loadBookshelf();
        toast('注册成功');
      } catch (error) {
        toast(error.message, true);
      }
    }
    async function resetPassword() {
      try {
        await api('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({
            username: el('resetUsername').value.trim(),
            contact: el('resetContact').value.trim(),
            newPassword: el('resetPassword').value
          })
        });
        setAuthTab('login');
        toast('密码已重置，请重新登录');
      } catch (error) {
        toast(error.message, true);
      }
    }
    async function logout(localOnly) {
      try {
        if (!localOnly && state.token) await api('/auth/logout', { method: 'POST' });
      } catch {}
      stopSessionWatch();
      state.token = '';
      state.user = null;
      state.books = [];
      state.bookshelfPage = 1;
      state.currentBook = null;
      state.searchRows = [];
      state.searchPage = 1;
      state.chapters = [];
      state.currentChapter = null;
      state.disabledModalShown = false;
      el('disabledModal').classList.add('hidden');
      localStorage.removeItem('novel_token');
      showApp(false);
    }
    async function loadMe() {
      if (!state.token) {
        showApp(false);
        return;
      }
      try {
        state.user = await api('/auth/me');
        showApp(true);
        showView('bookshelf');
        startSessionWatch();
        await loadPreferences();
        await loadBookshelf();
      } catch {
        if (!state.disabledModalShown) await logout(true);
      }
    }
    async function loadPreferences() {
      try {
        state.preferences = await api('/preferences');
        const reader = state.preferences.readerTheme || {};
        el('fontSizeSelect').value = String(reader.fontSize || 18);
        el('nightSelect').value = reader.night ? 'on' : 'off';
        el('eyeSelect').value = reader.eye ? 'on' : 'off';
        applyReaderTheme();
      } catch {}
    }
    function applyReaderTheme() {
      const fontSize = Number(el('fontSizeSelect').value || 18);
      const night = el('nightSelect').value === 'on';
      const eye = el('eyeSelect').value === 'on';
      const panel = el('readerPanel');
      panel.style.setProperty('--reader-size', fontSize + 'px');
      panel.classList.toggle('night', night);
      panel.classList.toggle('eye', eye && !night);
      state.preferences.readerTheme = { fontSize, night, eye };
    }
    async function persistPreferences() {
      try {
        await api('/preferences', {
          method: 'PUT',
          body: JSON.stringify({ readerTheme: state.preferences.readerTheme })
        });
      } catch {}
    }
    function onReaderSettingChange() {
      applyReaderTheme();
      persistPreferences();
    }
    function openSettings() { el('settingsOverlay').classList.remove('hidden'); }
    function closeSettings() { el('settingsOverlay').classList.add('hidden'); }
    async function uploadCover() {
      const input = el('coverFileInput');
      const file = input.files && input.files[0];
      if (!file || state.pendingCoverId == null) return;
      try {
        const fd = new FormData();
        fd.append('file', file);
        await api('/bookshelf/' + state.pendingCoverId + '/cover', { method: 'POST', body: fd });
        await loadBookshelf();
        toast('封面已更新');
      } catch (error) {
        toast(error.message, true);
      } finally {
        state.pendingCoverId = null;
        input.value = '';
      }
    }
    async function loadBookshelf() {
      try {
        state.books = await api('/bookshelf');
        renderBookshelf();
      } catch (error) {
        el('bookshelfList').innerHTML = '<section class="shelf-slide is-text"><div class="shelf-bg"></div><div class="shelf-empty"><p>' + escapeHtml(error.message) + '</p></div></section>';
        el('shelfDots').innerHTML = '';
      }
    }
    function renderBookshelf() {
      const deck = el('bookshelfList');
      if (state.shelfObserver) { state.shelfObserver.disconnect(); state.shelfObserver = null; }
      if (!state.books.length) {
        deck.innerHTML =
          '<section class="shelf-slide is-text">' +
            '<div class="shelf-bg"></div>' +
            '<div class="shelf-empty">' +
              '<h2>书架还是空的</h2>' +
              '<p>去书城搜一本喜欢的小说，加入书架，就能在这里沉浸式上下翻阅。</p>' +
              '<button class="shelf-read" data-go-store>去书城逛逛</button>' +
            '</div>' +
          '</section>';
        el('shelfDots').innerHTML = '';
        const goBtn = deck.querySelector('[data-go-store]');
        if (goBtn) goBtn.onclick = () => showView('bookstore');
        return;
      }
      deck.innerHTML = state.books.map((book, index) => {
        const novel = book.novel;
        const hasImage = !!book.customCoverUrl;
        const isManual = novel.sourceCode !== 'quanben';
        const title = escapeHtml(book.customTitle || novel.title);
        let bgStyle = '';
        let cover;
        if (hasImage) {
          const url = encodeURI(book.customCoverUrl);
          bgStyle = ' style="background-image:url(&quot;' + url + '&quot;)"';
          cover = '<div class="shelf-cover"><img src="' + escapeHtml(book.customCoverUrl) + '" alt="' + escapeHtml(novel.title) + '" /></div>';
        } else {
          cover = '<div class="shelf-cover is-text ' + (isManual ? 'manual' : 'quanben') + '">' + escapeHtml(novel.title) + '</div>';
        }
        return '<section class="shelf-slide' + (hasImage ? '' : ' is-text') + '">' +
          '<div class="shelf-bg"' + bgStyle + '></div>' +
          cover +
          '<div class="shelf-info">' +
            '<div class="shelf-title">' + title + '</div>' +
            '<div class="shelf-meta">作者：' + escapeHtml(novel.author) + ' · 来源：' + escapeHtml(novel.sourceCode) + '<br>加入时间：' + escapeHtml(fmtTime(book.addedAt)) + '</div>' +
            '<div class="shelf-actions">' +
              '<button class="shelf-read" data-read="' + index + '">阅读</button>' +
              '<button class="ghost-on-dark shelf-icon-btn" data-cover="' + book.id + '" title="换封面" aria-label="换封面"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></button>' +
              '<button class="ghost-on-dark shelf-icon-btn" data-delete="' + book.id + '" title="删除" aria-label="删除"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>' +
            '</div>' +
          '</div>' +
        '</section>';
      }).join('');
      el('shelfDots').innerHTML = state.books.map((_, i) => '<i' + (i === 0 ? ' class="active"' : '') + '></i>').join('');
      deck.querySelectorAll('[data-read]').forEach((btn) => btn.onclick = () => openReader(state.books[Number(btn.dataset.read)]));
      deck.querySelectorAll('[data-cover]').forEach((btn) => btn.onclick = () => {
        state.pendingCoverId = Number(btn.dataset.cover);
        el('coverFileInput').value = '';
        el('coverFileInput').click();
      });
      deck.querySelectorAll('[data-delete]').forEach((btn) => btn.onclick = () => deleteBook(Number(btn.dataset.delete)));
      const slides = Array.from(deck.querySelectorAll('.shelf-slide'));
      const dots = Array.from(el('shelfDots').children);
      state.shelfObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = slides.indexOf(e.target);
            dots.forEach((d, i) => d.classList.toggle('active', i === idx));
          }
        });
      }, { root: deck, threshold: 0.6 });
      slides.forEach((s) => state.shelfObserver.observe(s));
    }
    function shelfStep(dir) {
      const deck = el('bookshelfList');
      const slides = Array.from(deck.querySelectorAll('.shelf-slide'));
      if (slides.length < 2) return;
      const h = deck.clientHeight || 1;
      const cur = Math.round(deck.scrollTop / h);
      const target = Math.min(slides.length - 1, Math.max(0, cur + dir));
      slides[target].scrollIntoView({ behavior: 'smooth' });
    }
    async function deleteBook(id) {
      if (!confirm('确认从书架删除这本书？')) return;
      try {
        await api('/bookshelf/' + id, { method: 'DELETE' });
        await loadBookshelf();
        toast('已删除');
      } catch (error) {
        toast(error.message, true);
      }
    }
    async function searchBooks() {
      try {
        const keyword = el('keywordInput').value.trim();
        if (!keyword) {
          toast('请输入小说名称', true);
          return;
        }
        state.searchRows = await api('/novels/search?keyword=' + encodeURIComponent(keyword) + '&source=' + encodeURIComponent(el('sourceSelect').value));
        state.searchPage = 1;
        renderSearchResults();
      } catch (error) {
        el('searchResults').innerHTML = '<div class="empty">' + escapeHtml(error.message) + '</div>';
        el('searchPager').classList.add('hidden');
      }
    }
    function renderSearchResults() {
      if (!state.searchRows.length) {
        el('searchResults').innerHTML = '<div class="empty">没有搜索结果。</div>';
        el('searchPager').classList.add('hidden');
        return;
      }
      state.searchPage = normalizePage(state.searchRows.length, state.searchPage, state.searchPageSize);
      const start = (state.searchPage - 1) * state.searchPageSize;
      const pageRows = state.searchRows.slice(start, start + state.searchPageSize);
      el('searchResults').innerHTML = pageRows.map((row, index) => {
        const rowIndex = start + index;
        return (
        '<div class="result-row">' +
        '<div class="cover quanben">' + escapeHtml(row.title) + '</div>' +
        '<div class="book-main">' +
        '<div class="book-title">' + escapeHtml(row.title) + '</div>' +
        '<div class="book-meta">作者：' + escapeHtml(row.author) + '<br>' + escapeHtml(row.description || '') + '</div>' +
        '</div>' +
        '<div class="actions"><button data-add-result="' + rowIndex + '">加入书架</button></div>' +
        '</div>'
        );
      }).join('');
      document.querySelectorAll('[data-add-result]').forEach((btn) => btn.onclick = () => addSearchResult(Number(btn.dataset.addResult)));
      renderPager('searchPager', state.searchRows.length, state.searchPage, state.searchPageSize, (page) => {
        state.searchPage = page;
        renderSearchResults();
      });
    }
    async function addSearchResult(index) {
      try {
        await api('/bookshelf', { method: 'POST', body: JSON.stringify(state.searchRows[index]) });
        await loadBookshelf(true);
        showView('bookshelf');
        toast('已成功加入书架');
      } catch (error) {
        toast(error.message, true);
      }
    }
    async function openReader(book) {
      try {
        state.currentBook = book;
        state.chapters = await api('/novels/' + book.novelId + '/chapters');
        const progress = await api('/reading-progress/' + book.novelId);
        closeCatalog();
        closeSettings();
        showView('reader');
        const isQuanben = book.novel && book.novel.sourceCode === 'quanben';
        if (progress && progress.chapterOrder != null && isQuanben) {
          // 按章节序号恢复：即使目录被刷新、章节 id 变了，也能回到上次的位置
          await loadChapterByNum(progress.chapterOrder, progress);
        } else if (progress && progress.chapterId) {
          await loadChapterById(progress.chapterId, progress);
        } else if (state.chapters.length) {
          await loadChapterById(state.chapters[0].id);
        } else {
          el('readerContent').innerHTML = '<p class="muted">这本书暂时没有可读章节。</p>';
        }
      } catch (error) {
        toast(error.message, true);
      }
    }
    function openCatalog() {
      el('catalogOverlay').classList.remove('hidden');
      renderChapterList();
    }
    function closeCatalog() {
      el('catalogOverlay').classList.add('hidden');
    }
    function renderChapterList() {
      const list = el('chapterList');
      if (!state.chapters.length) {
        list.innerHTML = '<div class="empty">暂无目录</div>';
        return;
      }
      list.innerHTML = '';
      state.catalogRendered = 0;
      appendCatalogChunk();
    }
    function appendCatalogChunk() {
      const list = el('chapterList');
      const CHUNK = 80;
      const start = state.catalogRendered;
      const end = Math.min(start + CHUNK, state.chapters.length);
      if (end <= start) return;
      const html = state.chapters.slice(start, end).map((chapter, i) => {
        const idx = start + i;
        const raw = chapter.title || '';
        // 去掉源站每卷会重复的“第N章/节/回”前缀，改用全局连续序号，避免目录序号看起来循环
        const name = raw.replace(/^\\s*第\\s*[0-9零一二三四五六七八九十百千两]+\\s*[章节回卷]\\s*/, '').trim();
        const label = (idx + 1) + '. ' + (name || raw);
        return '<button data-chapter="' + idx + '">' + escapeHtml(label) + '</button>';
      }).join('');
      list.insertAdjacentHTML('beforeend', html);
      state.catalogRendered = end;
      list.querySelectorAll('[data-chapter]').forEach((btn) => {
        if (btn._bound) return;
        btn._bound = true;
        btn.onclick = () => { loadChapterById(state.chapters[Number(btn.dataset.chapter)].id); closeCatalog(); };
      });
      highlightActiveChapter();
    }
    function onCatalogScroll() {
      const list = el('chapterList');
      if (list.scrollTop + list.clientHeight >= list.scrollHeight - 40 && state.catalogRendered < state.chapters.length) {
        appendCatalogChunk();
      }
    }
    function highlightActiveChapter() {
      const id = state.currentChapter && state.currentChapter.id;
      document.querySelectorAll('#chapterList [data-chapter]').forEach((btn) => {
        const chapter = state.chapters[Number(btn.dataset.chapter)];
        btn.classList.toggle('active', !!chapter && chapter.id === id);
      });
    }
    async function loadChapterById(chapterId, progress) {
      try {
        const data = await api('/chapters/' + chapterId);
        renderChapterData(data, progress);
      } catch (error) {
        toast(error.message, true);
      }
    }
    async function loadChapterByNum(num, progress) {
      if (!state.currentBook || num == null) return;
      try {
        const data = await api('/novels/' + state.currentBook.novelId + '/chapter/' + num);
        renderChapterData(data, progress);
      } catch (error) {
        toast(error.message, true);
      }
    }
    function renderChapterData(data, progress) {
      if (!data) return;
      state.currentChapter = data;
      state.currentNum = data.chapterOrder;
      state.prevNum = data.prevNum == null ? null : data.prevNum;
      state.nextNum = data.nextNum == null ? null : data.nextNum;
      el('readerNovelTitle').textContent = state.currentBook.novel.title;
      el('readerNovelMeta').textContent = '作者：' + state.currentBook.novel.author + ' · 来源：' + state.currentBook.novel.sourceCode;
      const content = data.content || '本章正文暂时无法获取，请稍后重试。';
      const paragraphs = content.split(/\\n+/).filter(Boolean);
      el('readerContent').innerHTML = '<h2>' + escapeHtml(data.title) + '</h2>' + paragraphs.map((p) => '<p>' + escapeHtml(p) + '</p>').join('');
      highlightActiveChapter();
      const reader = el('readerContent');
      reader.scrollTop = 0;
      if (progress && progress.scrollPosition) {
        setTimeout(() => { reader.scrollTop = progress.scrollPosition; updateReaderProgressText(); }, 30);
      }
      updateReaderProgressText();
      updateChapterButtons();
      saveProgress(false);
    }
    function updateChapterButtons() {
      el('prevChapterBtn').disabled = state.prevNum == null;
      el('nextChapterBtn').disabled = state.nextNum == null;
    }
    function updateReaderProgressText() {
      const reader = el('readerContent');
      const maxScroll = Math.max(1, reader.scrollHeight - reader.clientHeight);
      const percent = Math.max(0, Math.min(100, (reader.scrollTop / maxScroll) * 100));
      el('readerProgressText').textContent = percent.toFixed(1) + '%';
      return percent;
    }
    async function saveProgress(showMessage, keepalive, showLoading) {
      if (!state.currentBook || !state.currentChapter) return;
      try {
        const reader = el('readerContent');
        const percent = updateReaderProgressText();
        await api('/reading-progress/' + state.currentBook.novelId, {
          method: 'PUT',
          keepalive: !!keepalive,
          silentLoading: !showLoading && !showMessage,
          body: JSON.stringify({
            chapterId: state.currentChapter.id,
            chapterOrder: state.currentChapter.chapterOrder,
            scrollPosition: Math.round(reader.scrollTop),
            paragraphIndex: 0,
            progressPercent: Number(percent.toFixed(2))
          })
        });
        el('readerSaveText').textContent = '已保存 ' + fmtTime(Date.now());
        if (showMessage) toast('阅读进度已保存');
      } catch (error) {
        if (showMessage) toast(error.message, true);
      }
    }
    function goSiblingChapter(delta) {
      const num = delta < 0 ? state.prevNum : state.nextNum;
      if (num != null) loadChapterByNum(num);
    }
    async function loadUsers() {
      try {
        const rows = await api('/admin/users');
        if (!rows.length) {
          el('userList').innerHTML = '<div class="empty">暂无用户</div>';
          return;
        }
        el('userList').innerHTML = rows.map((row) => {
          const onlineText = row.isOnline ? '在线' : '离线';
          const onlineClass = row.isOnline ? 'online' : 'offline';
          const onlineStatus = '<span class="user-status ' + onlineClass + '">' + onlineText + '</span>';
          const actions = row.role === 'admin'
            ? '<span class="muted">管理员</span>'
            : '<button class="secondary" data-toggle-user="' + row.id + '" data-status="' + row.status + '">' + (row.status === 'enabled' ? '禁用' : '启用') + '</button>' +
              '<button class="secondary" data-reset-user="' + row.id + '" data-username="' + escapeHtml(row.username) + '">重置密码</button>' +
              '<button class="danger" data-delete-user="' + row.id + '" data-username="' + escapeHtml(row.username) + '">删除</button>';
          return '<div class="user-row" style="grid-template-columns:1fr auto">' +
            '<div class="book-main">' +
            '<div class="book-title">' + escapeHtml(row.username) + '</div>' +
            '<div class="book-meta">昵称：' + escapeHtml(row.nickname || '-') + ' · 角色：' + escapeHtml(row.role === 'admin' ? '管理员' : '普通用户') + ' · 账号：' + escapeHtml(row.status) + ' · ' + onlineStatus + '<br>上次在线：' + escapeHtml(row.lastOnlineAt ? fmtTime(row.lastOnlineAt) : '-') + '</div>' +
            '</div>' +
            '<div class="actions">' + actions + '</div>' +
            '</div>';
        }).join('');
        document.querySelectorAll('[data-toggle-user]').forEach((btn) => btn.onclick = () => toggleUser(Number(btn.dataset.toggleUser), btn.dataset.status));
        document.querySelectorAll('[data-reset-user]').forEach((btn) => btn.onclick = () => resetUserPassword(Number(btn.dataset.resetUser), btn.dataset.username || '该用户'));
        document.querySelectorAll('[data-delete-user]').forEach((btn) => btn.onclick = () => deleteUser(Number(btn.dataset.deleteUser), btn.dataset.username || '该用户'));
      } catch (error) {
        el('userList').innerHTML = '<div class="empty">' + escapeHtml(error.message) + '</div>';
      }
    }
    async function toggleUser(id, status) {
      try {
        await api('/admin/users/' + id + '/' + (status === 'enabled' ? 'disable' : 'enable'), { method: 'PATCH' });
        await loadUsers();
        toast('用户状态已更新');
      } catch (error) {
        toast(error.message, true);
      }
    }
    async function resetUserPassword(id, username) {
      if (!confirm('确认将用户“' + username + '”的密码重置为初始密码 guest2026？该用户会被强制登出。')) return;
      try {
        await api('/admin/users/' + id + '/reset-password', { method: 'PATCH' });
        toast('密码已重置为初始密码 guest2026');
      } catch (error) {
        toast(error.message, true);
      }
    }
    async function deleteUser(id, username) {
      if (!confirm('确认删除用户“' + username + '”？该用户会被强制登出。')) return;
      try {
        await api('/admin/users/' + id, { method: 'DELETE' });
        await loadUsers();
        toast('用户已删除');
      } catch (error) {
        toast(error.message, true);
      }
    }
    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target.closest('button') : null;
      if (!target || target.disabled || target.closest('#loadingOverlay')) return;
      pulseLoading('处理中...');
    }, true);
    document.querySelectorAll('[data-auth-tab]').forEach((btn) => btn.onclick = () => setAuthTab(btn.dataset.authTab));
    document.querySelectorAll('[data-view]').forEach((btn) => btn.onclick = () => showView(btn.dataset.view));
    el('loginBtn').onclick = login;
    el('registerBtn').onclick = registerUser;
    el('resetBtn').onclick = resetPassword;
    el('topLogoutBtn').onclick = logout;
    el('menuBtn').onclick = openDrawer;
    el('drawerCloseBtn').onclick = closeDrawer;
    el('drawerScrim').onclick = closeDrawer;
    el('drawerLogoutBtn').onclick = () => { closeDrawer(); logout(); };
    document.addEventListener('keydown', (event) => {
      if (!document.body.classList.contains('shelf-immersive')) return;
      if (document.body.classList.contains('drawer-open')) return;
      if (event.key === 'ArrowDown' || event.key === 'PageDown') { event.preventDefault(); shelfStep(1); }
      else if (event.key === 'ArrowUp' || event.key === 'PageUp') { event.preventDefault(); shelfStep(-1); }
    });
    el('searchBtn').onclick = searchBooks;
    el('keywordInput').addEventListener('keydown', (event) => { if (event.key === 'Enter') searchBooks(); });
    el('backBookshelfBtn').onclick = returnToBookshelfFromReader;
    el('readerTopBackBtn').onclick = returnToBookshelfFromReader;
    el('disabledConfirmBtn').onclick = confirmDisabledLogout;
    el('refreshUsersBtn').onclick = loadUsers;
    el('prevChapterBtn').onclick = () => goSiblingChapter(-1);
    el('nextChapterBtn').onclick = () => goSiblingChapter(1);
    el('openCatalogBtn').onclick = openCatalog;
    el('catalogCloseBtn').onclick = closeCatalog;
    el('catalogOverlay').onclick = (event) => { if (event.target === el('catalogOverlay')) closeCatalog(); };
    el('chapterList').addEventListener('scroll', onCatalogScroll);
    el('openSettingsBtn').onclick = openSettings;
    el('settingsCloseBtn').onclick = closeSettings;
    el('settingsOverlay').onclick = (event) => { if (event.target === el('settingsOverlay')) closeSettings(); };
    el('fontSizeSelect').onchange = onReaderSettingChange;
    el('nightSelect').onchange = onReaderSettingChange;
    el('eyeSelect').onchange = onReaderSettingChange;
    el('coverFileInput').addEventListener('change', uploadCover);
    el('readerContent').addEventListener('scroll', () => {
      updateReaderProgressText();
      clearTimeout(state.saveTimer);
      state.saveTimer = setTimeout(() => saveProgress(false), 1200);
    });
    el('readerContent').addEventListener('click', () => {
      if (!document.body.classList.contains('reader-mode')) return;
      if (window.getSelection && String(window.getSelection())) return;
      document.body.classList.toggle('reader-chrome-hidden');
    });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveProgress(false, true); });
    window.addEventListener('pagehide', () => saveProgress(false, true));
    loadMe();
  </script>
</body>
</html>`;
  }
}
