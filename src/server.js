const express = require("express");
const app = express();
const routes = require("./routes");
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use(routes);

const PORT = 3333;

app.listen(3333, () => console.log(`Servidor rodando na porta ${PORT}`));
