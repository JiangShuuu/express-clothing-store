const adminServices = require('../services/admin-services')

const adminController = {
  // User
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  patchUser: (req, res, next) => {
    adminServices.patchUser(req, (err) => err ? next(err) : res.json({ status: 'success 成功修改權限!' }))
  },

  // Category
  getCategories: (req, res, next) => {
    adminServices.getCategories(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postCategory: (req, res, next) => {
    adminServices.postCategory(req, (err) => err ? next(err) : res.json({ status: 'success 成功建立類別' }))
  },
  putCategory: (req, res, next) => {
    adminServices.putCategory(req, err => err ? next(err) : res.json({ status: 'success 成功修改類別' }))
  },
  deleteCategory: (req, res, next) => {
    adminServices.deleteCategory(req, err => err ? next(err) : res.json({ status: 'success 成功刪除類別' }))
  },

  // Products
  getProducts: (req, res, next) => {
    adminServices.getProducts(req, (err, data) => err ? next(err) : res.json({ status: 'success getAll', data }))
  },
}

module.exports = adminController