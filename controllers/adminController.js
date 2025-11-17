import Entrepreneur from "../models/Entrepreneur.js";
import DistrictCoordinator from "../models/DistrictCoordinator.js";
import { sendMail } from "../utils/sendMail.js";
// import bcrypt from "bcryptjs";

/* ==========================================================
   🏢 COMPANY CONFIG
========================================================== */
const COMPANY_NAME = "BRIHASPATHI TECHNOLOGIES PRIVATE LIMITED";
const DISTRICT_PORTAL_URL = "https://district.btpl.in/login"; // your coordinator login page
const WHATSAPP_LINK = "https://chat.whatsapp.com/DOHjxHWQBjfEHmi8N8iAT4";

/* ==========================================================
   1️⃣ Create District Coordinator (Admin Only)
========================================================== */
export const createDistrictCoordinator = async (req, res) => {
  try {
    const { fullname, email, mobile, password, district } = req.body;

    if (!fullname || !email || !mobile || !password || !district)
      return res
        .status(400)
        .json({ message: "All fields are required (fullname, email, mobile, password, district)" });

    // Check for existing
    const existing = await DistrictCoordinator.findOne({
      $or: [{ email }, { district }],
    });
    if (existing)
      return res
        .status(400)
        .json({ message: "Email or district already assigned to another coordinator" });

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    const coordinator = await DistrictCoordinator.create({
      fullname,
      email,
      mobile,
      password,
      district,
      
    });

    // Send Email
    await sendMail(
      email,
      `🎉 District Coordinator Access – ${COMPANY_NAME}`,
      `<div style="font-family:Arial;padding:20px;background:#fff;line-height:1.6">
        <h2 style="color:#07518a;">Welcome ${fullname},</h2>
        <p>You have been appointed as the <b>District Coordinator</b> for <b>${district}</b>.</p>
        <p>Your login credentials are as follows:</p>
        <ul>
          <li><b>Username:</b> ${email}</li>
          <li><b>Password:</b> ${password}</li>
        </ul>
        <p>
          <a href="${DISTRICT_PORTAL_URL}" 
             style="display:inline-block;padding:8px 14px;background:#07518a;color:white;
                    text-decoration:none;border-radius:4px;">
             🔗 Login to District Portal
          </a>
        </p>
        <p>Join our WhatsApp Community for communication:<br/>
          <a href="${WHATSAPP_LINK}" style="color:#07518a;">Join BTPL WhatsApp Group</a>
        </p>
        <p>Welcome to <b>${COMPANY_NAME}</b>.</p>
      </div>`
    );

    res.status(201).json({
      message: `✅ District Coordinator for ${district} created successfully`,
      coordinator: {
        id: coordinator._id,
        fullname: coordinator.fullname,
        email: coordinator.email,
        mobile: coordinator.mobile,
        district: coordinator.district,
      },
    });
  } catch (err) {
    console.error("Error creating coordinator:", err);
    res.status(500).json({ message: err.message });
  }
}; 


