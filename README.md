# Send Email API
NodeJS API allows sending emails with an abstraction of different email service providers.
If one of the service providers goes down, the application can failover to a different service provider without affecting users' experience.

## Email Service Providers
- [MailGun](https://documentation.mailgun.com/en/latest/api-sending.html)
- [SendGrid](https://sendgrid.com/docs/API_Reference/Web_API_v3/index.html)
### (Can add more service providers under `services/email/service-providers`)

## Structure
- config (Files for configuration key/value pairs of each NODE_ENV)
- controllers (Business Logic, e.g validate input, call service to send email and format output with abstraction of different email service providers)
- helpers (Files for common/reusable logic)
- services (Folder for all services)
- test (test purpose)

## Development
### Execute the API
1. Add API keys in an environment file, e.g `email.env`
2. Run `source email.env` before starting the API service.
3. Start API
```
npm install
npm start
```
### Execute Test
```
npm test
```
### Emails' whitelist
There are a list of emails that can be only receiver in development mode.
(Refer `developerMode` key in config file)
This is to avoid that the email service accidentally sends emails to wrong people.

## Improvements/Production
- Use ASW KMS for handling encryption/decryption for API keys.
