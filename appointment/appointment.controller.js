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
  const sql = `SELECT timeslot_id, availability_status FROM TIMESLOT where EXTRACT(HOUR FROM start_time)=${start.hour()} and EXTRACT(MINUTE FROM start_time)=${start.minute()}  and appointment_day= '${day.format(
    "DD/MM/YY"
  )}'`;

  console.log(sql);
  try {
    const rs = await connection.execute(sql);
    console.log(rs.rows.length);
    console.log(rs.rows[0][1]);
    if (rs.rows.length == 0 || rs.rows[0][1] == "Y") return true;
    else return false;
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
    const sql1 = `INSERT INTO TIMESLOT (appointment_day , START_TIME , availability_status) 
    VALUES (TO_DATE(:day, 'DD/MM/YY') , INTERVAL '${start.format(
      "hh:mm"
    )}' HOUR TO MINUTE, 'N')`;
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

async function sheduleAppointment(day) {
  const connection = await connectToDatabase();
  const insertOptions = {
    autoCommit: true,
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  };
  let start = moment("08:45", "h:mm");

  console.log("start1", start.minute());
  return selectEmployers(connection).then((selectedEmployers) => {
    for (employer in selectedEmployers) {
      start.add(15, "minutes");
      console.log("start2", start);
      return checkAvailability(connection, day, start).then(
        async (avaibleStatus) => {
          console.log("avaibleStatus", avaibleStatus);
          if (avaibleStatus == false) {
            try {
              return InsertTimeSlot(connection, day, start).then(
                async (rowid) => {
                  console.log("here");
                  const options = {
                    outFormat: oracledb.OUT_FORMAT_OBJECT,
                    maxRows: 1,
                  };

                  const ts_sql = `SELECT * FROM timeslot`;

                  const rs = await connection.execute(ts_sql);

                  console.log("rowid", rs.rows);

                  const sql2 = `INSERT INTO appointment (employer_son, timeslot_id, status , appointment_type)  VALUES (${employer.employer_son}, ${ts_id}, 'Scheduled' , 'N')`;

                  const insertRs = await connection.execute(
                    sql2,
                    [],
                    insertOptions
                  );
                }
              );
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
        }
      );
    }
  });
}

async function insertIntoDatabase() {
  const connection = await connectToDatabase();

  try {
    const sql =
      "INSERT INTO votre_table (colonne1, colonne2) VALUES (:valeur1, :valeur2)";
    const binds = { valeur1: "valeur", valeur2: "valeur" };
    const options = { autoCommit: true };

    await connection.execute(sql, binds, options);

    console.log("Insertion réussie dans la base de données");
  } catch (error) {
    console.error("Erreur lors de l'insertion dans la base de données:", error);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(
          "Erreur lors de la fermeture de la connexion à la base de données:",
          error
        );
      }
    }
  }
}

async function setToEncours(appointmentDetails) {
  const connection = await connectToDatabase();

  try {
    /*
    const sql = `UPDATE Appointment SET status = 'On going', observation = '${appointmentDetails.observation}', doctor_son = '${appointmentDetails.doctor_son}' WHERE appointment_id = ${appointmentDetails.id}`;

    const binds = [];
    const options = { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT };
    console.log(sql);*/

    const insertRs = await connection.execute(
      "UPDATE Appointment SET status = 'On going',  doctor_son = 'son9281' WHERE appointment_id = 97",
      {},
      { autoCommit: true }
    );
    console.log("end");
    console.log(insertRs.affectedrows);
    console.log("Insertion réussie dans la base de données");
  } catch (error) {
    console.error("Erreur lors de l'insertion dans la base de données:", error);
  } finally {
  }
}

// Planifier la tâche cron toutes les 2 minutes
/**cron.schedule("*2 * * * *", () => {
  console.log("Exécution de la tâche cron...");
  insertIntoDatabase();
});*/
module.exports = {
  getAllAppointment,
  sheduleAppointment,
  insertIntoDatabase,
  checkAvailability,
  selectEmployers,
  InsertTimeSlot,
  InsertAppointment,
  setToEncours,
};
