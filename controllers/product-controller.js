const productServices = require('../services/product-services')

const productController = {
  getProducts: (req, res, next) => {
    productServices.getProducts(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getProduct: (req, res, next) => {
    productServices.getProduct(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postProduct: (req, res, next) => {
    productServices.postProduct(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  editProduct: (req, res, next) => {
    productServices.editProduct(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  putProduct: (req, res, next) => {
    productServices.putProduct(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteProduct: (req, res, next) => {
    productServices.deleteProduct(req, err => err ? next(err) : res.json({ status: 'success' }))
  }
}

module.exports = productController