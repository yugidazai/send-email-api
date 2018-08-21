"use strict";

const qs = require("qs");

const makeRequest = (requestOptions, params) => {
  // Temporarily move here for testing purpose, can be improved later.
  const axios = require("axios");

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
