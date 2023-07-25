// const ecpay_payment = require("ecpay_aio_nodejs");
// 棄用中, 直接寫在 controller

const paymentServices = {
  payment: (req, cb) => {
    cb(null, { data: paymentForm });
  },
  notify: (req, cb) => {
    cb(null, { data: req.body });
  },
};

module.exports = paymentServices;
