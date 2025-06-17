const express = require("express");
const router = express.Router();
const {
  statsSummery,
  getPages,
  getReferrers,
  getTimeline,
  getDevices,
  getGeoStats,
  exportData,
} = require("../controllers/statsController");

router.get("/summery", statsSummery);
router.get("/pages", getPages);
router.get("/referrers", getReferrers);
router.get("/timeline", getTimeline);
router.get("/devices", getDevices);
router.get("/geo", getGeoStats);
router.get("/export", exportData);

module.exports = router;
