const express = require("express");
const app = express();
const AppointmentRouter = require("./appointment/appointment.router");

require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.use(express.json());

/** routes */

app.use(express.json());

app.use("/appointment", AppointmentRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
