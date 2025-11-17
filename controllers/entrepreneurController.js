// // import Entrepreneur from "../models/Entrepreneur.js";
// // import { sendMail } from "../utils/sendMail.js";
// // import geoip from "geoip-lite";
// // import fs from "fs";
// // import path from "path";

// // /**
// //  * Register new Entrepreneur (public user)
// //  * Detects theme, personalizes district WhatsApp link, and sends styled email.
// //  */
// // export const registerEntrepreneur = async (req, res) => {
// //   try {
// //     const { fullname, email, mobile, state, district, city, pincode, theme } = req.body;
// //     const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

// //     // Validation
// //     if (!fullname || !email || !mobile || !state || !district || !city || !pincode)
// //       return res.status(400).json({ message: "All fields are required" });

// //     // Check existing email
// //     const exists = await Entrepreneur.findOne({ email });
// //     if (exists) return res.status(400).json({ message: "Email already registered" });

// //     // Geo-location lookup
// //     const geo = geoip.lookup(ip) || {};

// //     // Save user
// //     const newUser = await Entrepreneur.create({
// //       fullname,
// //       email,
// //       mobile,
// //       state,
// //       district,
// //       city,
// //       pincode,
// //       location: {
// //         ip,
// //         country: geo.country || "Unknown",
// //         region: geo.region || "Unknown",
// //         city: geo.city || "Unknown",
// //         ll: geo.ll || [],
// //       },
// //     });

// //     // ================================
// //     // 🎨 THEME LOGIC
// //     // ================================
// //     const isDark = theme === "dark" || false;
// //     const logoURL = isDark
// //       ? "https://www.brihaspathi.com/highbtlogo%20white-%20tm.png"
// //       : "https://www.brihaspathi.com/highbtlogo%20tm%20(1).png";
// //     const bgColor = isDark ? "#121212" : "#ffffff";
// //     const textColor = isDark ? "#ffffff" : "#07518a";
// //     const borderColor = "#07518a";
// //     const secondaryText = isDark ? "#cccccc" : "#888888";

// //     // Read WhatsApp SVG (uploaded earlier)
// //     const whatsappIconPath = path.join(process.cwd(), "uploads", "ec49572e-67cc-4332-a7de-38f2c97614e7.svg");
// //     let whatsappSVG = "";
// //     try {
// //       whatsappSVG = fs.readFileSync(whatsappIconPath, "utf8");
// //     } catch {
// //       whatsappSVG = `<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" width="20" height="20" />`;
// //     }

// //     // ================================
// //     // 📧 HTML EMAIL TEMPLATE
// //     // ================================
// //     const htmlContent = `
// //     <div style="font-family:Arial,Helvetica,sans-serif;text-align:center;background:${bgColor};color:${textColor};padding:20px;">
// //       <!-- Logo -->
// //       <div style="padding:20px 0;">
// //         <img src="${logoURL}" alt="Brihaspathi Technologies Ltd" style="max-width:200px;height:auto;">
// //       </div>

// //       <h2 style="margin:0 0 10px;">Thank You for Registering!</h2>
// //       <p style="margin:0 0 16px;">Dear ${fullname},</p>
// //       <p style="margin:0 0 22px; line-height:1.6;">
// //         We appreciate your collaboration in our <b>Solar Training Entrepreneurship Program</b>.<br/>
// //         Your registration details from <b>${district} District</b> have been successfully recorded.
// //       </p>

// //       <!-- Action buttons -->
// //       <div style="margin:10px 0 24px;">
// //         <!-- WhatsApp -->
// //         <a href="https://chat.whatsapp.com/DOHjxHWQBjfEHmi8N8iAT4"
// //            style="display:inline-block;margin:6px; padding:12px 20px; background:${bgColor};
// //                   border:2px solid ${borderColor}; border-radius:6px; text-decoration:none;
// //                   font-weight:bold; color:${textColor};">
// //           ${whatsappSVG}
// //           <span style="vertical-align:middle;margin-left:8px;">Join ${district} WhatsApp Community</span>
// //         </a>

// //         <!-- Website -->
// //         <a href="https://www.brihaspathi.com"
// //            style="display:inline-block;margin:6px; padding:12px 20px; background:${textColor};
// //                   border:2px solid ${borderColor}; border-radius:6px; text-decoration:none;
// //                   font-weight:bold; color:${isDark ? "#121212" : "#ffffff"};">
// //           🌐 Visit Our Website
// //         </a>
// //       </div>

