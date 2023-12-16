const { connectToDatabase } = require("../database.js");
var moment = require("moment");

const oracledb = require("oracledb");

async function getAllAppointment() {
  const connection = await connectToDatabase();
  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  };

  try {
    const rs = await connection.execute(
      `select * from appointment`,
      [],
      options
    );
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

async function checkAvailability(connection, day, start) {
  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  };

  const sql = `SELECT count (*) as appointment_nb FROM TIMESLOT where EXTRACT(HOUR FROM start_time)=${start.hour()} and EXTRACT(MINUTE FROM start_time)=${start.minute()}  and appointment_day= '${day.format(
    "DD/MM/YY"
  )}'`;

  console.log(sql);
  try {
    const rs = await connection.execute(sql, {}, options);
    console.log(rs.rows[0].APPOINTMENT_NB);

    if (rs.rows[0].APPOINTMENT_NB >= 2)
      return { availability: false, startTime: start };
    return { availability: true, startTime: start };
  } catch (error) {
    console.error("Can't check availability of timeslot :", error.message);
  }
}

async function selectEmployers(connection) {
  const options = { outFormat: oracledb.OUT_FORMAT_OBJECT, maxRows: 2 };

  try {
    const rs = await connection.execute(
      `SELECT * from employer
      JOIN direction ON employer.direction_id = direction.direction_id
       where employer_son not in
       (select appointment.employer_son from appointment where appointment.status in ('Completed', 'On going', 'Scheduled') and appointment.employer_son = employer.employer_son)
       Order by direction.direction_id`,
      [],
      options
    );
    console.log("rs.rows", rs.rows);
    return rs.rows;
  } catch (error) {
    console.error("Can't get Employers:", error.message);
  }
}

async function InsertTimeSlot(connection, day, start) {
  console.log("we made it here");
  try {
    const sql1 = `INSERT INTO TIMESLOT (appointment_day , START_TIME ) 
    VALUES (TO_DATE(:day, 'DD/MM/YY') , INTERVAL '${start.format(
      "hh:mm"
    )}' HOUR TO MINUTE)`;
    const insertOptions = {
      autoCommit: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    };

    const binds = [day.format("DD/MM/YY")];
    console.log(binds);
    const insertRs = await connection.execute(sql1, binds, insertOptions);
    console.log(insertRs.lastRowid);

    return insertRs.lastRowid;
  } catch (error) {
    console.error("Can't reserve timeSlot:", error.message);
  }
}

async function InsertAppointment(connection, rowId, employer) {
  const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    maxRows: 1,
  };
  const insertOptions = {
    autoCommit: true,
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  };
  console.log("rowid", rowId);
  try {
    const ts_sql = `SELECT timeslot_id FROM timeslot where ROWID = '${rowId}'`;

    const rs = await connection.execute(ts_sql, [], options);
    const ts_id = rs.rows[0].TIMESLOT_ID;

    const sql2 = `INSERT INTO appointment (employer_son, timeslot_id, status , appointment_type)  VALUES ('${employer.EMPLOYER_SON}', '${ts_id}', 'Scheduled' , 'N')`;

    const insertRs = await connection.execute(sql2, [], insertOptions);
  } catch (error) {
    console.error("Can't add new appointment:", error.message);
  }
}

async function updateAppointment(appointmentDetails) {
  const connection = await connectToDatabase();

  console.log(appointmentDetails);
  let sql = "";
  switch (appointmentDetails.status) {
    case "On going":
      sql = `UPDATE Appointment SET status = 'On going',  doctor_son = '${appointmentDetails.doctor_son}' , OBSERVATION ='${appointmentDetails.observation}' WHERE appointment_id = ${appointmentDetails.id}`;
      break;

    case "Completed":
      sql = `UPDATE Appointment SET status = 'Completed', ANALYSIS_SUBMISSION = TO_DATE('${appointmentDetails.analysis_date}', 'YYYY-MM-DD') WHERE appointment_id = ${appointmentDetails.id}`;
      break;
    case "Missed":
      sql = `UPDATE Appointment SET status = 'Missed' WHERE appointment_id = ${appointmentDetails.id}`;
      break;

    case "Canceled":
      sql = `UPDATE Appointment SET status = 'Canceled', cancellation_reason='${appointmentDetails.cancellation_reason}' WHERE appointment_id = ${appointmentDetails.id}`;
      break;

    default:
      break;
  }
  try {
    console.log(sql);

    const updateRs = await connection.execute(sql, {}, { autoCommit: true });
    console.log(updateRs.rowsAffected);
    console.log("Modification réussie dans la base de données");
  } catch (error) {
    console.error(
      "Erreur lors de la modifiation dans la base de données:",
      error
    );
  } finally {
  }
}

module.exports = {
  getAllAppointment,
  checkAvailability,
  selectEmployers,
  InsertTimeSlot,
  InsertAppointment,
  updateAppointment,
};
