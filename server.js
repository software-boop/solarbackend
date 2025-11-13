import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

// 🧩 Routes
import authRoutes from "./routes/authRoutes.js";
import entrepreneurRoutes from "./routes/entrepreneurRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import districtRoutes from "./routes/districtRoutes.js"; // ✅ new import

dotenv.config();

// 🔗 Connect MongoDB
connectDB();

const app = express();

/* ==========================================================
   🌍 CORS Middleware
========================================================== */

// You can add more origins later if needed
const allowedOrigins = [
  "http://localhost:5173",      // local Vite dev
  "https://btl-bhj.pages.dev", 
  'https://5fddbd90.btl-bhj.pages.dev' // deployed frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      
      // Allow requests with no origin (like Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" })); // handle large base64 payloads

/* ==========================================================
   🧭 Route Mounting
========================================================== */
app.use("/api/auth", authRoutes);
app.use("/api/entrepreneur", entrepreneurRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/district-coordinator", districtRoutes); // ✅ mounted route

/* ==========================================================
   🩵 Root Endpoint
========================================================== */
app.get("/", (req, res) =>
  res.send("☀️ Brihaspathi Solar Onboarding + Admin Auth API Running...")
);

/* ==========================================================
   ⚙️ Error Handling (Safety Net)
========================================================== */
app.use((err, req, res, next) => {
  console.error("❌ Uncaught Error:", err);
  res
    .status(500)
    .json({ message: err.message || "Server Error" });
});

/* ==========================================================
   🚀 Server Start
========================================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log("✅ Allowed CORS origins:", allowedOrigins);
});
