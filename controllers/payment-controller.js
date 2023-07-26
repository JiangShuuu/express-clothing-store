const ecpay_payment = require("ecpay_aio_nodejs");
const { Cart, Order, Orderlist } = require("../models");

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
    const { name, phone, address, total } = req.body;
    const userId = req.user.id;
    console.log('gggg', name, phone, address, total, userId)

    const ecpay = new ecpay_payment(options);
    let base_param = {
      MerchantTradeNo: generateRandomCode(), //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
      MerchantTradeDate: getFormattedDateTime(), //ex: 2017/02/13 15:45:30
      TotalAmount: `${total}`,
      TradeDesc: "測試交易描述1",
      ItemName: "測試商品等",
      ReturnURL: "https://e180-122-100-73-148.ngrok-free.app/notify",
      ClientBackURL: "http://localhost:3000/cart/confirm",
      // ChooseSubPayment: '',
      // OrderResultURL: 'http://192.168.0.1/payment_result',
      // NeedExtraPaidInfo: '1',
      // ClientBackURL: 'https://www.google.com',
      // ItemURL: 'http://item.test.tw',
      // Remark: '交易備註',
      // HoldTradeAMT: '1',
      // StoreID: '',
      CustomField1: `${name}`,
      CustomField2: `${phone}`,
      CustomField3: `${address}`,
      CustomField4: `${userId}`,
    };
    
    let inv_params = {}
    
    const paymentForm = ecpay.payment_client.aio_check_out_credit_onetime(
      (parameters = base_param),
      (invoice = inv_params)
    )
    // const decodedForm = decodeURIComponent(paymentForm);
    res.send(paymentForm);
  },
  notify: (req, res, next) => {
    console.log("Payment notification received:", req.body);

    const {
      CustomField1,
      CustomField2,
      CustomField3,
      CustomField4,
      TradeAmt,
    } = req.body;

    const userInfo = {
      name: CustomField1,
      phone: CustomField2,
      address: CustomField3,
      userId: +CustomField4,
      total: TradeAmt,
    };

    updateUserCart(userInfo, res, next);
  }
};

function updateUserCart (userInfo, res, next) {
  Cart.findAll({
    where: {
      userId: userInfo.userId,
    },
  })
    .then((cart) => {
      if (cart.length < 1) {
        error.code = 400;
        error.message = "購物車沒有任何商品!";
        return next(error);
      }

      Order.create({
        name: userInfo.name,
        phone: userInfo.phone,
        address: userInfo.address,
        total: userInfo.total,
        userId: userInfo.userId,
      }).then((order) => {
        cart.map((item) => {
          Orderlist.create({
            orderId: order.id,
            productId: item.productId,
            productCount: item.productCount,
          });
          item.destroy();
        });
      });
    })
    .then(() => res.json({ status: 200, msg: "成功新增訂單" }))
    .catch((error) => {
      error.code = 500;
      next(error);
    });
}

module.exports = paymentController;