// //       <p style="margin:0 0 24px; font-size:14px;">
// //         Or copy &amp; paste:
// //         <a href="https://www.brihaspathi.com" style="color:${textColor}; text-decoration:underline;">
// //           www.brihaspathi.com
// //         </a>
// //       </p>

// //       <p style="margin-top:10px;font-size:13px;color:${secondaryText};">
// //         © Brihaspathi Technologies Ltd. All rights reserved.
// //       </p>
// //     </div>
// //     `;

// //     // Send Email
// //     await sendMail(
// //       email,
// //       "Welcome to Brihaspathi Solar Training Entrepreneurship Program",
// //       htmlContent
// //     );

// //     res.status(201).json({
// //       message: "Registration successful. Email sent successfully.",
// //       data: newUser,
// //     });
// //   } catch (err) {
// //     console.error("❌ Registration Error:", err.message);
// //     res.status(500).json({ message: "Server error", error: err.message });
// //   }
// // };
// // // import Entrepreneur from "../models/Entrepreneur.js";
// // // import { sendMail } from "../utils/sendMail.js";
// // // import geoip from "geoip-lite";

// // // /* ---------------- Helpers ---------------- */

// // // function getClientIp(req) {
// // //   // Prefer x-forwarded-for (Render/Proxies), else remoteAddress
// // //   const xf = req.headers["x-forwarded-for"];
// // //   if (xf) return xf.split(",")[0].trim();
// // //   return req.socket.remoteAddress || "";
// // // }

// // // function isLocal(ip) {
// // //   return (
// // //     ip === "::1" ||
// // //     ip === "127.0.0.1" ||
// // //     ip.startsWith("::ffff:127.") ||
// // //     ip.startsWith("192.168.") || // typical LANs
// // //     ip.startsWith("10.") ||
// // //     ip.startsWith("172.16.") ||
// // //     ip.startsWith("172.17.") ||
// // //     ip.startsWith("172.18.") ||
// // //     ip.startsWith("172.19.") ||
// // //     ip.startsWith("172.2") // covers 172.20–172.29
// // //   );
// // // }

// // // async function geoFromApi(ip) {
// // //   try {
// // //     const res = await fetch(`https://ipapi.co/${ip}/json/`);
// // //     const data = await res.json();
// // //     if (data && !data.error) {
// // //       return {
// // //         country: data.country_name || "Unknown",
// // //         region: data.region || "Unknown",
// // //         city: data.city || "Unknown",
// // //         ll: (data.latitude && data.longitude) ? [data.latitude, data.longitude] : []
// // //       };
// // //     }
// // //   } catch (e) {
// // //     console.error("🌍 geo API error:", e.message);
// // //   }
// // //   return null;
// // // }

// // // /* --------------- Controller --------------- */

// // // export const registerEntrepreneur = async (req, res) => {
// // //   try {
// // //     const { fullname, email, mobile, state, district, city, pincode, theme, testIp } = req.body;

// // //     // 1) Validate body
// // //     if (!fullname || !email || !mobile || !state || !district || !city || !pincode) {
// // //       return res.status(400).json({ message: "All fields are required" });
// // //     }

// // //     // 2) Dedup by email
// // //     const exists = await Entrepreneur.findOne({ email });
// // //     if (exists) return res.status(400).json({ message: "Email already registered" });

// // //     // 3) Resolve IP for local testing
// // //     let ip = getClientIp(req);
// // //     if (isLocal(ip)) {
// // //       // For localhost, let you pass a public IP via body for testing
// // //       // Example: "49.205.123.10" (Hyderabad)
// // //       ip = (typeof testIp === "string" && testIp.trim()) ? testIp.trim() : "";
// // //     }

// // //     // 4) Try geoip-lite first
// // //     let geo = (ip && geoip.lookup(ip)) || null;

// // //     // 5) If no result, try free API
// // //     if (!geo) {
// // //       const onlineGeo = ip ? await geoFromApi(ip) : null;
// // //       if (onlineGeo) geo = onlineGeo;
// // //     }

// // //     // 6) Persist (never leave blanks—fall back to form values)
// // //     const newUser = await Entrepreneur.create({
// // //       fullname,
// // //       email,
// // //       mobile,
// // //       state,
// // //       district,
// // //       city,
// // //       pincode,
// // //       location: {
// // //         ip: ip || "local",
// // //         country: geo?.country || "India",         // sensible default for you
// // //         region:  geo?.region  || state,
// // //         city:    geo?.city    || city,
// // //         ll:      geo?.ll      || []
// // //       }
// // //     });

