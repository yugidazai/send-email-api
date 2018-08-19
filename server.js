"use strict";

const config    = require("config");
const ApiRouter = require("./api");
const Server    = require("./helpers/server");

const server = new Server({
  port: config.api.port,
  router: ApiRouter.get()
});
server.start();
