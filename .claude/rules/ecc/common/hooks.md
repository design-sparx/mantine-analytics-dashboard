# Hooks

## Runtime Hooks

Project hooks are configured by the agent harness, not stored in this repo. Do not copy runtime hook manifests manually into agent settings; rely on the harness-managed config instead.

## Hook Development

When authoring hooks or agent automations for this project:

- Keep hook scripts small and composable.
- Return structured output that downstream tools can parse.
- Avoid long-running synchronous work in hooks.
- Respect the harness-specific hook API and trust model.
