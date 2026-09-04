# Advanced Scheduling Concepts

## Candidate time slots

Generate candidate minutes only within an allowed date and time window. A seeded generator makes previews reproducible.

## Constraint filtering

Reject a candidate when it is outside the date range, on the wrong weekday, inside a blocked period, or closer than the minimum interval.

## Randomized scheduling

Use a bounded random choice to distribute content across a window. `skip_ratio` can pace a campaign; it must not be marketed as human simulation or enforcement evasion.

## Daily capacity

Choose an integer between the configured minimum and maximum posts per day, then stop accepting candidates after that capacity.

## Queue management

Model task state as `pending -> scheduled -> published`, with `failed -> retry` transitions recorded by the publishing adapter.

## Deterministic scheduling

Provide a seed in test and preview environments so the same tweets and rules produce the same queue. Production systems may rotate seeds per campaign while retaining the seed in audit logs.
