const paymentServices = require("../services/payment-services");

const paymentController = {
  payment: (req, res, next) => {
    paymentServices.payment(req, (err, data) =>
      err ? next(err) : res.json({ status: "success create", data })
    );
  },
};

module.exports = paymentController;