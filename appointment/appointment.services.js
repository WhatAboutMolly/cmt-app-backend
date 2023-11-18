const { getAllAppointment } = require("./appointment.controller");

function getAllAppointmentHandler(req, res) {
  getAllAppointment()
    .then((appointments) => {
      res.send(appointments);
    })
    .catch((err) => {
      res.status(404).send("Appointments not found ! ");
    });
}

module.exports = { getAllAppointmentHandler };
