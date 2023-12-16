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
          const newStart = start.clone().add(15 * i, "minutes");
          checkAvailability(connection, Date, newStart).then(
            ({ availability, startTime }) => {
              console.log(
                availability + " " + "start" + " " + startTime.format("h:mm")
              );
              if (availability == true) {
                InsertTimeSlot(connection, Date, startTime).then((rowId) => {
                  InsertAppointment(connection, rowId, employer).then();
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

module.exports = {
  getAllAppointmentHandler,
  secheduleAppointmentHandler,
  updateAppointmentHandler,
};
