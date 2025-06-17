# Traffic Analytics API

A backend service to track and analyze website traffic in real time, built using **Node.js**, **Express**, and **MongoDB**.

This project logs page visits and provides analytics like top pages, traffic sources, device usage, geo-location, bounce rate, and session durations.

> Secured with JWT and enriched with IP-based geo-location from **ipinfo.io**.

---

## Features

- ✅ Log website visits (`/track`)
- ✅ Generate analytics reports:
  - Total hits, unique users
  - Bounce rate, average session duration
  - Referrer sources
  - Device, OS, browser stats
  - Geo-location by country, region, city
- ✅ Export logs in CSV/JSON
- ✅ Secure stats APIs using JWT
- ✅ Input validation with Joi
- ✅ Rate limiting for anti-spam
- ✅ Session tracking (pages, duration)
- ✅ IP-based location lookup using ipinfo.io

---

## Tech Stack

- **Node.js**, **Express.js**
- **MongoDB** with **Mongoose**
- **ipinfo.io** for geo-location
- **useragent** for device detection
- **jsonwebtoken** for authentication
- **joi** for validation
- **express-rate-limit** for rate limiting
- **json2csv** for CSV export

---

## Setup & Installation

### 1. Clone the repo & install dependencies

git clone https://github.com/your-username/traffic-analytics-api.git
cd traffic-analytics-api
npm install

### 2. Configure .env file

Create a .env file and add:

PORT=5000
MONGO_URI=mongodb+srv://your-mongodb-uri
JWT_SECRET=your_jwt_secret
IPINFO_TOKEN=your_ipinfo_token

### 3. Run the server

npm start

Server will start at:
http://localhost:5000

## Authentication (JWT)

All /stats/\* endpoints require a valid token.

Generate one with:

GET /stats/admin/token

Then use it in your headers:

Authorization: Bearer <your-token>

## API Usage & Examples

🔹 POST /track
Track a user visit.

Headers:

Content-Type: application/json
X-Forwarded-For: 203.0.113.45
User-Agent: Chrome/120.0

Body:(json)
{
"url": "https://example.com/home",
"referrer": "https://google.com",
"sessionId": "abc123",
"tags": ["signup", "campaign"]
}

🔹 GET /stats/summary
Usage:

GET /stats/summary
Authorization: Bearer <token>

Response:
{
"totalHits": 12,
"uniqueVisitors": 5,
"averageSessionDuration": "2m 30s",
"bounceRate": "40.00%"
}

🔹 GET /stats/pages
Top visited pages with hit counts.

🔹 GET /stats/referrers
Breakdown: direct, organic, referral, paid

🔹 GET /stats/timeline?interval=daily|hourly
Graphable data over time.

🔹 GET /stats/devices
Device, OS, browser usage.

🔹 GET /stats/geo
Breakdown by country, region, city.

🔹 GET /stats/export?format=json|csv
Download all data in preferred format.

## ✨ Bonus Features Implemented

### ✅ 1. Session Tracking

Tracks user sessions by sessionId, pages visited, duration

What it means:
You track each user's session using a unique sessionId.

You store when the session starts and ends

You count how many pages were visited

Why it matters:
This enables advanced analytics like session time, user behavior patterns, and bounce rate.

### ✅ 2. Bounce Rate

% of sessions with only 1 page view

What it means:
Bounce rate = (single-page sessions / total sessions) × 100
You calculate this from your session data: if a session has only 1 page visited, it counts as a bounce.

Why it matters:
This helps identify how engaging your site is — high bounce = users leaving quickly.

### ✅ 3. Average Session Duration

Calculated from session start → end

What it means:
You subtract startTime from endTime for each session to find how long the user stayed.

Why it matters:
Helps measure user engagement and time spent on the website.

### ✅ 4. JWT Protection

All /stats routes secured using token

What it means:
All analytics endpoints like /stats/summary require a valid JWT token in the Authorization header.

Why it matters:
This keeps sensitive stats safe and accessible only to authorized users.

### ✅ 5. Rate Limiting

/track is protected from abuse

What it means:
You limit how often someone can hit the /track endpoint (e.g., 100 requests per 15 minutes per IP).

Why it matters:
Prevents abuse, spamming, and DDoS-like behavior.

### ✅ 6. Geo IP via ipinfo.io

Real-time country, region, city data from IP

What it means:
Instead of using a local IP lookup, you use the ipinfo.io API to get:

Country

Region (state)

City
based on the user's IP address.

Why it matters:
Gives you more accurate location data, which powers your /stats/geo endpoint.