// // //     /* -------- Email (BTPL, dark/light adaptive) -------- */
// // //     const isDark = theme === "dark";
// // //     const logoURL = isDark
// // //       ? "https://www.brihaspathi.com/highbtlogo%20white-%20tm.png"
// // //       : "https://www.brihaspathi.com/highbtlogo%20tm%20(1).png";

// // //     const htmlContent = `
// // //     <!DOCTYPE html>
// // //     <html>
// // //       <head>
// // //         <meta name="color-scheme" content="light dark">
// // //         <meta name="supported-color-schemes" content="light dark">
// // //         <style>
// // //           body { margin:0; padding:0; font-family:Arial,Helvetica,sans-serif; background:#ffffff; color:#07518a; text-align:center; }
// // //           a { color:#07518a; }
// // //           @media (prefers-color-scheme: dark) {
// // //             body { background:#111111 !important; color:#ffffff !important; }
// // //             a { color:#ffffff !important; border-color:#ffffff !important; }
// // //             .btn-main { background:#ffffff !important; color:#07518a !important; }
// // //           }
// // //         </style>
// // //       </head>
// // //       <body>
// // //         <div style="max-width:600px;margin:auto;padding:30px 20px;">
// // //           <img src="${logoURL}" alt="BTPL" style="max-width:180px;margin-bottom:20px;">
// // //           <h2>Thank You for Registering!</h2>
// // //           <p style="font-size:16px;line-height:1.6;">
// // //             Dear <strong>${fullname}</strong>,<br>
// // //             We appreciate your collaboration in our <b>Solar Training Entrepreneurship Program</b>.<br>
// // //             Your registration details have been successfully recorded.
// // //           </p>
// // //           <div style="margin:25px 0;">
// // //             <a href="https://chat.whatsapp.com/DOHjxHWQBjfEHmi8N8iAT4"
// // //                style="display:inline-block;margin:6px;padding:12px 20px;background:#ffffff;
// // //                       border:2px solid #07518a;border-radius:6px;text-decoration:none;
// // //                       font-weight:bold;color:#07518a;">
// // //               <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
// // //                    width="20" height="20" style="vertical-align:middle;margin-right:8px;">
// // //               Join Our WhatsApp Community
// // //             </a>
// // //             <a href="https://www.brihaspathi.com"
// // //                class="btn-main"
// // //                style="display:inline-block;margin:6px;padding:12px 20px;background:#07518a;
// // //                       border:2px solid #07518a;border-radius:6px;text-decoration:none;
// // //                       font-weight:bold;color:#ffffff;">
// // //               🌐 Visit Our Website
// // //             </a>
// // //           </div>
// // //           <p style="font-size:14px;">
// // //             Or copy &amp; paste:
// // //             <a href="https://www.brihaspathi.com" style="text-decoration:underline;">www.brihaspathi.com</a>
// // //           </p>
// // //           <p style="font-size:12px;color:#888;margin-top:25px;">
// // //             © 2025 <b>BTPL</b> (Brihaspathi Technologies Ltd). All rights reserved.
// // //           </p>
// // //         </div>
// // //       </body>
// // //     </html>`;

// // //     await sendMail(
// // //       email,
// // //       "Welcome to BTPL Solar Training Entrepreneurship Program",
// // //       htmlContent
// // //     );

// // //     return res.status(201).json({
// // //       message: "Registration successful. Email sent.",
// // //       data: newUser
// // //     });
// // //   } catch (err) {
// // //     console.error("❌ Registration Error:", err.message);
// // //     return res.status(500).json({ message: "Server error", error: err.message });
// // //   }
// // // };
// import Entrepreneur from "../models/Entrepreneur.js";
// import { sendMail } from "../utils/sendMail.js";

// /* ---------------- Helpers ---------------- */

// function getClientIp(req) {
//   // Prefer x-forwarded-for (Render/Proxies), else remoteAddress
//   const xf = req.headers["x-forwarded-for"];
//   if (xf) return xf.split(",")[0].trim();
//   return req.socket.remoteAddress || "";
// }

