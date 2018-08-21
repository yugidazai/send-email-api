"use strict";
const MailGun   = require("./mailgun");
const SendGrid  = require("./sendgrid");

const emailServiceProviders = [
    new MailGun(),
    new SendGrid()
];

module.exports = emailServiceProviders;
