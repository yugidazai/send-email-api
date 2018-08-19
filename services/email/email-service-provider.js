"use strict";

const RequestHelper = require("../../helpers/request");

class EmailServiceProvider {
  constructor(options) {
    this.requestOptions = {};
  }

  send(params) {
    this.requestOptions.method = "POST";
    if (!this.requestOptions.url) {
      return Promise.reject({
        missingParam: `Missing email param "url"!`
      });
    }
    if (!this.requestOptions.headers) {
      return Promise.reject({
        missingParam: `Missing email param "headers"!`
      });
    }

    return RequestHelper.makeRequest(this.requestOptions, params);
  }
}

module.exports = EmailServiceProvider;
