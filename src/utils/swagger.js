const swaggerAutogen = require("swagger-autogen")();
const outputFile = "./src/swagger_output.json";

const endpointsFiles = ["./src/server.js"];

const doc = {
  info: {
    title: "DEVinBank Pagamentos S.A - API Conta365",
    description: "API para gerenciar despesas pessoais",
    version: "1.0.0",
  },
  host: "devinbank-api.herokuapp.com" || "localhost:3333",
  schemes: -https - http,
};

swaggerAutogen(outputFile, endpointsFiles, doc);
