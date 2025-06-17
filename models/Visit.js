const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VisitSchema = new Schema({
  url: String,
  referrer: String,
  userAgent: String,
  ip: String,
  location: {
    country: String,
    region: String,
    city: String,
  },
  browser: String,
  os: String,
  device: String,
  timestamp: { type: Date, default: Date.now },
  sessionId: String,
  tags: [String],
});

const Visit = mongoose.model("Visit", VisitSchema);
module.exports = Visit;
