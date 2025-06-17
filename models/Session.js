const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  sessionId: { type: String, required: true },
  ip: String,
  userAgent: String,
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  pagesVisited: { type: Number, default: 1 },
});

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
