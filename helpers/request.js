"use strict";

const axios   = require("axios");
const config  = require("config");
const http    = require("http");
const qs      = require("qs");

class RequestHelper {

  // Make HTTP request using the standard library
  makeRequestWithStandardLibrary(requestOptions, data) {
    requestOptions = {
      headers: { 'Content-Type': 'application/json' },
      agent: false,
      ...requestOptions
    };
    return new Promise((resolve, reject) => {
      const request = http.request(requestOptions, response => {
        let responseData;
        response.setEncoding('utf8');
        response.on('error', reject);
        response.on('data', data => responseData += data);
        response.on('end', () => { // Response has been received completely.
          try {
            responseData = JSON.parse(responseData);
          } catch (e) {
            console.error('Parsing data error', responseData, e);
            responseData = undefined;
          }
          // Response with error code or fail to parse response data
          if (!responseData || response.statusCode !== 200) {
            return reject();
          }
          resolve(responseData);
        });
      });
      request.setTimeout(config.requestTimeout, () => request.abort());
      request.on('error', reject);
      if (data && ['POST', 'PUT', 'PATCH'].indexOf(requestOptions.method) > -1) {
        request.write(JSON.stringify(data));
      }
      request.end();
    });
  }

  makeRequestWithAxios(requestOptions) {
    requestOptions = {
			paramsSerializer: params => qs.stringify(params),
      ...requestOptions
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
  }

  makeRequest(requestOptions, params) {
    return this.makeRequestWithAxios({...requestOptions, params: params});
    // return this.makeRequestWithStandardLibrary(requestOptions, params);
  }
}

module.exports = new RequestHelper();
