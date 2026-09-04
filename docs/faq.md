# Bulk Tweet Scheduler FAQ

## Is this a Twitter scheduling tool?

It is an open-source reference implementation for X/Twitter scheduling rules and queue generation. It does not ship a hosted publisher.

## Does it support bulk tweets and CSV?

Yes. CSV and JSON examples plus a CSV parser are included.

## Does it support multi-account scheduling?

Yes, at the queue-assignment level with round-robin account IDs. Live account adapters are future work.

## Does it bypass X limits?

No. Responsible scheduling and compliance are explicit requirements.
