// routes/districtRoutes.js
import express from "express";
import {
  getEntrepreneursByDistrict,
  approveEntrepreneurDistrict,
  rejectEntrepreneurDistrict,
  markPendingDistrict,
  bulkApproveDistrict,
  bulkRejectDistrict,
  bulkDeleteDistrict,
  getDistrictStatsByCoordinator,
} from "../controllers/districtCoordinatorController.js"; // ✅ correct file

import { verifyToken } from "../middleware/authMiddleware.js"; // ✅ middleware

const router = express.Router();

// All endpoints require auth
router.get("/entrepreneursfetch", verifyToken, getEntrepreneursByDistrict);
router.put("/approve/:id", verifyToken, approveEntrepreneurDistrict);
router.put("/reject/:id", verifyToken, rejectEntrepreneurDistrict);
router.put("/pending/:id", verifyToken, markPendingDistrict);

router.put("/bulk-approve", verifyToken, bulkApproveDistrict);
router.put("/bulk-reject", verifyToken, bulkRejectDistrict);
router.delete("/bulk-delete", verifyToken, bulkDeleteDistrict);

router.get("/stats", verifyToken, getDistrictStatsByCoordinator);

export default router;
