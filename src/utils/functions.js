const fs = require("fs");

const getData = (path, fileName) => {
  const data = JSON.parse(fs.readFileSync(`${path}/${fileName}`, "utf-8"));
  return data;
};

const createOrUpdateData = (path, data) => {
  fs.writeFileSync(`${path}`, JSON.stringify(data));
};

module.exports = {
  getData,
  createOrUpdateData,
};
