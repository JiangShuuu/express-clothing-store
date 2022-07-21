const productServices = require('../services/product-services')

const productController = {
  getProducts: (req, res, next) => {
    productServices.getProducts(req, (err, data) => err ? next(err) : res.json({ status: 'success getAll', data }))
  },
  getProduct: (req, res, next) => {
    productServices.getProduct(req, (err, data) => err ? next(err) : res.json({ status: 'success get', data }))
  },
  postProduct: (req, res, next) => {
    productServices.postProduct(req, (err, data) => err ? next(err) : res.json({ status: 'success create', data }))
  },
  editProduct: (req, res, next) => {
    productServices.editProduct(req, (err, data) => err ? next(err) : res.json({ status: 'success getEdit', data }))
  },
  putProduct: (req, res, next) => {
    productServices.putProduct(req, (err, data) => err ? next(err) : res.json({ status: 'success edit', data }))
  },
  deleteProduct: (req, res, next) => {
    productServices.deleteProduct(req, err => err ? next(err) : res.json({ status: 'success del' }))
  },
  getFeeds: (req, res, next) => {
    productServices.getFeeds(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = productController