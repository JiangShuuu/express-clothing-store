// controllers/user-controller.js
const userServices = require('../services/user-services')

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success, 成功註冊帳號!', data }))
  }
}
module.exports = userController