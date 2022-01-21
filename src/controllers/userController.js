const { getData, createOrUpdateData } = require("../utils/functions");
const { translate } = require("../utils/constants");

module.exports = {
  async getData(req, res) {
    /*
    #swagger.tags = ['Users']
    #swagger.description = 'Endpoint para listar usuários'
    */
    const users = getData("src/database", "users.json");
    res.status(200).json({ message: users });
  },
  async getUserID(req, res) {
    /*
    #swagger.tags = ['Users']
    #swagger.description = 'Endpoint para pesquisar um usuário específico'
    */
    const { id } = req.params;
    const users = getData("src/database", "users.json");
    const findUser = users.find((user) => user.id === Number(id));

    if (!findUser) {
      return res.status(400).json({ message: "Usuário indisponível" });
    }

    res.status(200).json({ message: findUser });
  },
  async createUser(req, res) {
    /* 
    #swagger.tags = ['Users']
    #swagger.description = 'Endpoint para criar usuários'
    #swagger.parameters['parameterName'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'Zé Colméia',
        email: 'ze@colmeia.com.br'
      }
    }
    */
    const { name, email, ...fields } = req.body;
    console.log(fields);
    const existKeyValue = Object.keys(req.body).filter(
      (item) => !req.body[item] || typeof req.body[item] !== "string"
    );

    const translateWords = existKeyValue.map((item) => translate[item]);

    if (Object.keys(fields).length > 0) {
      return res.status(400).send({
        message: `Preencha apenas o(s) seguinte(s) campo(s): nome, email`,
      });
    }

    if (existKeyValue.length >= 1) {
      return res.status(400).send({
        message: `Preencha o(s) seguinte(s) campo(s): ${translateWords.join(
          ", "
        )}`,
      });
    }

    const users = getData("src/database", "users.json");
    const createNewUser = [
      ...users,
      {
        id: users.length + 1,
        name: name,
        email: email,
      },
    ];
    createOrUpdateData("src/database/users.json", createNewUser);
    return res.status(201).send({ message: "Usuário cadastrado com sucesso!" });
  },
  async updateUser(req, res) {
    /*
    #swagger.tags = ['Users']
    #swagger.description = 'Editar/Atualizar os dados de um usuário específico'
    #swagger.parameters['parameterName'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'Zé Colméia',
        email: 'ze@colmeia.com.br'
      }
    }
    */
    const { id } = req.params;

    const users = getData("src/database", "users.json");
    const findUser = users.find((user) => user.id === Number(id));

    if (!findUser) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const existKeyValue = Object.keys(req.body).filter(
      (item) => item !== "name" && item !== "email"
    );

    if (existKeyValue.length >= 1) {
      return res.status(400).send({
        message: `Você não tem permissão para cadastrar o(s) campo(s): ${existKeyValue.join(
          ", "
        )}`,
      });
    }

    const existValue = Object.keys(req.body).filter(
      (item) => !req.body[item] || typeof req.body[item] !== "string"
    );

    const translateWords = existValue.map((item) => translate[item]);

    if (existValue.length >= 1) {
      return res.status(400).send({
        message: `Preencha o(s) seguinte(s) campo(s): ${translateWords.join(
          ", "
        )}`,
      });
    }

    const updateUserFound = users.map((user) => {
      if (user.id === Number(id)) {
        return { ...user, ...req.body };
      } else {
        return { ...user };
      }
    });

    createOrUpdateData("src/database/users.json", updateUserFound);

    res
      .status(200)
      .json({ message: "Dados do usuário atualizados com sucesso" });
  },
};
