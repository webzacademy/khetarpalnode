const winston = require("winston");
const express = require("express");
const config = require("config");
const { after24Hours } = require("./services/scheduler");
const app = express();
require("./startup/logging")();
require("./startup/logger");
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));
setInterval(after24Hours, 5 * 60 * 60 * 1000);
module.exports = server;
