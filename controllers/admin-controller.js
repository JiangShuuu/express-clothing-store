const adminServices = require('../services/admin-services')

const adminController = {
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  patchUser: (req, res, next) => {
    adminServices.patchUser(req, (err) => err ? next(err) : res.json({ status: 'success 成功修改權限!' }))
  },
  getCategories: (req, res, next) => {
    adminServices.getCategories(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = adminController