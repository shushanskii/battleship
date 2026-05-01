# Packages

## `@battleship/core` (`packages/core`)

Pure domain logic with no runtime dependencies. Contains two modules:

- `@battleship/core/board` — `Board`, `Cell`, `CellStatus` types and board operations (`init`, `place`, `canPlace`, `print`, `clone`, …). Also re-exports `indexToLabel` for coordinate formatting.
- `@battleship/core/ship` — `Ship`, `ShipDirection` types and ship operations (`init`, `coords`, `hit`, `isSunk`). Owns `indexToLabel`.

No build step — consumers resolve TypeScript source directly via `package.json#exports`.

## `@battleship/agent` (`packages/agent`)

LangGraph agent that places ships using an LLM. Exposes an HTTP server (session creation) and a WebSocket server (game stream). Sends `board` and `tokens` messages to the frontend over WebSocket.

## `frontend` (`packages/frontend`)

React + Redux Saga frontend. Connects to agent via WebSocket, renders the board and token counter, and lets the user send answers.

---

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

### Namespace imports for domain modules

Import `@battleship/core` submodules as namespaces, not as named imports. This removes the need for `board`/`ship` prefixes on individual function names.

```ts
// good
import * as Board from "@battleship/core/board"
import * as Ship from "@battleship/core/ship"

Board.init()
Board.place(board, ship)
Ship.init(origin, direction, length)

// bad
import { initBoard, boardPlace, initShip } from "@battleship/core"

initBoard()
boardPlace(board, ship)
initShip(origin, direction, length)
```

When only types are needed (e.g. in Redux slice), use a type-only import from the subpath:

```ts
import type { Board } from "@battleship/core/board"
```

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
