const { getData, createOrUpdateData } = require("../utils/functions");
const xlsxPopulate = require("xlsx-populate");
const XlsxPopulate = require("xlsx-populate");

module.exports = {
  async getFinancial(req, res) {
    /*
    #swagger.tags = ['Financial']
    #swagger.description = 'Endpoint que lista as despesas dos usuários'
    */
    const financial = getData("src/database", "financial.json");
    return res.status(200).json({ message: financial });
  },

  async getFinancialID(req, res) {
    /*
    #swagger.tags = ['Financial']
    #swagger.description = 'Endpoint que lista as despesas por ano/mês de um usuário específico'
    */
    const { userID } = req.params;
    const { typesOfExpenses } = req.query;

    const financial = getData("src/database", "financial.json");
    const financialUser = financial.find(
      (item) => item.userID === Number(userID)
    );

    if (!financialUser) {
      return res.status(400).json({ message: "Usuário indisponível." });
    }

    const expenses = financialUser.financialData;

    if (expenses.length === 0) {
      return res.status(400).json({ message: "Despesas não contabilizadas" });
    }

    const query =
      typesOfExpenses &&
      financialUser.financialData.filter(
        (item) =>
          item.typesOfExpenses.toLowerCase() === typesOfExpenses.toLowerCase()
      );

    const filterFinancial = typesOfExpenses ? query : expenses;

    const result = filterFinancial.reduce((acc, obj) => {
      const year = obj.date.substr(0, 7);
      acc[year] = (acc[year] || 0) + Number(obj.price);
      return acc;
    }, Object.create(null));

    const yearMonthExpenses = Object.keys(result)
      .map((item) => ({
        date: item,
        price: result[item],
      }))
      .sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

    return res.status(200).json({ Total: yearMonthExpenses });
  },

  async importFinancialItems(req, res) {
    /* 
    #swagger.tags = ['Financial']
    #swagger.description = 'Endpoint que adiciona despesas na lista de gastos de um determinado usuário (ID)'
    #swagger.consumes = ['multipart/form-data']  
    #swagger.parameters['file'] = {
        in: 'formData',
        type: 'file',
        required: 'true',
        description: 'Carregue um arquivo Excel (.xslx) com as despesas do usuário.',
        accept: '/',
    }
    */
    const { userID } = req.params;
    // check user exists
    const users = getData("src/database", "users.json");
    const findUser = users.find((user) => user.id === Number(userID));
    console.log(findUser);

    if (!findUser) {
      return res.status(400).json({ message: "Usuário indisponível" });
    }

    // Buffer XLSX File
    const xlsxBuffer = req.file.buffer;
    // Buffer Data Info
    const xlsxData = await xlsxPopulate.fromDataAsync(xlsxBuffer);
    // 2D - data table format
    const rows = xlsxData.sheet(0).usedRange().value();

    const [firstRow] = rows;
    const columnKeys = ["price", "typesOfExpenses", "date", "description"];
    const checkKeys = firstRow.every((item, index) => {
      return columnKeys[index] === item;
    });

    if (!checkKeys || firstRow.length !== 4) {
      res.status(400).json({
        message:
          "O nome dos campos estão incorretos. Verifique se o nome das colunas correspondem (price, typesOfExpenses, date, description) e tente novamente.",
      });
    }

    const financial = getData("src/database", "financial.json");
    const findUserID = financial.find((user) => user.userID === Number(userID));
    console.log(findUserID);

    const filterRows = rows.filter((_, index) => index !== 0);

    if (findUser && !findUserID) {
      financial.push({
        id: financial.length + 1,
        userID: Number(userID),
        financialData: [],
      });
    }

    const _findUserID = financial.find(
      (user) => user.userID === Number(userID)
    );

    filterRows.map((row) => {
      const result = row.map((cell, index) => {
        if (index === 2) {
          const num = cell;
          cell = XlsxPopulate.numberToDate(num);
        }
        return {
          [firstRow[index]]: cell,
        };
      });

      const financialItems = Object.assign(
        {},
        { id: _findUserID.financialData.length + 1 },
        ...result
      );

      _findUserID.financialData.push(financialItems);
    });

    createOrUpdateData("src/database/financial.json", financial);
    res.status(200).json({ message: "Despesas importadas com sucesso!" });
  },

  async deleteFinancialUser(req, res) {
    /*
    #swagger.tags = ['Financial']
    #swagger.description = 'Endpoint que remove despesas de um usuário específico'
    */
    const { userID, financialID } = req.params;

    const financial = getData("src/database", "financial.json");
    const userFinancialID = financial.find(
      (user) => user.userID === Number(userID)
    );

    if (!userFinancialID) {
      return res.status(400).json({ message: "Usuário indisponível" });
    }

    const expensesID = userFinancialID.financialData.find(
      (item) => item.id === Number(financialID)
    );
    if (!expensesID) {
      return res.status(400).json({ message: "Despesa não localizada" });
    }

    const deleteExpense = userFinancialID.financialData.filter(
      (item) => item.id !== Number(expensesID.id)
    );

    const userExpense = { ...userFinancialID, financialData: deleteExpense };

    financial.map((item, index) => {
      if (item.userID === Number(userID)) {
        financial[index] = userExpense;
      }
    });

    createOrUpdateData("src/database/financial.json", financial);
    return res.status(200).json({ message: "Despesa removida com sucesso!" });
  },
};
