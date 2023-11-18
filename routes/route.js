const router = require("express").Router();
//const { getBill } = require("../contoller/appController");
const { getBill } = require("../mailContoller/mailer.controller.js");

router.post("/product/getbill", getBill);

module.exports = router;
