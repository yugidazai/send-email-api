"use strict";

const { email }             = require("config");
const EmailServicesBuilder  = require("./service-providers");

class EmailService {
  constructor() {
    this.emailServices = EmailServicesBuilder.getEmailServices();
    this.checkServicesError = ({receiverEmail, bcc = [], cc = []}) => {
      if (!email.enabled || !this.emailServices || this.emailServices.length == 0) {
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
    this.sendEmailByProvider =
      (serviceProvider, params) => serviceProvider.send(params);
  }

  sendEmail(params) {
    const servicesError = this.checkServicesError(params);
    if (servicesError) {
      return Promise.reject({ sendError: servicesError });
    }

    // try 1st service provider
    let serviceProvider = this.emailServices[0];
    console.info(`Try 1st service provider: ${serviceProvider.constructor.name}`)
    let sendEmailPromise = this.sendEmailByProvider(serviceProvider, params);
    for (const i in this.emailServices) {
      if (i == 0) continue;
      sendEmailPromise = sendEmailPromise
        .then(() => `Sent by provider: ${serviceProvider.constructor.name}`)
        .catch(err => {
          console.error(err);
          if (err.missingParam) {
            return Promise.reject(err.missingParam);
          }
          serviceProvider = this.emailServices[i];
          console.info(`Try next service provider: ${serviceProvider.constructor.name}`);
          return this.sendEmailByProvider(serviceProvider, params);
        });
    }
    return sendEmailPromise;
  }
};

module.exports = new EmailService();
