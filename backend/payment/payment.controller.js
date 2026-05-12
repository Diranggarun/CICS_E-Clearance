const service = require('./payment.service');

exports.addFine = async (req, res) => {
    const data = await service.addFine(req.body);
    res.json(data);
};

exports.getFines = async (req, res) => {
    const data = await service.getFines(req.params.studentId);
    res.json(data);
};

exports.updateFine = async (req, res) => {
    const data = await service.updateFine(req.params.id, req.body);
    res.json(data);
};

// FEES
exports.addFee = async (req, res) => {
    const data = await service.addFee(req.body);
    res.json(data);
};

exports.getFees = async (req, res) => {
    const data = await service.getFees();
    res.json(data);
};

// PAYMENT
exports.payFine = async (req, res) => {
    const data = await service.payFine(req.body);
    res.json(data);
};

exports.confirmPayment = async (req, res) => {
    const data = await service.confirmPayment(req.params.id);
    res.json(data);
};
