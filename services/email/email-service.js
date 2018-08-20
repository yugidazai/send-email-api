"use strict";

const { email }     = require("config");
const emailServices = require("./service-providers");

const checkServicesError = ({receiverEmail, bcc = [], cc = []}) => {
  if (!email.enabled || !emailServices || emailServices.length == 0) {
    return `Email service not Available`;
  }

  if (email.developerMode) {
    for (const emails of [ receiverEmail, bcc, cc ]) {
      const blockedEmails = emails.filter(
        e => email.developerEmails.indexOf(e) < 0
      );
      if (blockedEmails.length > 0) {
        return `Developer mode - emails blocked: ${blockedEmails}. Please contact API owner!`;
      }
    }
  }
};

const sendEmailByProvider = (serviceProvider, params) => serviceProvider.send(params);

const sendEmail = (params) => {
  const servicesError = checkServicesError(params);
  if (servicesError) {
    return Promise.reject({ sendError: servicesError });
  }

  // try 1st service provider
  let serviceProvider = emailServices[0];
  console.info(`Try 1st service provider: ${serviceProvider.constructor.name}`)
  let sendEmailPromise = sendEmailByProvider(serviceProvider, params);
  for (const i in emailServices) {
    if (i == 0) continue;
    sendEmailPromise = sendEmailPromise
      .then(() => `Sent by provider: ${serviceProvider.constructor.name}`)
      .catch(err => {
        console.error(err);
        if (err.missingParam) {
          return Promise.reject(err.missingParam);
        }
        serviceProvider = emailServices[i];
        console.info(`Try next service provider: ${serviceProvider.constructor.name}`);
        return sendEmailByProvider(serviceProvider, params);
      });
  }
  return sendEmailPromise;
};

module.exports = {
  sendEmail
};
