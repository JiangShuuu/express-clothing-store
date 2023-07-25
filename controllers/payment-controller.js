const paymentServices = require("../services/payment-services");

const ecpay_payment = require("ecpay_aio_nodejs");

function generateRandomCode() {
  const randomCode = Array.from({ length: 20 }, () => Math.random().toString(36)[2]).join('');
  return randomCode;
}
function getFormattedDateTime() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}
function generateRandomAmount() {
  const minAmount = 1000;
  const maxAmount = 9999;
  return Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;
}

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

const paymentController = {
  payment: (req, res, next) => {
    console.log('req', req.body)
    const ecpay = new ecpay_payment(options);
    let base_param = {
      MerchantTradeNo: generateRandomCode(), //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
      MerchantTradeDate: getFormattedDateTime(), //ex: 2017/02/13 15:45:30
      TotalAmount: `${generateRandomAmount()}`,
      TradeDesc: "測試交易描述1",
      ItemName: "測試商品等",
      ReturnURL: "https://0707-60-251-45-137.ngrok-free.app/notify",
      ClientBackURL: "https://www.google.com",
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
    const paymentForm = ecpay.payment_client.aio_check_out_credit_onetime(
      (parameters = base_param),
      (invoice = inv_params)
    );
    // const decodedForm = decodeURIComponent(paymentForm);
    res.send(paymentForm);
  },
  notify: (req, res, next) => {
    console.log('PAYMENTPAYMENTPAYMENTPAYMENTPAYMENT')
    paymentServices.notify(req, (err, data) =>
      err ? next(err) : res.json({ status: "success payment", data })
    );
  }
};

module.exports = paymentController;