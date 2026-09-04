# X Bulk Scheduler Architecture

```mermaid
flowchart TD
  User[User / content team] --> UI[Dashboard / CLI]
  UI --> Engine[Scheduling engine]
  Engine --> Rules[Rule processor]
  Rules --> Slots[Time slot generator]
  Slots --> Queue[Queue manager]
  Queue --> Assignment[Account assignment]
  Assignment --> Adapter[Publishing adapter]
  Adapter --> X[X API / authorized integration]
  Adapter --> Result[Publishing result]
  Result --> Logs[Analytics / logs]
```

The repository implements the engine, queue records, CSV parsing, and a CLI preview. `PublishingAdapter` is a conceptual boundary for a future official integration. No endpoint or credential flow is assumed.
