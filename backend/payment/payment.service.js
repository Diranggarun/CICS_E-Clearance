const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// FINES
exports.addFine = (data) => prisma.fine.create({ data });

exports.getFines = (studentId) =>
    prisma.fine.findMany({ where: { studentId } });

exports.updateFine = (id, data) =>
    prisma.fine.update({ where: { id: Number(id) }, data });

// FEES
exports.addFee = (data) => prisma.fee.create({ data });
exports.getFees = () => prisma.fee.findMany();

// PAYMENT
exports.payFine = (data) =>
    prisma.payment.create({ data });

exports.confirmPayment = async (id) => {
    const payment = await prisma.payment.update({
        where: { id: Number(id) },
        data: { status: "CONFIRMED" }
    });

    await prisma.fine.update({
        where: { id: payment.fineId },
        data: { status: "PAID" }
    });

    return payment;
};
