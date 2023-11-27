const {
  getAllAppointment,
  sheduleAppointment,
} = require("./appointment.controller");
const { CronJob } = require("cron");
var moment = require("moment");

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
function secheduleAppointmentHandler(req, res) {
  const today = moment(new Date(), "DD/MM/YYYY");
  console.log("day", today);
  sheduleAppointment(today).then((data) => {
    console.log("data", data);
  });
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
