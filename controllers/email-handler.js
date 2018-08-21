"use strict";

const emailConfig     = require("config").email;
const EmailValidator  = require("email-validator");
const EmailService    = require("../services/email/email-service");

const emailsToArray = emails => {
  if (!emails) return [];
  return Array.isArray(emails) ? emails : emails.split(`,`);
};

const validateSenderEmail = (senderEmail) => {
  if (!EmailValidator.validate(senderEmail)) {
    return `Invalid Sender Email Address!`;
  }
};

const validateRecipientsEmail = ({ receiverEmail, bcc, cc }) => {
  let emailsToValidate = [];
  if (!receiverEmail || receiverEmail.length == 0) {
    return `Invalid Recipient Email Address!`;
  }
  emailsToValidate.push(receiverEmail);
  if (bcc) emailsToValidate.push(bcc);
  if (cc) emailsToValidate.push(cc);
  for (const emailsInput of emailsToValidate) {
    for (const email of emailsInput) {
      if (!EmailValidator.validate(email)) {
        return `Invalid Recipient Email Address!`;
      }
    }
  }
};

const validateInputText = ({ subject, content }) => {
  for (const textInput of [subject, content]) {
    if (!textInput || !textInput.trim()) {
      return `Invalid subject/content input!`;
    }
  }
};

const checkDuplicatedBccCc = ({ bcc, cc }) => {
  if (bcc.some(email => cc.indexOf(email) > -1)) {
    return `Duplicated email address found in both BCC and CC!`;
  }
};

const validateInput = ({senderEmail, receiverEmail, subject, content, bcc, cc}) => {
  let errors = [];
  const senderEmailError = validateSenderEmail(senderEmail);
  if (senderEmailError) errors.push(senderEmailError);

  const recipientsEmailError = validateRecipientsEmail({ receiverEmail, bcc, cc });
  if (recipientsEmailError) errors.push(recipientsEmailError);

  const inputTextError = validateInputText({ subject, content });
  if (inputTextError) errors.push(inputTextError);

  const duplicatedBccCcError = checkDuplicatedBccCc({ bcc, cc });
  if (duplicatedBccCcError) errors.push(duplicatedBccCcError);

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
