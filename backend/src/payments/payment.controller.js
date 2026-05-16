import prisma from "../lib/prisma.js";

export const createPayment = async (req, res) => {
  try {
    const { userId, amount, method } = req.body;

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        method,
        status: "pending",
      },
    });

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPayments = async (req, res) => {
  const payments = await prisma.payment.findMany();
  res.json(payments);
};

export const approvePayment = async (req, res) => {
  const { id } = req.params;

  const payment = await prisma.payment.update({
    where: { id },
    data: { status: "approved" },
  });

  await prisma.fine.updateMany({
    where: { studentId: payment.userId },
    data: { status: "paid" },
  });

  res.json(payment);
};