// function isLocal(ip = "") {
//   const v4 = ip.startsWith("::ffff:") ? ip.slice(7) : ip;
//   return (
//     !v4 ||
//     v4 === "::1" ||
//     v4 === "127.0.0.1" ||
//     v4.startsWith("192.168.") ||
//     v4.startsWith("10.") ||
//     /^172\.(1[6-9]|2\d|3[0-1])\./.test(v4)
//   );
// }

// async function geoFromApi(ip) {
//   try {
//     const res = await fetch(`https://ipapi.co/${ip}/json/`);
//     const data = await res.json();
//     if (data && !data.error) {
//       return {
//         ip,
//         country: data.country_name || "Unknown",
//         region: data.region || "Unknown",
//         city: data.city || "Unknown",
//         latitude: data.latitude || null,
//         longitude: data.longitude || null,
//       };
//     }
//   } catch (e) {
//     console.error("🌍 geo API error:", e.message);
//   }
//   return null;
// }

// /* ---------------- Controller ---------------- */

// export const registerEntrepreneur = async (req, res) => {
//   try {
//     const { fullname, email, mobile, state, district, city, pincode, testIp, theme } = req.body;

//     if (!fullname || !email || !mobile)
//       return res.status(400).json({ message: "Fullname, email, and mobile are required" });

//     // Check duplicate
//     const exists = await Entrepreneur.findOne({ email });
//     if (exists) return res.status(400).json({ message: "Email already registered" });

//     // Get IP
//     let ip = getClientIp(req);
//     if (isLocal(ip)) ip = testIp || ""; // For local testing

//     // Fetch real-time geo location
//     const geo = ip ? await geoFromApi(ip) : null;

//     // Create record
//     const newUser = await Entrepreneur.create({
//       fullname,
//       email,
//       mobile,
//       formState: state || "",
//       formDistrict: district || "",
//       formCity: city || "",
//       pincode: pincode || "",
//       detectedLocation: {
//         ip: geo?.ip || "local",
//         country: geo?.country || "Unknown",
//         state: geo?.region || "Unknown",
//         district: geo?.city || "Unknown",
//         coordinates: geo?.latitude && geo?.longitude ? [geo.latitude, geo.longitude] : [],
//       },
//       status: "Pending",
//     });

//     /* -------- Email (BTPL, dark/light adaptive) -------- */
//     const isDark = theme === "dark";
//     const logoURL = isDark
//       ? "https://www.brihaspathi.com/highbtlogo%20white-%20tm.png"
//       : "https://www.brihaspathi.com/highbtlogo%20tm%20(1).png";

//     const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta name="color-scheme" content="light dark">
//       <meta name="supported-color-schemes" content="light dark">
//       <style>
//         body {
//           margin: 0;
//           padding: 0;
//           font-family: Arial, Helvetica, sans-serif;
//           background: #ffffff;
//           color: #07518a;
//           text-align: center;
//         }
//         @media (prefers-color-scheme: dark) {
//           body { background: #111111 !important; color: #ffffff !important; }
//         }
//       </style>
//     </head>
//     <body>
//       <div style="max-width:600px;margin:auto;padding:30px 20px;">
//         <img src="${logoURL}" alt="BTPL" style="max-width:180px;margin-bottom:20px;">
//         <h2>Thank You for Registering!</h2>
//         <p style="font-size:16px;line-height:1.6;">
//           Dear <strong>${fullname}</strong>,<br>
//           We have successfully received your registration.<br>
//           Your location was detected as:
//         </p>
//         <div style="font-size:15px;color:#333;margin-top:10px;">
//           📍 <b>${geo?.city || "Unknown"}</b>, ${geo?.region || "Unknown"}, ${geo?.country || "Unknown"}
//         </div>

//         <div style="margin:25px 0;">
//           <a href="https://chat.whatsapp.com/DOHjxHWQBjfEHmi8N8iAT4"
//              style="display:inline-block;margin:6px;padding:12px 20px;background:#fff;
//                     border:2px solid #07518a;border-radius:6px;text-decoration:none;
//                     font-weight:bold;color:#07518a;">
//             <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                  width="20" height="20" style="vertical-align:middle;margin-right:8px;">
//             Join WhatsApp Community
//           </a>
//           <a href="https://www.brihaspathi.com"
//              style="display:inline-block;margin:6px;padding:12px 20px;background:#07518a;
//                     border:2px solid #07518a;border-radius:6px;text-decoration:none;
//                     font-weight:bold;color:#ffffff;">
//             🌐 Visit Our Website
//           </a>
//         </div>

