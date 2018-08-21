"use strict";

const { email }     = require("config");
const EmailHandler  = require("../../controllers/email-handler");

// test data
const senderEmail   = `yugidazai.test@gmail.com`;
const senderName    = `Test Email`;
const receiverEmail = `yugidazai@gmail.com`;
const subject       = `This is a test email`;
const content       = `Hello World`;
const bcc           = `yugidazai.test@gmail.com`;
const cc            = `yugidazai.test@gmail.com`;

describe(`handleSendEmail`, () => {

  describe(`send email with invalid sender email`, () => {
    test(
      `without sender email`,
      done => {
        EmailHandler.handleSendEmail({ senderName, receiverEmail, subject, content })
          .catch(err => {
            expect(err).toBeDefined();
            expect(err.error).toBeDefined();
            expect(err.error).toHaveLength(1);
            expect(err.error).toContain(`Invalid Sender Email Address!`);
            done();
          });
      }
    );

    test(
      `with invalid sender email`,
      done => {
        EmailHandler.handleSendEmail({
          senderEmail: `testSender`, senderName, receiverEmail, subject, content
        }).catch(err => {
          expect(err).toBeDefined();
          expect(err.error).toBeDefined();
          expect(err.error).toHaveLength(1);
          expect(err.error[0]).toBe(`Invalid Sender Email Address!`);
          done();
        });
      }
    )
  });

  describe(`send email with invalid receiver email`, () => {

    test(
      `without receiver email`,
      done => {
        EmailHandler.handleSendEmail({ senderEmail, subject, content })
          .catch(err => {
            expect(err).toBeDefined();
            expect(err.error).toBeDefined();
            expect(err.error).toHaveLength(1);
            expect(err.error[0]).toBe(`Invalid Recipient Email Address!`);
            done();
          });
      }
    );

    test(
      `with invalid receiver email`,
      done => {
        EmailHandler.handleSendEmail({
          senderEmail, receiverEmail: `testReceiver`, subject, content
        }).catch(err => {
          expect(err).toBeDefined();
          expect(err.error).toBeDefined();
          expect(err.error).toHaveLength(1);
          expect(err.error[0]).toBe(`Invalid Recipient Email Address!`);
          done();
        });
      }
    );

    test(
      `invalid sender and receiver email`,
      done => {
        EmailHandler.handleSendEmail({
          senderName, receiverEmail: `testReceiver`, subject, content
        }).catch(err => {
          expect(err).toBeDefined();
          expect(err.error).toBeDefined();
          expect(err.error).toHaveLength(2);
          expect(err.error).toContain(`Invalid Sender Email Address!`);
          expect(err.error).toContain(`Invalid Recipient Email Address!`);
          done();
        });
      }
    );
  });

  describe(`send email with invalid subject/text`, () => {
    test(
      `without subject`,
      done => {
        EmailHandler.handleSendEmail({ senderEmail, receiverEmail, content })
          .catch(err => {
            expect(err).toBeDefined();
            expect(err.error).toBeDefined();
            expect(err.error).toHaveLength(1);
            expect(err.error[0]).toBe(`Invalid subject/content input!`);
            done();
          });
      }
    );

    test(
      `without content`,
      done => {
        EmailHandler.handleSendEmail({ senderEmail, receiverEmail, subject })
          .catch(err => {
            expect(err).toBeDefined();
            expect(err.error).toBeDefined();
            expect(err.error).toHaveLength(1);
            expect(err.error[0]).toBe(`Invalid subject/content input!`);
            done();
          });
      }
    );
  });

  describe(`send email with invalid bcc/cc email`, () => {
    test(
      `with invalid bcc email`,
      done => {
        EmailHandler.handleSendEmail({
          senderEmail, receiverEmail, bcc: `testBcc`, subject, content
        }).catch(err => {
          expect(err).toBeDefined();
          expect(err.error).toBeDefined();
          expect(err.error).toHaveLength(1);
          expect(err.error[0]).toBe(`Invalid Recipient Email Address!`);
          done();
        });
      }
    );

    test(
      `with invalid cc email`,
      done => {
        EmailHandler.handleSendEmail({
          senderEmail, receiverEmail, cc: `testCc`, subject, content
        }).catch(err => {
          expect(err).toBeDefined();
          expect(err.error).toBeDefined();
          expect(err.error).toHaveLength(1);
          expect(err.error[0]).toBe(`Invalid Recipient Email Address!`);
          done()
        });
      }
    );
  });

  describe(`send email with invalid params`, () => {
    test(
      `invalid sender/receiver/subject/text and no bcc/cc`,
      done => {
        EmailHandler.handleSendEmail({ receiverEmail: `testReceiver` })
          .catch(err => {
            expect(err).toBeDefined();
            expect(err.error).toBeDefined();
            expect(err.error).toHaveLength(3);
            expect(err.error).toContain(`Invalid Sender Email Address!`);
            expect(err.error).toContain(`Invalid Recipient Email Address!`);
            expect(err.error).toContain(`Invalid subject/content input!`);
            done();
          });
      }
    );
  });

  describe(`send email with valid params`, () => {
    const EmailService = require("../../services/email/email-service");
    test(
      `fail to send`,
      done => {
        EmailService.sendEmail = jest.fn(() => Promise.reject(`FAIL`));
        EmailHandler.handleSendEmail({ senderEmail, receiverEmail, subject, content })
          .then(response => {
            expect(EmailService.sendEmail).toHaveBeenCalledTimes(1);
            expect(response).toBeDefined();
            expect(response.success).toBe(false);
            expect(response.message).toBe(email.messages.fail);
            done();
          });
      }
    );

    // SUCCESS
    test(
      `send successfully`,
      done => {
        EmailService.sendEmail = jest.fn(() => Promise.resolve(`SUCCESS`));
        EmailHandler.handleSendEmail({ senderEmail, receiverEmail, subject, content })
          .then(response => {
            expect(EmailService.sendEmail).toHaveBeenCalledTimes(1);
            expect(response).toBeDefined();
            expect(response.success).toBe(true);
            expect(response.message).toBe(
              email.messages.success.replace(`{receiver}`, [receiverEmail])
            );
            done();
          });
      }
    );
  });
});
