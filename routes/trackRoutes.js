const express = require("express");
const router = express.Router();
const { trackVisit } = require("../controllers/trackController");
const validateInput = require("../middlewares/validateInput");
const trackLimiter = require("../middlewares/rateLimiter");

router.post("/", trackLimiter, validateInput, trackVisit);

module.exports = router;
