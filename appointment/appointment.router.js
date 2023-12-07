const express = require("express");
const {
  getAllAppointmentHandler,
  secheduleAppointmentHandler,
  setToEncoursHandler,
} = require("./appointment.services");

const router = express.Router();

router.get("/", getAllAppointmentHandler);
router.post("/add", secheduleAppointmentHandler);
router.post("/setToEncours", setToEncoursHandler);

//secheduleAppointmentHandler();

module.exports = router;
