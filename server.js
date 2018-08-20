"use strict";

const config    = require("config");
const apiRouter = require("./api");
const Server    = require("./helpers/server");

const server = new Server({
  port: config.api.port,
  router: apiRouter
});
server.start();
