"use strict";

const { Router } = require("express");

class RouterHelper {
  constructor() {
    this.parseParams = (req) => {
      let params = {};
      for (const field of [ "body", "params", "query" ]) {
        const data = req[field];
        if (data) {
          for (const key in data) {
            const value = data[key];
            if (typeof value !== "function") {
              params[key] = value;
            }
          }
        }
      }
      return params;
    }
  }

  execute(method) {
    return (req, res) => {
      const params = this.parseParams(req);
      try {
        method(params)
          .then(result => res.send(result))
          .catch(err => res.status(500).send(err.message || err));
      } catch (error) {
        res.status(500).send(error.message);
      }
    };
  }

  createRouter(routeDefinitions) {
    const router = Router();
    for (const http_method in routeDefinitions) {
      const routes = routeDefinitions[http_method];
      for (const route in routes) {
        const routeHandler = routes[route];
        router[http_method.toLowerCase()](route, routeHandler);
      }
    }
    return router;
  }
}

module.exports = new RouterHelper();
