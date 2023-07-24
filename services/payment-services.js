const ecpay_payment = require("ecpay_aio_nodejs");
// 設定 ECpay 商家資訊
const ecpayConfig = {
  MerchantID: process.env.MERCHANTID, // 替換成你的商家ID
  HashKey: process.env.HASHKEY, // 替換成你的HashKey
  HashIV: process.env.HASHIV, // 替換成你的HashIV
  ReturnURL: "http://localhost:8888/notify", // 替換成你的回傳URL
  ClientBackURL: "http://localhost:3000", // 替換成你的Client端返回URL
};

const paymentServices = {
  payment: (req, cb) => {
    console.log("ecpay_payment", ecpay_payment);
    const ecpay = new ecpay_payment();
    console.log("getecpay", ecpay);

    // 設定付款資訊
    const orderParams = {
      MerchantTradeNo: "ORDER_NO_123456", // 訂單編號，請自行生成唯一的訂單號碼
      MerchantTradeDate: "2023/07/24 10:30:00",
      TotalAmount: 1000, // 付款金額
      TradeDesc: "Test Order",
      ItemName: "測試商品01",
    };

    // 產生綠界金流表單，並導向到支付頁面
    // 設定付款方式
    const paymentMethod = "Credit"; // 使用信用卡付款

    console.log("getorderParams", orderParams);
    const paymentForm = ecpay.payment_client.aio_check_out_credit_onetime(
      orderParams,
      paymentMethod,
      ecpayConfig
    );

    console.log("getpaymentForm", paymentForm);

    // res.send(paymentForm);
    cb(null, { data: paymentForm });
  },
  notify: (req, cb) => {
    console.log("Payment notification received:", req.body);
    cb(null, { data: req.body });
  },
};

module.exports = paymentServices;
