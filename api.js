"use strict";

const config        = require("config");
const RouterHelper  = require("./helpers/router");
const EmailHandler  = require("./controllers/email-handler");

const getRoutes = {
  "/": (req, res) => res.send(
    `Send Email API Running. Mode: ${config.email.developerMode? 'DEVELOPMENT' : 'PRODUCTION'}`)
};

const postRoutes = {
  "/send-email": RouterHelper.execute(EmailHandler.handleSendEmail)
};

const routeDefinitions = {
  GET: getRoutes,
  POST: postRoutes
};

module.exports = RouterHelper.createRouter(routeDefinitions);
