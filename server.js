const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./config/db");
const trackRoutes = require("./routes/trackRoutes");
const statesRoutes = require("./routes/statsRoutes");

const app = express();

app.use(express.json());
app.use(cors());

connectDB(); // Connect to MongoDB

//Routes
app.use("/track", trackRoutes);
app.use("/stats", statesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
