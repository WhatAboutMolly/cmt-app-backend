const {
  getAllAppointment,
  sheduleAppointment,
  checkAvailability,
  selectEmployers,
  InsertTimeSlot,
  InsertAppointment,
} = require("./appointment.controller");
const { CronJob } = require("cron");
var moment = require("moment");
const { connectToDatabase } = require("../database.js");

function getAllAppointmentHandler(req, res) {
  getAllAppointment()
    .then((appointments) => {
      res.send(appointments);
    })
    .catch((err) => {
      res.status(404).send("Appointments not found ! ", err);
    });
}
var error;
async function secheduleAppointmentHandler(req, res) {
  const connection = await connectToDatabase();
  const today = moment("27/11/23", "DD/MM/YYYY");
  let start = moment("08:45", "h:mm");
  console.log("day", today);

  selectEmployers(connection).then((selectedEmployers) => {
    selectedEmployers.map((employer) => {
      console.log("employer", employer);
      start.add(15, "minutes");
      console.log("start2", start);
      checkAvailability(connection, today, start).then((avaibleStatus) => {
        if (avaibleStatus == true) {
          InsertTimeSlot(connection, today, start).then((rowId) => {
            InsertAppointment(connection, rowId, employer).then();
          });
        }
      });
    });
  });

  /*sheduleAppointment(today).then((data) => {
    console.log("data", data);
  });*/
  /*const job = new CronJob(
    " * 1 * * *", // cronTime

    function () {
      console.log("here");
      sheduleAppointment(direction)
        .then(() => {
          //res.status(201).send("appointments added... ! ");
        })
        .catch((err) => {
          //res.status(404).send("Appointments not found ! ");
          console.log(err);
        }),
        null, // onComplete
        true; // start
    }
  );
  job.start();*/
}

module.exports = { getAllAppointmentHandler, secheduleAppointmentHandler };
