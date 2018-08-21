"use strict";
const { sendgrid }          = require("config").email.providers;
const EmailServiceProvider  = require("../email-service-provider");

const formatEmails = emails =>
  emails
    ? Array.isArray(emails)
        ? emails.map(email => ({ email: email }))
        : emails.split(`,`)
    : []


class SendGrid extends EmailServiceProvider {
  constructor(options) {
    super(options);
    const apiKey = process.env.SENDGRID_API_KEY || sendgrid.apiKey;
    this.requestOptions = {
      ...(this.requestOptions),
      url: sendgrid.url,
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    };
  }

  send({ senderEmail, senderName, receiverEmail, subject, content, bcc, cc }) {
    const params = {
      from: { email: senderEmail, name: senderName },
      personalizations: [{
        "to": formatEmails(receiverEmail)
      }],
      subject: subject,
      content: [{
        type: "text/plain", value: content
      }]
    }
    bcc = formatEmails(bcc);
    cc = formatEmails(cc);
    if (bcc && bcc.length > 0) params.personalizations[0].bcc = bcc;
    if (cc && cc.length > 0) params.personalizations[0].cc = cc;

    return super.send(params);
  }
}

module.exports = SendGrid;
