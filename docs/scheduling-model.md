# Scheduling Model for a Bulk Tweet Scheduler

The engine transforms input tweets into candidate slots, then applies rules in a stable order:

```mermaid
flowchart TD
  A[Input tweets] --> B[Date range]
  B --> C[Weekday filter]
  C --> D[Daily window]
  D --> E[Blocked periods]
  E --> F[Candidate slots]
  F --> G[Minimum interval]
  G --> H[Daily capacity]
  H --> I[Skip ratio]
  I --> J[Round-robin accounts]
  J --> K[Publishing queue]
```

`generateSchedule` walks each UTC date in the inclusive range. For an allowed weekday it chooses a deterministic daily count and candidate minute using a seeded pseudo-random generator. Candidates outside the window, inside blocked periods, too close to the previous accepted slot, or selected by the skip ratio are discarded. Tweets are assigned to the remaining slots in input order.

This order is useful because it makes a preview explainable. A production implementation may use a timezone-aware date library and a persistence layer, but should preserve the same observable constraints.