export const getAllCoordinators = async (req, res) => {
  try {
    const { district, search } = req.query;
    const filter = {};

    if (district) filter.district = new RegExp(`^${district}$`, "i");
    if (search)
      filter.$or = [
        { fullname: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { mobile: new RegExp(search, "i") },
      ];

    const list = await DistrictCoordinator.find(filter).sort({ createdAt: -1 });
    res.json({ count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ==========================================================
   3️⃣ UPDATE Coordinator
========================================================== */

/* ======================================================
   ✏️ Update Coordinator (Admin Panel)
====================================================== */
export const updateCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, mobile, password } = req.body;

    // 1️⃣ Find coordinator
    const coordinator = await DistrictCoordinator.findById(id);
    if (!coordinator)
      return res.status(404).json({ message: "Coordinator not found" });

    const oldEmail = coordinator.email;
    let emailChanged = false;
    let passwordChanged = false;

    // 2️⃣ Validate new email
    if (email && email !== coordinator.email) {
      const existingEmail = await DistrictCoordinator.findOne({ email });
      if (existingEmail)
        return res.status(400).json({ message: "Email already in use" });

      coordinator.email = email;
      emailChanged = true;
    }

    // 3️⃣ Update fields
    coordinator.fullname = fullname || coordinator.fullname;
    coordinator.mobile = mobile || coordinator.mobile;

    // 4️⃣ Handle password update
    if (password && password.trim() !== "") {
      coordinator.password = password.trim(); // will be auto-hashed by pre('save')
      coordinator.passwordChangedAt = new Date();
      passwordChanged = true;
    }

    // 5️⃣ Save updates
    await coordinator.save();

    // 6️⃣ Send Notification Email
    try {
      // Ensure email credentials exist
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("⚠️ EMAIL_USER or EMAIL_PASS missing in environment!");
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Optional: Verify connection
      transporter.verify((err, success) => {
        if (err) console.error("🚫 Mail Transport Error:", err);
        else console.log("✅ Mail transporter ready:", success);
      });

      const COMPANY_NAME = "Solar Energy Portal";
      const DISTRICT_PORTAL_URL = "https://district.solarenergyportal.in";
      const WHATSAPP_LINK = "https://chat.whatsapp.com/ExampleInviteLink";

      // --- EMAIL CHANGED ---
      if (emailChanged) {
        const subject = `🎉 District Coordinator Access – ${COMPANY_NAME}`;
        const html = `
          <div style="font-family:Arial;padding:20px;line-height:1.6">
            <h2 style="color:#07518a;">Welcome ${coordinator.fullname},</h2>
            <p>You have been appointed as the <b>District Coordinator</b> for <b>${coordinator.district}</b>.</p>
            <p>Your login credentials are as follows:</p>
            <ul>
              <li><b>Username:</b> ${coordinator.email}</li>
              <li><b>Password:</b> ${password || "Set by Admin"}</li>
            </ul>
            <p>
              <a href="${DISTRICT_PORTAL_URL}"
                 style="display:inline-block;padding:8px 14px;background:#07518a;color:white;
                        text-decoration:none;border-radius:4px;">
                 🔗 Login to District Portal
              </a>
            </p>
            <p>Join our WhatsApp Community:<br/>
              <a href="${WHATSAPP_LINK}" style="color:#07518a;">Join BTPL WhatsApp Group</a>
            </p>
            <p>Welcome to <b>${COMPANY_NAME}</b>.</p>
          </div>
        `;

        await transporter.sendMail({
          from: `"${COMPANY_NAME}" <${process.env.EMAIL_USER}>`,
          to: coordinator.email,
          subject,
          html,
        });

        console.log(`✅ Sent new credentials to ${coordinator.email}`);
      }

      // --- PASSWORD CHANGED ---
      else if (passwordChanged) {
        const subject = "🔐 Your Coordinator Password Has Been Updated";
        const html = `
          <div style="font-family:Arial;padding:20px;line-height:1.6">
            <h3 style="color:#07518a;">Hello ${coordinator.fullname},</h3>
            <p>Your login password for <b>${COMPANY_NAME}</b> has been updated successfully.</p>
            <p>If you did not request this change, please contact the admin immediately.</p>
            <p>Thank you,<br/><b>Solar Energy Admin Team</b></p>
          </div>
        `;

        await transporter.sendMail({
          from: `"${COMPANY_NAME}" <${process.env.EMAIL_USER}>`,
          to: oldEmail,
          subject,
          html,
        });

        console.log(`✅ Password update email sent to ${oldEmail}`);
      }

      // --- INFO UPDATED ONLY ---
      else {
        const subject = "✅ Your Coordinator Profile Has Been Updated";
        const html = `
          <div style="font-family:Arial;padding:20px;line-height:1.6">
            <h3 style="color:#07518a;">Hello ${coordinator.fullname},</h3>
            <p>Your coordinator profile has been successfully updated.</p>
            <ul>
              <li><b>Name:</b> ${coordinator.fullname}</li>
              <li><b>Email:</b> ${coordinator.email}</li>
              <li><b>Mobile:</b> ${coordinator.mobile}</li>
              <li><b>District:</b> ${coordinator.district}</li>
            </ul>
            <p>Thank you,<br/><b>Solar Energy Admin Team</b></p>
          </div>
        `;

        await transporter.sendMail({
          from: `"${COMPANY_NAME}" <${process.env.EMAIL_USER}>`,
          to: coordinator.email,
          subject,
          html,
        });

        console.log(`ℹ️ Info update email sent to ${coordinator.email}`);
      }
    } catch (mailErr) {
      console.error("⚠️ Email sending failed:", mailErr.message);
    }

    // ✅ 7️⃣ Send response
    res.json({
      message: "✅ Coordinator updated successfully",
      changes: { emailChanged, passwordChanged },
      coordinator,
    });
  } catch (err) {
    console.error("❌ Update Coordinator Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ==========================================================
   4️⃣ DELETE Coordinator
========================================================== */
export const deleteCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const coordinator = await DistrictCoordinator.findByIdAndDelete(id);
    if (!coordinator)
      return res.status(404).json({ message: "Coordinator not found" });

    res.json({ message: "🗑️ Coordinator deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ==========================================================
   2️⃣ Get all / Filtered Entrepreneurs
========================================================== */
export const getEntrepreneurs = async (req, res) => {
  try {
    const { district, status, search } = req.query;
    const filter = {};

    if (district) filter.formDistrict = new RegExp(`^${district}$`, "i");
    if (status) filter.status = status;
    if (search)
      filter.$or = [
        { fullname: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { mobile: new RegExp(search, "i") },
      ];

    const list = await Entrepreneur.find(filter).sort({ createdAt: -1 });
    const data = list.map((e) => ({
      ...e._doc,
      state: e.formState,
      district: e.formDistrict,
    }));

    res.json({ count: data.length, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ==========================================================
   3️⃣ Approve / Reject / Pending
========================================================== */
export const approveEntrepreneur = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Entrepreneur.findById(id);
    if (!user) return res.status(404).json({ message: "Entrepreneur not found" });

    user.status = "Accepted";
    await user.save();

    await sendMail(
      user.email,
      "✅ Registration Approved",
      `<div style="font-family:Arial;background:#fff;padding:20px;">
        <h2 style="color:#07518a;">Congratulations ${user.fullname}! 🎉</h2>
        <p>Your registration as a <b>Solar Entrepreneur</b> has been approved.</p>
        <p>Region: ${user.formDistrict}, ${user.formState}</p>
        <p>Welcome to ${COMPANY_NAME}.</p>
        <p><a href="${WHATSAPP_LINK}">Join BTPL WhatsApp Group</a></p>
      </div>`
    );

    res.json({ message: "Entrepreneur approved successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectEntrepreneur = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const user = await Entrepreneur.findById(id);
    if (!user) return res.status(404).json({ message: "Entrepreneur not found" });

    user.status = "Rejected";
    await user.save();

    await sendMail(
      user.email,
      "❌ Application Not Approved",
      `<div style="font-family:Arial;background:#fff;padding:20px;">
        <p>Dear ${user.fullname},</p>
        <p>Your Solar Entrepreneur application from ${user.formDistrict}, ${user.formState} was not approved.</p>
        <p><b>Reason:</b> ${reason || "Criteria not met this time."}</p>
        <p>Stay connected with ${COMPANY_NAME} for future opportunities.</p>
      </div>`
    );

    res.json({ message: "Entrepreneur rejected successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markPending = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Entrepreneur.findById(id);
    if (!user) return res.status(404).json({ message: "Entrepreneur not found" });

    user.status = "Pending";
    await user.save();

    res.json({ message: "Entrepreneur marked as pending", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ==========================================================
   4️⃣ Bulk Approve / Reject / Delete
========================================================== */
export const bulkApprove = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids?.length)
      return res.status(400).json({ message: "IDs array required" });

    const users = await Entrepreneur.find({ _id: { $in: ids } });
    for (const user of users) {
      user.status = "Accepted";
      await user.save();
      await sendMail(
        user.email,
        "✅ Registration Approved",
        `<div style="font-family:Arial;background:#fff;padding:20px;">
          <h2 style="color:#07518a;">Congratulations ${user.fullname}! 🎉</h2>
          <p>Your registration as a <b>Solar Entrepreneur</b> has been approved.</p>
          <p>Region: ${user.formDistrict}, ${user.formState}</p>
          <p>Welcome to ${COMPANY_NAME}.</p>
        </div>`
      );
    }

    res.json({ message: `✅ Approved ${users.length} entrepreneurs.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const bulkReject = async (req, res) => {
  try {
    const { ids, reason } = req.body;
    if (!ids?.length)
      return res.status(400).json({ message: "IDs array required" });

    const users = await Entrepreneur.find({ _id: { $in: ids } });
    for (const user of users) {
      user.status = "Rejected";
      await user.save();
      await sendMail(
        user.email,
        "❌ Application Not Approved",
        `<div style="font-family:Arial;background:#fff;padding:20px;">
          <p>Dear ${user.fullname},</p>
          <p>Your Solar Entrepreneur application from ${user.formDistrict}, ${user.formState} was not approved.</p>
          <p><b>Reason:</b> ${reason || "Criteria not met this time."}</p>
          <p>Stay connected with ${COMPANY_NAME} for future opportunities.</p>
        </div>`
      );
    }

    res.json({ message: `❌ Rejected ${users.length} entrepreneurs.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids?.length)
      return res.status(400).json({ message: "IDs array required" });

    const result = await Entrepreneur.deleteMany({ _id: { $in: ids } });
    res.json({ message: `🗑️ Deleted ${result.deletedCount} entrepreneurs.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ==========================================================
   5️⃣ Delete Single Entrepreneur
========================================================== */
export const deleteEntrepreneur = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Entrepreneur.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "Entrepreneur not found" });

    res.json({ message: "Entrepreneur deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ==========================================================
   6️⃣ District Stats
========================================================== */
export const getDistrictStats = async (_req, res) => {
  try {
    const districts = [
     "Alluri Sitarama Raju", "Anakapalli", "Anantapur", "Annamayya", "Bapatla",
  "Chittoor", "East Godavari", "Eluru", "Guntur", "Kakinada", "Konaseema",
  "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam",
  "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Srikakulam",
  "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"
    ];

    const stats = await Promise.all(
      districts.map(async (dist) => {
        const total = await Entrepreneur.countDocuments({ formDistrict: dist });
        const accepted = await Entrepreneur.countDocuments({ formDistrict: dist, status: "Accepted" });
        const rejected = await Entrepreneur.countDocuments({ formDistrict: dist, status: "Rejected" });
        const pending = await Entrepreneur.countDocuments({ formDistrict: dist, status: "Pending" });
        return { district: dist, total, accepted, rejected, pending };
      })
    );

    res.json({ totalDistricts: stats.length, stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
