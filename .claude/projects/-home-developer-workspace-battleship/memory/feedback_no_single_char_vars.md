---
name: feedback-no-single-char-vars
description: Do not use single-letter variable names unless mathematically necessary (e.g. x, y coordinates)
metadata:
  type: feedback
---

Avoid single-letter variable names like `r`, `e`, `s`. Use descriptive names like `response`, `error`, `session`.

**Why:** User preference for readability.

**How to apply:** Always in all code — variable names, parameters, destructuring. Exception: established math conventions (x/y coords, i for loop index).
