# Code Style

## Enforced by Biome

Run `npx @biomejs/biome check --write .` before committing.

### No semicolons

All JS/TS statements end without `;`. Biome formatter (`semicolons: "asNeeded"`) removes them automatically.

```ts
// good
const x = 1
import { foo } from "./foo"

// bad
const x = 1;
```

### Always block scope

Control flow bodies always use `{}`. Biome linter (`useBlockStatements: "error"`) rejects single-line forms.

```ts
// good
if (condition) {
  doSomething()
}

// bad
if (condition) doSomething()
```

## Conventions (not enforced by Biome)

### No magic constants

Numeric and string literals with non-obvious meaning must be extracted into named constants at the top of the file.

```ts
// good
const CHAR_CODE_A = 65
const ALPHABET_SIZE = 26

if (n < ALPHABET_SIZE) {
  return String.fromCharCode(CHAR_CODE_A + n)
}

// bad
if (n < 26) {
  return String.fromCharCode(65 + n)
}
```



### React event handlers

Inline functions must never be passed directly as event props. Extract them as named functions prefixed with `handle` followed by the event name.

```tsx
// good
const handleClick = () => {
  dispatch(action())
}
return <Button onClick={handleClick}>OK</Button>

// bad
return <Button onClick={() => dispatch(action())}>OK</Button>
```

For handlers that depend on local state or need event arguments, keep them inside the component but still named:

```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value)
}
```
