"""Reference implementation example; the Python SDK is not part of this repository."""

from xscheduler import XScheduler  # Replace with your own adapter implementation.

scheduler = XScheduler(accounts=["account-a", "account-b"])
scheduler.load_tweets("tweets.csv")
scheduler.set_date_range(start="2026-09-01", end="2026-09-30")
scheduler.set_days(["monday", "wednesday", "friday"])
scheduler.set_time_window(start="09:00", end="18:00")
scheduler.set_blocked_period(start="12:00", end="14:00")
scheduler.set_skip_ratio(0.20)
scheduler.set_daily_post_range(minimum=3, maximum=7)
scheduler.set_minimum_interval(45)
scheduler.schedule()
