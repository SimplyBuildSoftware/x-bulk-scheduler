# Safety and Responsible Automation

- Follow X platform rules, API limits, applicable law, and account-specific restrictions.
- Use only authorized accounts and secure credentials through environment variables or a secret manager.
- Validate content before publishing and keep a human review step for sensitive campaigns.
- Use conservative daily capacity, minimum intervals, and clear failure monitoring.
- Treat skip ratio as campaign pacing and publishing flexibility, never as a bypass or evasion mechanism.
- Never implement CAPTCHA bypass, rate-limit bypass, anti-bot evasion, credential theft, or unauthorized access.

The scheduler prints a queue; it does not publish directly to X. That separation makes policy review and adapter testing easier.
