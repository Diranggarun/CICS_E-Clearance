import express from "express";
import {
  createPayment,
  getPayments,
  approvePayment,
} from "./payment.controller.js";

import { upload } from "../../lib/upload.js";

const router = express.Router();

router.post("/", createPayment);
router.get("/", getPayments);
router.put("/:id/approve", approvePayment);

router.post("/upload", upload.single("receipt"), (req, res) => {
  res.json({ file: req.file.filename });
});

export default router;
