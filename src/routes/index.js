const express = require("express");
const routes = express.Router();
const userRoutes = require("./v1/user.routes");
const financialRoutes = require("./v1/financial.routes");

routes.use("/api", [userRoutes, financialRoutes]);

module.exports = routes;
