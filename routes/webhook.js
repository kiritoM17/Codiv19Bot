var express = require("express");

const config = require("./../key.facebook");
const elva = require("./../controllers/elvaController");
const elvaController = new elva();

var router = express.Router();
// code pour se connecter à DialogFlow
router.post("/", elvaController.postFacebook);
router.get("/", elvaController.getFacebook);
module.exports = router;