//         <p style="font-size:14px;">
//           Or copy this link: <a href="https://www.brihaspathi.com">www.brihaspathi.com</a>
//         </p>

//         <p style="font-size:12px;color:#888;margin-top:25px;">
//           © 2025 <b>BTPL</b> (Brihaspathi Technologies Ltd). All rights reserved.
//         </p>
//       </div>
//     </body>
//     </html>`;

//     await sendMail(
//       email,
//       "Welcome to BTPL Solar Entrepreneurship Program",
//       html
//     );

//     res.status(201).json({
//       message: "Registration successful. Location detected and email sent.",
//       data: newUser,
//     });
//   } catch (err) {
//     console.error("❌ Registration Error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
import Entrepreneur from "../models/Entrepreneur.js";
import { sendMail } from "../utils/sendMail.js";
import axios from "axios";

/* ==========================================================
   📞 MSISDN Normalizer (India)
   - Returns "91" + 10 digits or null if invalid
========================================================== */
function normalizeMsisdn(raw = "") {
  if (!raw) return null;

  // 1) strip everything non-digit
  let n = String(raw).replace(/[^\d]/g, "");

  // 2) handle common prefixes
  //    0091XXXXXXXXXX, 091XXXXXXXXXX, 0XXXXXXXXXX, 91XXXXXXXXXX, XXXXXXXXXX
  if (n.startsWith("00")) n = n.slice(2);           // 0091...
  if (n.startsWith("0") && !n.startsWith("09")) {
    // single leading 0 for local landline pattern like 0XXXXXXXXXX
    n = n.slice(1);
  }
  if (n.startsWith("091")) n = n.slice(1);          // 091XXXXXXXXXX -> 91XXXXXXXXXX

  // 3) if it already starts with 91 and has extra digits (like 9191XXXXXXXXXX),
  //    keep last 12 (91 + 10 digits).
  if (n.startsWith("91") && n.length > 12) {
    n = n.slice(n.length - 12);
  }

  // 4) Turn 10-digit into 91 + 10
  if (/^\d{10}$/.test(n)) n = `91${n}`;

  // 5) Validate final
  if (/^91\d{10}$/.test(n)) return n;

  return null;
}

/* ==========================================================
   🌐 IP + GEO helpers
========================================================== */
function getClientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (xf) return xf.split(",")[0].trim();
  return req.socket?.remoteAddress || "";
}

function isLocal(ip = "") {
  const v4 = ip.startsWith("::ffff:") ? ip.slice(7) : ip;
  return (
    !v4 ||
    v4 === "::1" ||
    v4 === "127.0.0.1" ||
    v4.startsWith("192.168.") ||
    v4.startsWith("10.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(v4)
  );
}

async function geoFromApi(ip) {
  try {
    if (!ip) return null;
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const d = await res.json();
    if (!d?.error) {
      return {
        ip,
        country: d.country_name || "Unknown",
        state: d.region || "Unknown",
        district: d.city || "Unknown",
        coordinates:
          d.latitude && d.longitude ? [d.latitude, d.longitude] : [],
      };
    }
  } catch (e) {
    console.error("🌍 geoFromApi error:", e.message);
  }
  return null;
}

/* ==========================================================
   💬 SmartPing v2 sender
   - Expects destination as 91XXXXXXXXXX (no +)
========================================================== */
async function sendWhatsAppMessage({ fullName, district, state, msisdn }) {
  const API_URL =
    process.env.SMARTPING_API_URL ||
    "https://backend.api-wa.co/campaign/smartping/api/v2";
  const API_KEY = process.env.SMARTPING_API_TOKEN; // put your long token in .env

  if (!API_KEY) {
    console.warn("⚠️ SMARTPING_API_TOKEN missing — skipping WhatsApp send.");
    return null;
  }

  const payload = {
    apiKey: API_KEY,
    // 👇 must exactly match your approved campaign name in SmartPing
    campaignName: "solar_training",
    destination: msisdn, // already normalized to 91XXXXXXXXXX
    userName: "BRIHASPATHI TECHNOLOGIES PRIVATE LIMITED",
    // map to {{1}}, {{2}}, {{3}} in your template
    templateParams: [fullName || "User", district || "Unknown", state || "Unknown"],
    source: "brihaspathi-website",
    media: {},
    buttons: [],
    carouselCards: [],
    location: {},
    attributes: {},
    paramsFallbackValue: { FirstName: "user" },
  };

  try {
    const { data } = await axios.post(API_URL, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    });
    console.log("✅ SmartPing v2:", data);
    return data;
  } catch (err) {
    console.error("❌ SmartPing v2 error:", err.response?.data || err.message);
    return null;
  }
}

