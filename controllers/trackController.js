const Visit = require("../models/Visit");
const useragent = require("useragent");
const geoip = require("geoip-lite");
const Session = require("../models/Session.js");

exports.trackVisit = async (req, res) => {
  try {
    const { url, referrer, sessionId, tags } = req.body;

    // Get IP address
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress;

    // Geo location from IP
    const getGeoFromIP = require("../utils/ipinfo");
    const location = await getGeoFromIP(ip);

    // Detect user agent
    const ua = useragent.parse(req.headers["user-agent"]);
    const browser = ua.family;
    const os = ua.os.family;
    const device = ua.device.family || "Unknown";

    const visit = new Visit({
      url,
      referrer,
      userAgent: req.headers["user-agent"],
      ip,
      location,
      browser,
      os,
      device,
      sessionId: sessionId || null,
      tags: Array.isArray(tags) ? tags : [],
    });

    await visit.save();
    if (sessionId) {
      const existingSession = await Session.findOne({ sessionId });

      if (!existingSession) {
        // Create new session
        await Session.create({
          sessionId,
          ip,
          userAgent: req.headers["user-agent"],
          startTime: new Date(),
          endTime: new Date(),
          pagesVisited: 1,
        });
      } else {
        // Update existing session
        existingSession.pagesVisited += 1;
        existingSession.endTime = new Date();
        await existingSession.save();
      }
    }

    res.status(201).json({ message: "Visit logged successfully" });
  } catch (error) {
    console.error("Error tracking visit:", error);
    res.status(500).json({ message: "Failed to log visit" });
  }
};
