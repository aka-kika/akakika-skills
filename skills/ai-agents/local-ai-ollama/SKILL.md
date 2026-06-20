---
name: local-ai-ollama
description: Use when integrating an app with local AI models through Ollama — connection checks, model listing/selection, local-only mode, cloud-fallback consent, visible run states, and recovering from Ollama errors.
---

# Local AI Ollama

Integrate an app with local AI models through Ollama so it feels reliable before it feels powerful. Always check connection and model availability, surface clear state, and never silently fall back to the cloud.

## When to use

Use this skill when integrating agent workflows with local AI models through Ollama.

Use for local model selection, Ollama connection checks, menu bar AI apps, local-only mode, fallback behavior, model management, prompt routing, and debugging Ollama errors.

## Core rule

```
Local AI should feel reliable before it feels powerful.
Always check connection, model availability, and fallback behavior.
```

## When to use this skill

Use when the user mentions:

- Ollama
- local AI
- local model
- model running on Mac
- llama / qwen / gemma / mixtral
- local-only app
- offline AI
- 127.0.0.1:11434
- model picker
- Ollama not running
- pull model
- run model locally

## When not to use this skill

Do not use this skill for:

- Cloud-only OpenAI apps
- General UI design
- App Intents unless local model actions are exposed
- Training/fine-tuning workflows unless specifically requested

## Default connection settings

```
Default base URL: http://127.0.0.1:11434
Health check: GET /api/tags
Model run: POST /api/generate or /api/chat depending on app design
```

Always verify against current Ollama docs if implementing new API behavior.

## Basic architecture

```
UI
  ↓
AIClient protocol
  ↓
OllamaClient
  ↓
Connection check / model list / generation
  ↓
Fallback or error state
```

## AI client protocol

```swift
protocol AIClient {
    func checkConnection() async throws -> AIConnectionStatus
    func listModels() async throws -> [LocalModel]
    func generate(prompt: String, model: String) async throws -> String
}
```

## Status model

```swift
enum AIConnectionStatus: Equatable {
    case unknown
    case checking
    case connected
    case ollamaNotRunning
    case noModelsInstalled
    case modelMissing(String)
    case failed(String)
}
```

## Model model

```swift
struct LocalModel: Identifiable, Hashable {
    let id: String
    let name: String
    let size: String?
    let modifiedAt: Date?
}
```

## Ollama client skeleton

```swift
import Foundation

final class OllamaClient: AIClient {
    var baseURL: URL

    init(baseURL: URL = URL(string: "http://127.0.0.1:11434")!) {
        self.baseURL = baseURL
    }

    func checkConnection() async throws -> AIConnectionStatus {
        let url = baseURL.appending(path: "api/tags")
        let (_, response) = try await URLSession.shared.data(from: url)

        guard let http = response as? HTTPURLResponse else {
            return .failed("Invalid response")
        }

        return http.statusCode == 200 ? .connected : .failed("HTTP \(http.statusCode)")
    }

    func listModels() async throws -> [LocalModel] {
        // Decode Ollama /api/tags response here.
        []
    }

    func generate(prompt: String, model: String) async throws -> String {
        // Implement /api/generate or /api/chat.
        ""
    }
}
```

## UX rules

Always show clear local AI state:

```
Connected
Checking connection…
Ollama not running
No models installed
Selected model missing
Generation failed
```

Good error:

```
Ollama Not Running
The app could not connect to http://127.0.0.1:11434.
Start Ollama, then retry.
[Retry] [Open Settings]
```

Bad error:

```
Network error
```

## Settings for local AI

Recommended settings:

```
Provider: Ollama / Cloud / None
Ollama Base URL
Default Model
Test Connection
Refresh Models
Fallback to Cloud Model
Local-only Mode
Request Timeout
```

Secrets/API keys do not belong in Ollama settings unless using a cloud fallback. Store cloud secrets in Keychain.

## Model selection rules

- Show installed models from Ollama.
- Allow manual model name entry for advanced users.
- Show selected model missing state.
- Provide Refresh Models.
- Do not silently switch models without telling user.
- Keep a recommended default per task type if known.

## Local-only mode

When local-only mode is enabled:

```
- Never send prompts to cloud providers
- Disable cloud fallback
- Show “Local-only mode” clearly
- Explain when task cannot run locally
```

## Fallback behavior

If fallback is allowed:

```
Ollama fails → show error → ask before using cloud fallback unless user enabled automatic fallback
```

Do not silently send private prompts to cloud.

## Common Ollama errors

```
Connection refused / cannot connect:
Ollama is not running or URL is wrong.

Model not found:
Selected model is missing. Ask user to pull model or choose another.

Manifest requires newer Ollama:
User must update Ollama.

Port already in use:
Ollama server may already be running.
```

## Menu bar app integration

For menu bar apps:

```
Popover shows current model + status
Settings contains base URL and model picker
Command palette can run local tasks
Notifications can alert when generation finishes
```

Do not run long generation with no visible status.

## Review checklist

```
[ ] Ollama base URL is configurable
[ ] App checks connection before generation
[ ] App can list models
[ ] Missing model state is handled
[ ] Ollama-not-running state is clear
[ ] Local-only mode prevents cloud fallback
[ ] Cloud fallback requires explicit setting/consent
[ ] Generation has visible status
[ ] Errors have recovery actions
[ ] Timeouts are handled
```

## Common mistakes

```
Assuming Ollama is running
Hardcoding one model forever
Silent cloud fallback
No timeout handling
No model refresh
Vague network errors
Sending private prompts to cloud despite local-only expectation
No visible running state
```

## Prompt template

Drop this into any coding agent (Claude Code, Codex, Cursor, …) to apply the skill:

```
Use the local-ai-ollama skill to integrate local AI through Ollama.

Rules:
- Add an AIClient protocol.
- Implement OllamaClient behind the protocol.
- Make Ollama base URL configurable.
- Check connection with /api/tags before generation.
- Add model list and default model selection.
- Handle Ollama not running, no models, missing model, timeout, and generation errors.
- Add visible running/thinking/waiting/failed states.
- Add local-only mode that prevents cloud fallback.
- Do not silently send prompts to cloud.
- Add Test Connection and Refresh Models in Settings.
- Verify current Ollama API behavior before final implementation.

After coding:
1. List files changed.
2. Explain Ollama client architecture.
3. Explain settings added.
4. Explain local-only and fallback behavior.
5. Give manual test steps.
```
