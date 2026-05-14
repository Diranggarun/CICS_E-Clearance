import express from "express";
import prisma from "../../lib/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const fee = await prisma.fee.create({ data: req.body });
  res.json(fee);
});

router.get("/", async (_req, res) => {
  const fees = await prisma.fee.findMany();
  res.json(fees);
});

export default router;
