const express = require("express");
const routes = express.Router();
const financialController = require("../../controllers/financialController");

const multer = require("multer");
const upload = multer();

routes.get("/financial", financialController.getFinancial);
routes.get("/financial/:userID", financialController.getFinancialID);
routes.post(
  "/financial/:userID",
  upload.single("file"),
  financialController.importFinancialItems
);
routes.delete(
  "/financial/:userID/:financialID",
  financialController.deleteFinancialUser
);

module.exports = routes;
