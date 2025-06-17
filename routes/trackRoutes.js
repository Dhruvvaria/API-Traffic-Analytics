const express = require("express");
const router = express.Router();
const { trackVisit } = require("../controllers/trackController");

router.post("/", trackVisit);

module.exports = router;
