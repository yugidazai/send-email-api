"use strict";
const MailGun   = require("./mailgun");
const SendGrid  = require("./sendgrid");

class EmailServicesBuilder {
  constructor() {
    this.emailServices = [
      new MailGun(),
      new SendGrid()
    ]
  }

  getEmailServices() {
    return this.emailServices || [];
  }
};

module.exports = new EmailServicesBuilder();
