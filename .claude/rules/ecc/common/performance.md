# Performance Optimization

## Context Window Management

Avoid last 20% of context window for:

- Large-scale refactoring
- Feature implementation spanning multiple files
- Debugging complex interactions

Lower context sensitivity tasks:

- Single-file edits
- Independent utility creation
- Documentation updates
- Simple bug fixes

## Build Troubleshooting

If build fails:

1. Use build-error-resolver agent
2. Analyze error messages
3. Fix incrementally
4. Verify after each fix
