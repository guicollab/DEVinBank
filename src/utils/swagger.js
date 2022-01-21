const swaggerAutogen = require("swagger-autogen")();
const outputFile = "./src/swagger_output.json";

const endpointsFiles = ["./src/server.js"];

const doc = {
  info: {
    title: "DEVinBank Pagamentos S.A - API Conta365",
    description: "API para gerenciar gastos pessoais",
  },
  host: "localhost:3333",
};

swaggerAutogen(outputFile, endpointsFiles, doc);