/* ==========================================================
   🚀 POST /api/entrepreneur/register
========================================================== */
export const registerEntrepreneur = async (req, res) => {
  try {
    const {
      fullname,
      email,
      mobile,
      state,
      district,
      city,
      pincode,
      testIp,
      theme,
    } = req.body;

    // required fields
    if (!fullname || !email || !mobile) {
      return res
        .status(400)
        .json({ message: "Fullname, email, and mobile are required." });
    }

    // duplicate check
    const exists = await Entrepreneur.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // normalize mobile → msisdn
    const msisdn = normalizeMsisdn(mobile);
    if (!msisdn) {
      return res.status(400).json({
        message:
          "Invalid mobile number. Enter a 10-digit Indian number or formats like +91xxxxxxxxxx / 0091xxxxxxxxxx.",
      });
    }

    // IP + Geo
    let ip = getClientIp(req);
    if (isLocal(ip)) ip = testIp || "";
    const geo = ip ? await geoFromApi(ip) : null;

    // store record
    const doc = await Entrepreneur.create({
      fullname,
      email,
      mobile, // keep original user input
      formState: state || "",
      formDistrict: district || "",
      formCity: city || "",
      pincode: pincode || "",
      detectedLocation:
        geo || {
          ip: "local",
          country: "Unknown",
          state: "Unknown",
          district: "Unknown",
          coordinates: [],
        },
      status: "Pending",
    });

    // email
    const isDark = theme === "dark";
    const logoURL = isDark
      ? "https://www.brihaspathi.com/highbtlogo%20white-%20tm.png"
      : "https://www.brihaspathi.com/highbtlogo%20tm%20(1).png";

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">

    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
        background: #ffffff;
        color: #07518a;
        text-align: center;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background: #111111 !important;
          color: #ffffff !important;
        }
        a {
          color: #ffffff !important;
        }
      }
      .container {
        max-width: 600px;
        margin: auto;
        padding: 30px 20px;
      }
      .logo {
        max-width: 180px;
        margin-bottom: 20px;
      }
      .btn-primary {
        display: inline-block;
        margin: 6px;
        padding: 12px 20px;
        background: #07518a;
        border: 2px solid #07518a;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        color: #ffffff !important;
      }
      .btn-outline {
        display: inline-block;
        margin: 6px;
        padding: 12px 20px;
        background: #ffffff;
        border: 2px solid #07518a;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        color: #07518a !important;
      }
      .footer {
        font-size: 12px;
        color: #888;
        margin-top: 25px;
      }
    </style>
  </head>

  <body>
    <div class="container">

      <!-- Logo -->
      <img src="${logoURL}" alt="BTPL Logo" class="logo" />

      <!-- Title -->
      <h2>Thank You for Registering!</h2>

      <p style="font-size:16px; line-height:1.6;">
        Dear <strong>${fullname}</strong>,<br/>
        We have successfully received your registration.
      </p>

      <!-- Location Block -->
      <div style="font-size:15px; color:#333; margin-top:10px;">
        📍 <b>${geo?.district || district || "Unknown"}</b>,
        ${geo?.state || state || "Unknown"},
        ${geo?.country || "India"}
      </div>

      <!-- Buttons -->
      <div style="margin: 25px 0;">

        <a 
          href="https://chat.whatsapp.com/DOHjxHWQBjfEHmi8N8iAT4" 
          class="btn-outline"
        >
          Join WhatsApp Community
        </a>

        <a 
          href="https://www.brihaspathi.com" 
          class="btn-primary"
        >
          🌐 Visit Our Website
        </a>

      </div>

      <!-- Footer -->
      <p class="footer">
        © 2025 <b>BTPL</b> (Brihaspathi Technologies Pvt. Ltd.). All rights reserved.
      </p>

    </div>
  </body>
</html>
`;


    await sendMail(
      email,
      "Welcome to BTPL Solar Entrepreneurship Program",
      html
    );

    // WhatsApp (uses normalized msisdn)
    await sendWhatsAppMessage({
      fullName: fullname,
      district,
      state,
      msisdn, // 91XXXXXXXXXX
    });

    return res.status(201).json({
      message: "Registration successful. Email and WhatsApp message sent.",
      data: doc,
    });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
