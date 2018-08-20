"use strict";
const MailGun   = require("./mailgun");
const SendGrid  = require("./sendgrid");

module.exports = [
    new MailGun(),
    new SendGrid()
];
