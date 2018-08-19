"use strict";
const bodyParser    = require("body-parser");
const cors          = require("cors");
const express       = require("express");

class Server {
  constructor(options) {
    const { port, router, corsOptions } = options;
    const app = express();
    app.set("port", process.env.PORT || port || 5000);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    // For cors config options see:
    // https://www.npmjs.com/package/cors#configuration-options
    app.use(corsOptions? cors(corsOptions) : cors());
    app.options("*", cors());
    app.use("/", router);
    this.app = app;
    process.on("uncaughtException", err => console.error(err));
  }

  start() {
    const port = this.app.get("port");
    this.app.listen(port, () =>
      console.log(`API is running at http://localhost:${port}`)
    );
  }
}

module.exports = Server;
