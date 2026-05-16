import express from "express";
import {
  createPayment,
  getPayments,
  approvePayment,
} from "./payment.controller.js";

import { upload } from "../../lib/upload.js";
import { requireRole } from "../../middleware/requireRole.js";
import { requireAuth } from "../../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, createPayment);
router.get("/", requireAuth, getPayments);

router.put(
  "/:id/approve",
  requireAuth,
  requireRole("bytes_officer"),
  approvePayment
);

router.post(
  "/upload",
  requireAuth,
  upload.single("receipt"),
  (req, res) => {
    res.json({ file: req.file.filename });
  }
);

export default router;
