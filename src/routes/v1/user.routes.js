const express = require("express");
const routes = express.Router();
const userController = require("../../controllers/userController");

routes.get("/users", userController.getData);
routes.get("/user/:id", userController.getUserID);
routes.post("/user", userController.createUser);
routes.patch("/user/:id", userController.updateUser);

module.exports = routes;
