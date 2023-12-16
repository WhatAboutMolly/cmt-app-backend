const {
  getAllAppointment,
  checkAvailability,
  selectEmployers,
  InsertTimeSlot,
  InsertAppointment,
  updateAppointment,
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

function updateAppointmentHandler(req, res) {
  let appointmentDetails = req.body;

  console.log(appointmentDetails);

  updateAppointment(appointmentDetails)
    .then((appointment) => {
      res.send(appointment);
    })
    .catch((err) => {
      res.status(404).send({ message: "Can't update appointment " + err });
    });
}

async function setToTermineHandler(req, res) {
  let appointmentDetails = req.body;

  console.log(appointmentDetails);

  setToTermine(appointmentDetails)
    .then((appointment) => {
      res.send(appointment);
    })
    .catch((err) => {
      res.status(404).send("Can't update appointment ", err);
    });
}
async function setToManqueHandler(req, res) {
  let appointmentDetails = req.body;

  console.log(appointmentDetails);

  setToTManque(appointmentDetails)
    .then((appointment) => {
      res.send(appointment);
    })
    .catch((err) => {
      res.status(404).send("Can't update appointment ", err);
    });
}

async function secheduleAppointmentHandler(req, res) {
  const connection = await connectToDatabase();

  let start = moment("9:00", "h:mm");
  const job = new CronJob(
    "*/1 * * * *", // cronTime

    function () {
      let Date = moment().add(14, "days");
      console.log("here");
      selectEmployers(connection).then((selectedEmployers) => {
        selectedEmployers.map((employer, i) => {
          const employer_son = employer.EMPLOYER_SON;
          console.log(employer_son);
          const newStart = start.clone().add(15 * i, "minutes");
          checkAvailability(connection, Date, newStart).then(
            ({ availability, startTime }) => {
              console.log(
                availability + " " + "start" + " " + startTime.format("h:mm")
              );
              if (availability == true) {
                InsertTimeSlot(connection, Date, startTime).then((rowId) => {
                  InsertAppointment(connection, rowId, employer_son).then();
                });
              }
            }
          );
        });
      }),
        null, // onComplete
        true; // start
    }
  );
  job.start();
}

async function addAppointmentHandler(req, res) {
  const connection = await connectToDatabase();

  let { day, startTime, employer_son } = req.body;

  let start = moment(startTime, "h:mm");
  let date = moment(day, "DD/MM/YY");

  checkAvailability(connection, date, start).then(({ availability }) => {
    console.log(availability + " " + "start" + " " + start.format("h:mm"));
    if (availability == true) {
      InsertTimeSlot(connection, date, start).then((rowId) => {
        InsertAppointment(connection, rowId, employer_son).then(
          res.status(200).send("appointment added successfully !!")
        );
      });
    }
  });
}
module.exports = {
  getAllAppointmentHandler,
  secheduleAppointmentHandler,
  updateAppointmentHandler,
  addAppointmentHandler,
};
