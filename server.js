const express = require("express");
const app = express();
const appRoutes = require("./routes/route.js");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.use(express.json());

/** routes */
app.use("/api", appRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
