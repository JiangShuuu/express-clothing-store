const userServices = require('../services/user-services')

const userController = {
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) => err ? next(err) : res.json({ status: 'success, 成功登入', data }))
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success, 成功註冊帳號!', data }))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.json({ status: 'success, 獲取 User 資料', data }))
  },
  editUser: (req, res, next) => {
    userServices.editUser(req, (err, data) => err ? next(err) : res.json({ status: 'success getEdit', data }))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, (err, data) => err ? next(err) : res.json({ status: 'success 修改 User 資料', data }))
  },
  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, err => err ? next(err) : res.json({ status: 'success 加入最愛' }))
  },
  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, err => err ? next(err) : res.json({ status: 'success 移除最愛' }))
  }
}
module.exports = userController