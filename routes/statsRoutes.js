const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/auth");
const {
  statsSummary,
  getPages,
  getReferrers,
  getTimeline,
  getDevices,
  getGeoStats,
  exportData,
} = require("../controllers/statsController");

router.get("/summary", verifyToken, statsSummary);
router.get("/pages", verifyToken, getPages);
router.get("/referrers", verifyToken, getReferrers);
router.get("/timeline", verifyToken, getTimeline);
router.get("/devices", verifyToken, getDevices);
router.get("/geo", verifyToken, getGeoStats);
router.get("/export", verifyToken, exportData);
router.get("/admin/token", (req, res) => {
  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  res.json({ token });
});

module.exports = router;
