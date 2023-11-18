const { connectToDatabase } = require("../database.js");

async function getAllAppointment() {
  const connection = await connectToDatabase();

  try {
    const rs = await connection.execute(`select * from doctor`);
    return rs.rows;
  } catch (error) {
    console.error("Error in GetAllAppointment :", error.message);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Can't close the connexion", error.message);
      }
    }
  }
}

async function sheduleAppointment() {
  const connection = await connectToDatabase();

  try {
    const rs = await connection.execute(`select * from Employee`);
    return rs.rows;
  } catch (error) {
    console.error("Error in GetAllAppointment :", error.message);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Can't close the connexion", error.message);
      }
    }
  }
}
module.exports = { getAllAppointment, sheduleAppointment };
