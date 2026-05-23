---
name: feedback-async-await
description: Prefer async/await over promise chain (.then/.catch)
metadata:
  type: feedback
---

Always use `async/await` instead of `.then()/.catch()` chains.

**Why:** User preference for readability and consistency.

**How to apply:** In all async code across the project — API calls, sagas, any Promise-based logic. Never write `.then((result) => ...)` when `await` can be used instead.
