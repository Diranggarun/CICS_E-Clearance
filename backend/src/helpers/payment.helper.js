import prisma from "../lib/prisma.js";

export const hasUnpaidFines = async (userId) => {
  const fines = await prisma.fine.findFirst({
    where: {
      studentId: userId,
      status: "unpaid",
    },
  });

  return !!fines;
};

export const hasUnpaidFees = async (userId) => {
  const payments = await prisma.payment.findFirst({
    where: {
      userId,
      status: "pending",
    },
  });

  return !!payments;
};
