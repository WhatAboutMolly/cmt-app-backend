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

async function sheduleAppointment(direction) {
  const connection = await connectToDatabase();
  console.log(direction);
  try {
    const rs = await connection.execute(
      `SELECT * from employer where employer_son not in (select appointment.employer_son from appointment) and employer.direction_id =${direction}`,
      [],
      { maxRows: 2 }
    );
    const employers = rs.rows;
    console.log(rs);
    return employers;
  } catch (error) {
    console.error("Can't shedule appointment:", error.message);
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
