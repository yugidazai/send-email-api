"use strict";

const emailConfig     = require("config").email;
const EmailValidator  = require("email-validator");
const EmailService    = require("../services/email/email-service");

const emailsToArray = emails => {
  if (!emails) return [];
  return Array.isArray(emails) ? emails : emails.split(`,`);
};

const validateSenderEmail = (errors, senderEmail) => {
  if (!EmailValidator.validate(senderEmail)) {
    errors.push(`Invalid Sender Email Address!`);
  }
};

const validateRecipientsEmail = (errors, { receiverEmail, bcc, cc }) => {
  let emailsToValidate = [];
  if (!receiverEmail || receiverEmail.length == 0) {
    errors.push(`Invalid Recipient Email Address!`);
  } else {
    emailsToValidate.push(receiverEmail);
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
  }
};

const validateInputText = (errors, { subject, content }) => {
  for (const textInput of [subject, content]) {
    if (!textInput || !textInput.trim()) {
      errors.push(`Invalid subject/content input!`);
      break;
    }
  }
};

const checkDuplicatedBccCc = (errors, { bcc, cc }) => {
  if (bcc.some(email => cc.indexOf(email) > -1)) {
    errors.push(`Duplicated email address found in both BCC and CC!`);
  }
};

const validateInput = ({senderEmail, receiverEmail, subject, content, bcc, cc}) => {
  let errors = [];
  validateSenderEmail(errors, senderEmail);
  validateRecipientsEmail(errors, { receiverEmail, bcc, cc });
  validateInputText(errors, { subject, content });
  checkDuplicatedBccCc(errors, { bcc, cc });
  return errors;
};

const handleSendEmail = params => {
  params.receiverEmail = emailsToArray(params.receiverEmail);
  params.bcc = emailsToArray(params.bcc);
  params.cc = emailsToArray(params.cc);
  const inputErrors = validateInput(params);
  if (inputErrors && inputErrors.length > 0) {
    return Promise.reject({ error: inputErrors });
  }

  return EmailService.sendEmail(params)
    .then(() => {
      console.info(`Email sent`);
      const allReceivers = params.receiverEmail.concat(params.cc).concat(params.bcc);
      return Promise.resolve({
        success: true,
        message: emailConfig.messages.success.replace(`{receiver}`, allReceivers)
      });
    })
    .catch(err => {
      console.error(`Email not sent!`, err);
      const failResponse = {
        success: false,
        message: emailConfig.messages.fail
      };
      return Promise.resolve(
        err.sendError? { error: err.sendError } : failResponse
      );
    });
};

module.exports = {
  handleSendEmail
};
