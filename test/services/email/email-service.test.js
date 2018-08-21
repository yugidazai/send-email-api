"use strict";

const EmailService          = require("../../../services/email/email-service");
const emailServiceProviders = require("../../../services/email/service-providers");

// test data
const senderEmail   = `yugidazai.test@gmail.com`;
const senderName    = `Test Email`;
const receiverEmail = [`yugidazai@gmail.com`];
const subject       = `This is a test email`;
const content       = `Hello World`;

describe(`sendEmail`, () => {

  describe(`Send email with valid email service providers and non-blocked emails`, () => {
    const restoreMockProviders = () => {
      for (const spyOnSendByProvider of spyOnSendByProviders) {
        if (spyOnSendByProvider._isMockFunction) {
          spyOnSendByProvider.mockReset();
          spyOnSendByProvider.mockRestore();
        }
      }
    };

    let spyOnSendByProviders = [0,0];
    describe(`Success sending email`, () => {
      test(
        `Success with 1st email service provider`,
        done => {
          spyOnSendByProviders[0] = jest.spyOn(emailServiceProviders[0], `send`);
          spyOnSendByProviders[0].mockImplementation(() => Promise.resolve(`Success`));
          EmailService.sendEmail({ senderEmail, receiverEmail, subject, content })
            .then(response => {
              expect(spyOnSendByProviders[0]).toHaveBeenCalledTimes(1);
              expect(response).toBe(`Sent by provider: MailGun`);
              restoreMockProviders();
              done();
            });
        }
      );

      test(
        `Fail with 1st email service provider but Success with 2nd one`,
        done => {
          spyOnSendByProviders[0] = jest.spyOn(emailServiceProviders[0], `send`);
          spyOnSendByProviders[0].mockImplementation(() => Promise.reject(`Fail`));
          const expectResultOnService2 = `Success with Sendgrid`;
          spyOnSendByProviders[1] = jest.spyOn(emailServiceProviders[1], `send`);
          spyOnSendByProviders[1].mockImplementation(
            () => Promise.resolve(expectResultOnService2)
          );
          EmailService.sendEmail({ senderEmail, receiverEmail, subject, content })
            .then(response => {
              expect(spyOnSendByProviders[0]).toHaveBeenCalledTimes(1);
              expect(spyOnSendByProviders[1]).toHaveBeenCalledTimes(1);
              expect(response).toBe(expectResultOnService2);
              restoreMockProviders();
              done();
            });
        }
      );
    });

    describe(`Fail to send email`, () => {
      test(
        `Fail to send with both email service providers`,
        done => {
          spyOnSendByProviders[0] = jest.spyOn(emailServiceProviders[0], `send`);
          spyOnSendByProviders[0].mockImplementation(() => Promise.reject(`Fail`));
          const expectResultOnService2 = `Fail with Sendgrid`;
          spyOnSendByProviders[1] = jest.spyOn(emailServiceProviders[1], `send`);
          spyOnSendByProviders[1].mockImplementation(
            () => Promise.reject(expectResultOnService2)
          );
          EmailService.sendEmail({ senderEmail, receiverEmail, subject, content })
            .catch(response => {
              expect(spyOnSendByProviders[0]).toHaveBeenCalledTimes(1);
              expect(spyOnSendByProviders[1]).toHaveBeenCalledTimes(1);
              expect(response).toBe(expectResultOnService2);
              restoreMockProviders();
              done();
            });
        }
      );
    });
  });

  describe(`checkServicesError`, () => {
    describe(`Fail to send email due to development configuration`, () => {
      beforeEach(() => jest.resetModules());

      test(
        `Recipients are not registered in development mode`,
        done => {
          jest.mock('config', () => ({
            email: {
              developerMode: true,
              enabled: true,
              developerEmails: []
            }
          }));

          EmailService.sendEmail({ senderEmail, receiverEmail, subject })
            .catch(response => {
              expect(response).toBeDefined();
              expect(response.sendError).toBe(
                `Developer mode - emails blocked: ${receiverEmail}. Please contact API owner!`
              );
              done();
            });
        }
      );

      test(
        `Email feature is disable`,
        done => {
          jest.mock('config', () => ({
            email: { enabled: false }
          }));
          EmailService.sendEmail({ senderEmail, receiverEmail, subject, content })
            .catch(response => {
              expect(response).toBeDefined();
              expect(response.sendError).toBe(`Email service not Available`);
              done();
            });
        }
      );
    });
  });

});
