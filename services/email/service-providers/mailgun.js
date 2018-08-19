"use strict";
const { mailgun }           = require("config").email.providers;
const EmailServiceProvider  = require("../email-service-provider");

const formatEmails = emails =>
  Array.isArray(emails)? emails.join(`,`) : emails;

class MailGun extends EmailServiceProvider {
  constructor(options) {
    super(options);
    const apiKey = process.env.MAILGUN_API_KEY || mailgun.apiKey;
    this.requestOptions = {
      ...(this.requestOptions),
      url: mailgun.url,
      headers: {},
      auth: {
        username: 'api',
        password: apiKey
      }
    };
  }

  send({ senderEmail, senderName, receiverEmail, subject, content, bcc, cc }) {
    const params = {
      from: senderName? `${senderName} <${senderEmail}>` : senderEmail,
      to: formatEmails(receiverEmail),
      text: content,
      subject: subject
    };
    bcc = formatEmails(bcc);
    cc = formatEmails(cc);
    if (bcc) params.bcc = bcc;
    if (cc) params.cc = cc;
    return super.send(params);
  }
}

module.exports = MailGun;
