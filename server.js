"use strict";

const restify = require("restify");
const Get = require("./controllers/get");

const server = restify.createServer();

server.get("/documents", Get.documents);
server.get("/documents/:documentID", Get.documentsByID);
server.get("/accounts/:accountID", Get.accountByID);
server.get("/accounts/:accountID/documents", Get.documentsByAccountID);

server.listen(8080);

module.exports = server;
