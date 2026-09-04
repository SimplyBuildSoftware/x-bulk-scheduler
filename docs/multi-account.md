# Multi-Account Scheduling

Multi-account scheduling is a queue assignment problem, not an account acquisition problem. Keep account IDs authorized by the operator, assign content with a documented strategy, enforce per-account limits, and persist task/retry/publishing history.

```mermaid
flowchart TD
  Queue[Tweet queue] --> Scheduler[Scheduling engine]
  Scheduler --> Assign[Account assignment]
  Assign --> A[Account A]
  Assign --> B[Account B]
  Assign --> C[Account C]
```

The MVP provides round-robin assignment:

```js
const queue = assignAccounts(items, ["account-a", "account-b", "account-c"]);
```

Future adapters can add per-account capacity, retries, and publishing history. The project never creates accounts, collects credentials, or bypasses X verification.
