const oracledb = require("oracledb");
const { dbConfig } = require("./dbconfig.js");

const connectToDatabase = async function connect() {
  let connection;
  try {
    console.log(dbConfig);
    connection = await oracledb.getConnection(dbConfig);

    console.log("Successfully connected to Oracle Database");
  } catch (err) {
    console.error("error", err);
  }
  return connection;

  /*finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }*/
};

module.exports = { connectToDatabase };
