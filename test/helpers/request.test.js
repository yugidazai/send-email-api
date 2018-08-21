"use strict";

const axios         = require("axios");
const RequestHelper = require("../../helpers/request");

describe(`send request with axios`, () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe(`send request successfully`, () => {
    const mockResponse = { data: { results: 'success' }};

    test(
      `POST method`,
      done => {
        jest.mock(`axios`, () => any => Promise.resolve(mockResponse));
        RequestHelper.makeRequest({url: 'url', method: 'POST'}, {})
          .then(response => {
            expect(response).toEqual(mockResponse);
            done();
          });
    });
  });

  describe(`fail to send request`, () => {
    const mockError = { response: { data: { error: { message: 'failed' }}}};

    test(
      `POST method`,
      done => {
        jest.mock(`axios`, () => any => Promise.reject(mockError));
        RequestHelper.makeRequest({url: 'url', method: 'POST'}, {})
          .catch(error => {
            expect(error).toEqual(new Error ('failed'));
            done();
          });
    });
  });

});
