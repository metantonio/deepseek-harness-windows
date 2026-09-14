# DeepSeek Harness

English | [中文](README.zh.md)

DeepSeek Harness (`dsh`) is an open-source agent harness developed by [DeepSeek AI](https://deepseek.com).

It is built on an **everything-is-a-plugin** architecture and powered by [Cordis](https://github.com/cordiverse/cordis), whose design is described in [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512).

Documentation: [https://deepseek-harness.github.io/deepseek-harness/](https://deepseek-harness.github.io/deepseek-harness/)

## Developer preview

DeepSeek Harness is in _developer preview_ and iterating rapidly. **THERE WILL BE COMPATIBILITY-BREAKING CHANGES.**

Review the [safety notice](SAFETY.md) before running the project.

## Run

### Run from `npm`

Install `Node.js`, then run:

```sh
npx @deepseek-ai/dsh web
```

The command starts the Web UI at `http://127.0.0.1:3080` by default and opens it in the default browser for a local launch. An SSH launch only prints the host URL because the SSH client or editor owns the local forwarded address. Pass `--no-open` to run the server without opening a browser. See [Web UI guide](docs/user/guide/index.md).

### Run from source

To run from a repository checkout:

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` prepares the repository artifacts. `pnpm dsh web` uses those built artifacts without rebuilding.

### Local AI models and indefinite response timeout (Fork)

This fork enables indefinite response timeouts for local AI models (e.g., with providers like `llama-cpp`), preventing request timeouts when token generation speed (tokens/second) is slow.

To use this feature:

1. **Undici path in [dsh-undici-fix.mjs](dsh-undici-fix.mjs)**: In `dsh-undici-fix.mjs`, verify or add the absolute path to `undici/index.js` as appropriate for your device (for example, `C:/Users/<username>/.dsh/profiles/node_modules/undici/index.js`).
2. **Timeouts in `settings.yml`**: In your user configuration file (`C:\Users\<username>\.dsh\settings.yml` on Windows or `~/.dsh/settings.yml` on Linux/macOS), configure `timeoutMs: 2147483647` and `streamIdleTimeoutMs: 2147483647` for your local provider, as well as `timeoutMs: 2147483647` under the `shell` section. Example `settings.yml`:

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

3. **Run after `build`**: After building the project with `npm run build` (or `pnpm run build`), launch the application by running `npm run dsh:fix` (or `pnpm dsh:fix`, or by executing `start.bat` on Windows):

```sh
npm run dsh:fix
```

## Community and support

- Submit feedback or bug reports through [GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions).
- Add the [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic to your plugin repository for discoverability.
- Join <a href="https://discord.gg/Ycq5dCaS4">DeepSeek Harness Discord community</a>.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Development

Start with the [development guide](docs/development.md) and [architecture documentation](docs/architecture.md).

For agents, follow [AGENTS.md](AGENTS.md).

## License

[MIT](LICENSE)

Third-party dependencies and their licenses are disclosed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
