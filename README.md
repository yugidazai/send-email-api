# Send Email API
NodeJS API allows sending emails with an abstraction of different email service providers.
If one of the service providers goes down, the application can failover to a different service provider without affecting users' experience.

## Email Service Providers
- [MailGun](https://documentation.mailgun.com/en/latest/api-sending.html) To receive email from MailGun (sandbox env), your email needs to be in the authorized list of sandbox MailGun account. Contact developer about this.
- [SendGrid](https://sendgrid.com/docs/API_Reference/Web_API_v3/index.html)
### (Can add more service providers under `services/email/service-providers`)

## Structure
- `config` (Files for configuration key/value pairs of each NODE_ENV)
- `controllers` (Business Logic, e.g validate input, call service to send email and format output with abstraction of different email service providers)
- `helpers` (Files for common/reusable logic)
- `services` (Folder for all services)
- `test` (unit tests using `jest`)

## Development
### Install dependencies
```
npm install
```
### Execute the API
1. Add API keys in an environment file, e.g `email.env`
2. Start API
  - Command line
    ```
    source email.env
    npm start
    ```
    or
    ```
    npm run start-dev
    ```
or
  - VSCode:
    + run `source email.env`in VSCode terminal
    + start API with launch name `Debug API`

### Execute Test
```
npm test
```
### Emails' whitelist
There are a list of emails that can be only receiver in development mode.

(Refer `developerMode` & `developerEmails` keys in config file)
This is to avoid that the email service accidentally sends emails to wrong people.

## API Usage
Endpoint: `/send-email`
Params: (all are mandatory except `senderName`, `bcc` and `cc`)
- `senderEmail`
- `senderName`
- `receiverEmail`
- `bcc`
- `cc`
- `subject`
- `content`

## Improvements/Production
- Use ASW KMS for handling encryption/decryption for API keys.
