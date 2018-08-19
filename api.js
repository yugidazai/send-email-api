"use strict";

const RouterHelper  = require("./helpers/router");
const EmailHandler  = require("./controllers/email-handler");

const getRoutes = {
  "/": (req, res) => res.send(process.env.DEFAULT_TEXT || `Send Email API Running`)
};

const postRoutes = {
  "/send-email": RouterHelper.execute(EmailHandler.sendEmail)
};

class ApiRouter {
  constructor() {
    this.routeDefinitions = {
      GET: getRoutes,
      POST: postRoutes
    };
  }

  get() {
    return RouterHelper.createRouter(this.routeDefinitions);
  }
};

module.exports = new ApiRouter();
