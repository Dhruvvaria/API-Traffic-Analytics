const axios = require("axios");

const getGeoFromIP = async (ip) => {
  try {
    const response = await axios.get(
      `https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`
    );
    const { country, region, city } = response.data;
    return {
      country: country || "Unknown",
      region: region || "Unknown",
      city: city || "Unknown",
    };
  } catch (err) {
    console.error("IPInfo fetch failed:", err.message);
    return {
      country: "Unknown",
      region: "Unknown",
      city: "Unknown",
    };
  }
};

module.exports = getGeoFromIP;
