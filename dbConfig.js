const oracledb = require("oracledb");

const dbConfig = {
  user: "CMT",
  password: "MALENIA430",
  connectString: "localhost/orcl",
  //privilege: oracledb.SYSDBA,
};

module.exports = { dbConfig };
