const express = require("express");
const {
  getAllAppointmentHandler,
  secheduleAppointmentHandler,
  updateAppointmentHandler,
  addAppointmentHandler,
} = require("./appointment.services");

const router = express.Router();

router.get("/", getAllAppointmentHandler);
router.post("/temp", secheduleAppointmentHandler);
router.post("/updateAppointment", updateAppointmentHandler);
router.post("/addAppointment", addAppointmentHandler);

//secheduleAppointmentHandler();

module.exports = router;
