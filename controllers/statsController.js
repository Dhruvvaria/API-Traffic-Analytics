const Visit = require("../models/Visit");
const { Parser } = require("json2csv");

exports.statsSummery = async (req, res) => {
  try {
    // Total visits (all records)
    const totalHits = await Visit.countDocuments();

    // Unique visitors (by IP or sessionId)
    const uniqueVisitors = await Visit.distinct("ip"); // Use 'sessionId' if you're tracking that
    const uniqueCount = uniqueVisitors.length;

    // TODO: Optional Features
    const averageSessionDuration = "N/A"; // Only if you implement sessions
    const bounceRate = "N/A"; // Only if you track page depth per session

    res.status(200).json({
      totalHits,
      uniqueVisitors: uniqueCount,
      averageSessionDuration,
      bounceRate,
    });
  } catch (error) {
    console.error("Error in summary stats:", error);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};

exports.getPages = async (req, res) => {
  try {
    const topPages = await Visit.aggregate([
      {
        $group: {
          _id: "$url", // group by page URL
          hits: { $sum: 1 }, // count visits
        },
      },
      { $sort: { hits: -1 } }, // sort by most visits
      { $limit: 10 }, // return top 10 pages
    ]);

    res.status(200).json({ topPages });
  } catch (error) {
    console.error("Error fetching top pages:", error);
    res.status(500).json({ message: "Failed to fetch top pages" });
  }
};

exports.getReferrers = async (req, res) => {
  try {
    const visits = await Visit.find({}, { referrer: 1 });

    const categories = {
      direct: 0,
      organic: 0,
      referral: 0,
      paid: 0,
    };

    visits.forEach((visit) => {
      const ref = visit.referrer?.toLowerCase() || "";

      if (!ref || ref === "direct") {
        categories.direct++;
      } else if (
        ref.includes("google") ||
        ref.includes("bing") ||
        ref.includes("yahoo")
      ) {
        categories.organic++;
      } else if (ref.includes("utm_source") || ref.includes("ad")) {
        categories.paid++;
      } else {
        categories.referral++;
      }
    });

    res.status(200).json({ referrerBreakdown: categories });
  } catch (error) {
    console.error("Error fetching referrers:", error);
    res.status(500).json({ message: "Failed to fetch referrers" });
  }
};

exports.getTimeline = async (req, res) => {
  try {
    const interval = req.query.interval || "daily";

    // Choose date format for grouping
    const dateFormat =
      interval === "hourly"
        ? "%Y-%m-%d %H:00" // Example: 2025-06-16 14:00
        : "%Y-%m-%d"; // Example: 2025-06-16

    const timeline = await Visit.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ timeline });
  } catch (error) {
    console.error("Error fetching timeline data:", error);
    res.status(500).json({ message: "Failed to fetch timeline stats" });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const browserStats = await Visit.aggregate([
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const osStats = await Visit.aggregate([
      { $group: { _id: "$os", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const deviceStats = await Visit.aggregate([
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      browsers: browserStats,
      operatingSystems: osStats,
      devices: deviceStats,
    });
  } catch (error) {
    console.error("Error fetching device stats:", error);
    res.status(500).json({ message: "Failed to fetch device stats" });
  }
};

exports.getGeoStats = async (req, res) => {
  try {
    const countryStats = await Visit.aggregate([
      { $group: { _id: "$location.country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const regionStats = await Visit.aggregate([
      { $group: { _id: "$location.region", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const cityStats = await Visit.aggregate([
      { $group: { _id: "$location.city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      countries: countryStats,
      regions: regionStats,
      cities: cityStats,
    });
  } catch (error) {
    console.error("Error fetching geo stats:", error);
    res.status(500).json({ message: "Failed to fetch geo stats" });
  }
};

exports.exportData = async (req, res) => {
  try {
    const format = req.query.format || "json"; // default to JSON

    const visits = await Visit.find().lean(); // get raw JS objects

    if (format === "csv") {
      const fields = [
        "url",
        "referrer",
        "userAgent",
        "ip",
        "location.country",
        "location.region",
        "location.city",
        "browser",
        "os",
        "device",
        "timestamp",
        "sessionId",
        "tags",
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(visits);

      res.header("Content-Type", "text/csv");
      res.attachment("traffic-data.csv");
      return res.send(csv);
    }

    // Default: JSON
    res.status(200).json({ data: visits });
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({ message: "Failed to export data" });
  }
};
