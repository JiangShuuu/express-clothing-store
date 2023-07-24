const paymentServices = {
  payment: (req, cb) => {
    cb(null, { user: '安安' });
  },
};

module.exports = paymentServices;
