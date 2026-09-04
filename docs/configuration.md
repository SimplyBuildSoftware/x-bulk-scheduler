# Configuration Reference

The following is an implemented configuration shape for `generateSchedule`:

```yaml
schedule:
  start_date: "2026-09-01"
  end_date: "2026-09-30"
  days: [monday, wednesday, friday]
  time_window:
    start: "09:00"
    end: "18:00"
  blocked_periods:
    - start: "12:00"
      end: "14:00"
  skip_ratio: 0.60
  posts_per_day:
    min: 3
    max: 7
  minimum_interval_minutes: 45
  seed: 42
  timezone: "UTC"
```

`skip_ratio` must be between 0 and 1. Time values use `HH:MM`. The current MVP validates the fields and stores the timezone label; slot arithmetic is UTC, so convert local times before handing a queue to a live publisher.
