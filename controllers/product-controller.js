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
  }
}

module.exports = productController