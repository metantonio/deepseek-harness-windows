# DeepSeek Harness

[English](README.md) | 中文

DeepSeek Harness（`dsh`）是由 [DeepSeek AI](https://deepseek.com) 开发的开源 agent harness（智能体框架）。

它构建于**一切皆插件**的架构之上，由 [Cordis](https://github.com/cordiverse/cordis) 驱动，其设计参见论文 [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512)。

文档：[https://deepseek-harness.github.io/deepseek-harness/](https://deepseek-harness.github.io/deepseek-harness/)

## 开发者预览

DeepSeek Harness 处于 _开发者预览_ 阶段，正在快速迭代。**未来将出现破坏兼容性的变更。**

运行本项目前，请阅读[安全说明](SAFETY.zh.md)。

<a id="run"></a>

## 运行

### 通过 `npm` 运行

安装 `Node.js`，然后运行：

```sh
npx @deepseek-ai/dsh web
```

该命令默认会在 `http://127.0.0.1:3080` 启动 Web UI，本机启动时还会用默认浏览器打开页面。通过 SSH 启动时只打印宿主机 URL，因为本地转发地址由 SSH 客户端或编辑器持有。传入 `--no-open` 可仅运行服务器而不打开浏览器。详见 [Web UI 指南](docs/user/guide/index.zh.md)。

<a id="run-from-source"></a>

### 从源码运行

如需从仓库源码运行：

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` 会准备仓库产物。`pnpm dsh web` 会直接使用这些已构建产物，不会重新构建。

### 本地 AI 模型与无限超时等待（Fork 特性）

在此 Fork 中，启用了本地 AI 模型（如 `llama-cpp`）的无限等待响应支持，以防止在生成速度（token/秒）较慢时发生超时中断。

使用步骤如下：

1. **配置 [dsh-undici-fix.mjs](dsh-undici-fix.mjs) 中的 Undici 路径**：在 `dsh-undici-fix.mjs` 中，根据当前设备确认或添加 `undici/index.js` 的绝对路径（例如 `C:/Users/<用户>/.dsh/profiles/node_modules/undici/index.js`）。
2. **在 `settings.yml` 中配置超时时间**：在用户配置文件（Windows 下为 `C:\Users\<用户>\.dsh\settings.yml`，Linux/macOS 下为 `~/.dsh/settings.yml`）中，为本地 Provider 设置 `timeoutMs: 2147483647` 与 `streamIdleTimeoutMs: 2147483647`，并在 `shell` 中配置 `timeoutMs: 2147483647`。示例如下：

```yaml
ui-onboarding:
  welcomeNoticeVersion: 2026-08-13.1
llm-pi-ai:
  providers:
    {
      llama-cpp:
        {
          displayName: llama-cpp,
          apiKeyEnv: LLAMA_CPP_API_KEY,
          api: openai-completions,
          baseURL: http://localhost:8080/v1,
          timeoutMs: 2147483647,
          streamIdleTimeoutMs: 2147483647,
          models:
            [
              { id: C:\LLM\Qwen3.8-27B-ASCII-Condensed-UD-IQ4_XS.gguf, contextWindow: 77824 },
              {
                  id: C:\LLM\Qwen3.8-27B-GSQ-RCO-IQ3_S-mtp.gguf,
                  name: C:\LLM\Qwen3.8-27B-GSQ-RCO-IQ3_S-mtp.gguf,
                  contextWindow: 77824
                },
              {
                  id: C:\LLM\QWEN3.8-flash-next-UD-IQ3_XXS\Qwen3.8-Flash-Next-UD-IQ3_XXS-00001-of-00003.gguf,
                  name: C:\LLM\QWEN3.8-flash-next-UD-IQ3_XXS\Qwen3.8-Flash-Next-UD-IQ3_XXS-00001-of-00003.gguf,
                  contextWindow: 135536
                }
            ]
        },
      freetoken:
        {
          apiKeyEnv: FREETOKEN_API_KEY,
          api: openai-completions,
          baseURL: http://127.0.0.1:1919/v1,
          models: [ { id: Qwen3.6-35B-A3B-NVFP4, contextWindow: 198000 } ]
        }
    }
agent-default-model:
  provider: llama-cpp
  model: C:\LLM\QWEN3.8-flash-next-UD-IQ3_XXS\Qwen3.8-Flash-Next-UD-IQ3_XXS-00001-of-00003.gguf
agent-presets:
  default: standard
permission:
  defaultPreset: workspace-write
shell:
  timeoutMs: 2147483647
```

3. **在 Build 后运行**：使用 `pnpm run build`（或 `npm run build`）构建后，通过 `npm run dsh:fix`（或 `pnpm dsh:fix`，或在 Windows 下双击 `start.bat`）启动服务：

```sh
npm run dsh:fix
```

## 社区与支持

- 通过 [GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions) 提交反馈或 bug 报告。
- 为你的插件仓库添加 [`dsh-plugin`](https://github.com/topics/dsh-plugin) 话题，便于被发现。
- 欢迎加入 DeepSeek Harness 企微群：扫码添加企微小助手并填写入群问卷，完成后小助手会邀请你入群。

<table>
  <thead>
    <tr>
      <th align="center">企微小助手</th>
      <th align="center">入群问卷</th>
      <th align="center">微信公众号</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><img src="https://cdn.deepseek.com/harness/readme/community-wecom-assistant.png" alt="DeepSeek Harness 企微小助手二维码" width="180" height="180"></td>
      <td align="center"><a href="https://trtgsjkv6r.feishu.cn/share/base/form/shrcnIt5twSVdLGD52KJBckGCgg"><img src="https://cdn.deepseek.com/harness/readme/community-wecom-survey.png" alt="DeepSeek Harness 入群问卷二维码" width="180" height="180"></a></td>
      <td align="center"><img src="https://cdn.deepseek.com/harness/readme/community-wechat-official-account.png" alt="DeepSeek Harness 团队微信公众号二维码" width="180" height="180"></td>
    </tr>
  </tbody>
</table>

## 参与贡献

参见 [CONTRIBUTING.md](CONTRIBUTING.zh.md)。

## 开发

请先阅读[开发指南](docs/development.zh.md)与[架构文档](docs/architecture.zh.md)。

面向 agent：请遵循 [AGENTS.md](AGENTS.md)。

## 许可证

[MIT](LICENSE)

第三方依赖及其许可证见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
