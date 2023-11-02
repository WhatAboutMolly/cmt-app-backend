const router = require("express").Router();
//const { getBill } = require("../contoller/appController");
const { getBill } = require("../contoller/mailer.controller.js");

router.post("/product/getbill", getBill);

module.exports = router;
