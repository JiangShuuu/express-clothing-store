const ecpay_payment = require("ecpay_aio_nodejs");
const ecpay_logistics = require("ecpay_logistics_nodejs");

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
      ReturnURL: `${process.env.ECPAY_RETURN_URL}/notify`,
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
    // logistics(req, res, next);
    shoplogistics(req, res, next);
  },
  receiverServerReply:(req, res, next) => {
    console.log('ReceiveServerReply', req.body)
    // 處理地圖確認跳轉回訂單頁
    res.json({ status: 200, data: req.body });
  },
  // 列印物流單
  printReceive:(req, res, next) => {
    let base_param = {
      AllPayLogisticsID: "2279484", // 請帶20碼uid, ex: 84851681561813188188, 為Create時所得到的物流交易編號
      CVSPaymentNo: "D8450853", // 請帶15碼uid, ex: 848516815618131, 為Create時所得到的寄貨編號
      CVSValidationNo: "6203", // 請帶10碼uid, ex: 8485168156, 為Create時所得到的驗證碼
      PlatformID: "",
    };

    let create = new ecpay_logistics();
    let response = create.c2c_process_client.printunimartc2corderinfo(
      (parameters = base_param)
    );
    if (typeof response === "string") {
      res.send(response);
      console.log("response", response);
    } else {
      response
        .then(function (result) {
          
          res.json({ status: 200, data: result });
        })
        .catch(function (err) {
          res.json({ status: 500, data: err });
        });
    }
    
  },
  // 獲得地圖 暫時有問題
  getmap:(req, res, next) => {
    let base_param = {
      MerchantTradeNo: generateRandomCode(), // 請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
      ServerReplyURL: `${process.env.ECPAY_RETURN_URL}/receiverReply`, // 物流狀況會通知到此URL
      LogisticsType: "CVS",
      LogisticsSubType: "UNIMARTC2C",
      IsCollection: "N",
      ExtraData: "",
      Device: "",
    };

    let create = new ecpay_logistics();
    let response = create.query_client.expressmap((parameters = base_param));
    if (typeof response === "string") {
       res.send(response);
    } else {
      response
        .then(function (result) {
          console.log(result);
          res.json({ status: 200, data: result });
        })
        .catch(function (err) {
          console.log(err);
          res.json({ status: 200, data: result });
        });
    }
  }
};

function logistics (req, res, next) {
  let base_param = {
    MerchantTradeNo: generateRandomCode(), // 請帶20碼uid, ex: f0a0d7e9fae1bb72bc93, 為aiocheckout時所產生的
    MerchantTradeDate: getFormattedDateTime(), // 請帶交易時間, ex: 2017/05/17 16:23:45, 為aiocheckout時所產生的
    LogisticsType: "Home",
    LogisticsSubType: "TCAT",
    GoodsAmount: "100",
    CollectionAmount: "N",
    IsCollection: "N",
    GoodsName: "123435",
    SenderName: "綠界寄送者",
    SenderPhone: "0912697801",
    SenderCellPhone: "0912345678",
    ReceiverName: "綠界收件者",
    ReceiverPhone: "0912697801",
    ReceiverCellPhone: "0912345678",
    ReceiverEmail: "globelex65@gmail.com",
    TradeDesc: "",
    ServerReplyURL: `${process.env.ECPAY_RETURN_URL}/receiverReply`, // 物流狀況會通知到此URL
    ClientReplyURL: "",
    LogisticsC2CReplyURL: "",
    Remark: "",
    PlatformID: "",
    SenderZipCode: "115",
    SenderAddress: "台北市南港區三重路19-1號6-1樓",
    ReceiverZipCode: "115",
    ReceiverAddress: "台北市南港區三重路19-1號6-1樓",
    Temperature: "0001",
    Distance: "00",
    Specification: "0001",
    ScheduledPickupTime: "4",
    ScheduledDeliveryTime: "4",
    ScheduledDeliveryDate: "",
    PackageCount: "",
  };

  let create = new ecpay_logistics();

  let response = create.create_client.create((parameters = base_param));

  if (typeof response === "string") {
    console.log("response", response);
  } else {
    response
      .then((result) => {
        console.log("result", result);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
}

function shoplogistics (req, res, next) {
  let base_param = {
    MerchantTradeNo: generateRandomCode(), // 請帶20碼uid, ex: f0a0d7e9fae1bb72bc93, 為aiocheckout時所產生的
    MerchantTradeDate: getFormattedDateTime(), // 請帶交易時間, ex: 2017/05/17 16:23:45, 為aiocheckout時所產生的
    LogisticsType: "CVS",
    LogisticsSubType: "UNIMARTC2C", //UNIMART、FAMI、HILIFE、UNIMARTC2C、FAMIC2C、HILIFEC2C、OKMARTC2C
    GoodsAmount: "200",
    CollectionAmount: "200",
    IsCollection: "",
    GoodsName: "test",
    SenderName: "綠界科技",
    SenderPhone: "29788833",
    SenderCellPhone: "0912345678",
    ReceiverName: "綠界科技",
    ReceiverPhone: "0229768888",
    ReceiverCellPhone: "0912345678",
    ReceiverEmail: "tesy@gmail.com",
    TradeDesc: "",
    ServerReplyURL: `${process.env.ECPAY_RETURN_URL}/receiverReply`, // 物流狀況會通知到此URL
    ClientReplyURL: "",
    LogisticsC2CReplyURL: `${process.env.ECPAY_RETURN_URL}/receiverReply`,
    Remark: "",
    PlatformID: "",
    ReceiverStoreID: "111278", // 請帶收件人門市代號(統一):991182  測試商店代號(全家):001779 測試商店代號(萊爾富):2001、F227
    ReturnStoreID: "",
  };

  let create = new ecpay_logistics();
  let response = create.create_client.create((parameters = base_param));
  if (typeof response === "string") {
    console.log("response", response);
  } else {
    response
      .then(function (result) {
        console.log('result', result);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
}

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