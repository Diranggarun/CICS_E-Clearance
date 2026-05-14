import express from "express";
import prisma from "../../lib/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { studentId, amount, reason } = req.body;

  const fine = await prisma.fine.create({
    data: { studentId, amount, reason, status: "unpaid" },
  });

  res.json(fine);
});

router.get("/:studentId", async (req, res) => {
  const fines = await prisma.fine.findMany({
    where: { studentId: req.params.studentId },
  });

  res.json(fines);
});

router.put("/:id", async (req, res) => {
  const fine = await prisma.fine.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.json(fine);
});

export default router;
