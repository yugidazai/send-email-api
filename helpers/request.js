"use strict";

const axios   = require("axios");
const config  = require("config");
const http    = require("http");
const qs      = require("qs");

const makeRequest = (requestOptions, params) => {
  requestOptions = {
		paramsSerializer: params => qs.stringify(params),
    ...requestOptions,
    params: params
  };
  requestOptions.headers = {
    'Content-Type': 'application/json',
    ...requestOptions.headers
  };
  if (requestOptions.method.toLowerCase() !== `get`) {
    requestOptions.data = requestOptions.params;
  }

  return axios(requestOptions)
    .then(res => res)
    .catch(error => {
      const { data } = error.response || {};
      return Promise.reject(new Error(
        (data && data.error)
          ? data.error.message
          : `Error calling service ${requestOptions.url}: ${data.message || data}`
      ));
		});
};

module.exports = {
  makeRequest
};
