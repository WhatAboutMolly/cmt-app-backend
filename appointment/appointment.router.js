const express = require("express");
const { getAllAppointmentHandler } = require("./appointment.services");

const router = express.Router();

router.get("/", getAllAppointmentHandler);

module.exports = router;
