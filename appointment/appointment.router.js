const express = require("express");
const {
  getAllAppointmentHandler,
  secheduleAppointmentHandler,
  updateAppointmentHandler,
} = require("./appointment.services");

const router = express.Router();

router.get("/", getAllAppointmentHandler);
router.post("/add", secheduleAppointmentHandler);
router.post("/updateAppointment", updateAppointmentHandler);

//secheduleAppointmentHandler();

module.exports = router;
