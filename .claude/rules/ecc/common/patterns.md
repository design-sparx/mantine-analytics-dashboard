# Common Patterns

## Immutability

Always create new objects and arrays rather than mutating existing ones. This applies to:

- State updates
- Data transformations
- Configuration changes
- Collection modifications

## Error Handling

- Handle errors explicitly at every level
- Provide user-friendly error messages in UI-facing code
- Log detailed error context on the server side
- Never silently swallow errors

## Input Validation

- Validate all user input before processing
- Use schema-based validation where available
- Fail fast with clear error messages
- Never trust external data (API responses, user input, file content)

## Separation of Concerns

- Keep business logic separate from UI rendering
- Isolate side effects from pure functions
- Define clear boundaries between layers

## Composition

- Prefer composition over inheritance
- Use small, focused functions
- Build complex behavior from simple, reusable pieces
