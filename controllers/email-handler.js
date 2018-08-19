"use strict";

const { email }       = require("config");
const EmailValidator  = require("email-validator");
const EmailService    = require("../services/email/email-service");

const emailsToArray = emails => {
  if (!emails) return [];
  return Array.isArray(emails) ? emails : emails.split(`,`);
};

class EmailHandler {
  constructor() {
    this.validateInput = ({senderEmail, receiverEmail, subject, content, bcc, cc}) => {
      let errors = [];
      if (!EmailValidator.validate(senderEmail)) {
        errors.push(`Invalid Sender Email Address!`);
      }

      let emailsToValidate = [];
      if (!receiverEmail || receiverEmail.length == 0) {
        errors.push(`Invalid Recipient Email Address!`);
      } else {
        emailsToValidate.push(receiverEmail);
      }
      if (bcc) emailsToValidate.push(bcc);
      if (cc) emailsToValidate.push(cc);
      for (const emailsInput of emailsToValidate) {
        let hasInvalidEmail = false;
        for (const email of emailsInput) {
          if (!EmailValidator.validate(email)) {
            errors.push(`Invalid Recipient Email Address!`);
            hasInvalidEmail = true;
            break;
          }
        }
        if (hasInvalidEmail) break;
      }

      for (const textInput of [subject, content]) {
        if (!textInput || !textInput.trim()) {
          errors.push(`Invalid subject/content input!`);
          break;
        }
      }
      return errors;
    };

    this.sendEmail = this.sendEmail.bind(this);
  }

  sendEmail(params) {
    params.receiverEmail = emailsToArray(params.receiverEmail);
    params.bcc = emailsToArray(params.bcc);
    params.cc = emailsToArray(params.cc);
    const inputErrors = this.validateInput(params);
    if (inputErrors && inputErrors.length > 0) {
      return Promise.reject({ error: inputErrors });
    }

    return EmailService.sendEmail(params)
      .then(result => {
        console.info(`Email sent`);
        const allReceivers = params.receiverEmail.concat(params.cc).concat(params.bcc);
        return Promise.resolve({
          success: true,
          message: email.messages.success.replace(`{receiver}`, allReceivers)
        });
      })
      .catch(err => {
        console.error(`Email not sent!`, err);
        const failResponse = {
          success: false,
          message: email.messages.fail
        };
        return Promise.resolve(
          err.sendError? { error: err.sendError } : failResponse
        );
      });
  }
}

module.exports = new EmailHandler();
