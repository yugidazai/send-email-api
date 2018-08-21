"use strict";
const SendGrid  = require("../../../../services/email/service-providers/sendgrid");
const RequestHelper = require("../../../../helpers/request");

const senderEmail   = `yugidazai.test@gmail.com`;
const senderName    = `Test Email`;
const receiverEmail = [`yugidazai@gmail.com`];
const subject       = `This is a test email`;
const content       = `Hello World`;

describe(`test send method`, () => {
  test(
    `return what RequestHelper returns`,
    done => {
      const expectedResult = `SENDGRID SUCCESS`;
      RequestHelper.makeRequest = jest.fn(() => Promise.resolve(expectedResult));

      new SendGrid().send({ senderEmail, senderName, receiverEmail, subject, content })
        .then(response => {
          expect(RequestHelper.makeRequest).toHaveBeenCalledTimes(1);
          expect(response).toBe(expectedResult);
          done();
        });
  });
});
