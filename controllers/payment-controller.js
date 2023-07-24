const paymentServices = require("../services/payment-services");

const ecpay_payment = require("ecpay_aio_nodejs");

const options = {
  OperationMode: "Test", //Test or Production
  MercProfile: {
    MerchantID: process.env.MERCHANTID,
    HashKey: process.env.HASHKEY,
    HashIV: process.env.HASHIV,
  },
  IgnorePayment: [
    //    "Credit",
    //    "WebATM",
    //    "ATM",
    //    "CVS",
    //    "BARCODE",
    //    "AndroidPay"
  ],
  IsProjectContractor: false,
};

let base_param = {
  MerchantTradeNo: "ORDER_NO_123452123216", //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
  MerchantTradeDate: "2023/07/24 10:33:00", //ex: 2017/02/13 15:45:30
  TotalAmount: "1000",
  TradeDesc: "測試交易描述",
  ItemName: "測試商品等",
  ReturnURL: "http://localhost:8888/notify",
  ClientBackURL: "http://localhost:3000",
  // ChooseSubPayment: '',
  // OrderResultURL: 'http://192.168.0.1/payment_result',
  // NeedExtraPaidInfo: '1',
  // ClientBackURL: 'https://www.google.com',
  // ItemURL: 'http://item.test.tw',
  // Remark: '交易備註',
  // HoldTradeAMT: '1',
  // StoreID: '',
  // CustomField1: '',
  // CustomField2: '',
  // CustomField3: '',
  // CustomField4: ''
};

let inv_params = {}

const paymentController = {
  payment: (req, res, next) => {
    const ecpay = new ecpay_payment(options);
    const paymentForm = ecpay.payment_client.aio_check_out_credit_onetime(
      (parameters = base_param),
      (invoice = inv_params)
    );
    // const decodedForm = decodeURIComponent(paymentForm);
    res.send(paymentForm);
  },
  notify: (req, res, next) => {
    paymentServices.notify(req, (err, data) =>
      err ? next(err) : res.json({ status: "success payment", data })
    );
  }
};

module.exports = paymentController;