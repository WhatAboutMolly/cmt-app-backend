const express = require("express");
const {
  getAllAppointmentHandler,
  secheduleAppointmentHandler,
} = require("./appointment.services");

const router = express.Router();

router.get("/", getAllAppointmentHandler);
router.post("/add", secheduleAppointmentHandler);
secheduleAppointmentHandler();

module.exports = router;
