# Send Email API
NodeJS API allows sending emails with an abstraction of different email service providers.
If one of the service providers goes down, the application can failover to a different service provider without affecting users' experience.

## Email Service Providers
- [MailGun](https://documentation.mailgun.com/en/latest/api-sending.html)
- [SendGrid](https://sendgrid.com/docs/API_Reference/Web_API_v3/index.html)
(Can add more service providers under `services/email/service-providers`)

## Structure
- config (Files for configuration key/value pairs of each NODE_ENV)
- controllers (Business Logic, e.g validate input, call service to send email and format output with abstraction of different email service providers)
- helpers (Files for common/reusable logic)
- services (Folder for all services)
- test (test purpose)

## Development
### Execute the API
```
npm install
npm start
```
### Test
### Execute
```
npm test
```

## Improvements/Production
- Use ASW KMS for handling encryption/decryption for API keys.
