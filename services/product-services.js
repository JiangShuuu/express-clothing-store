const { Product } = require('../models')

const productController = {
  getProducts: (req, cb) => {
    Product.findAll({
      // 若沒raw會拿到sequelize物件
      raw: true
    })
      .then(items => cb(null, { items }))
      .catch(err => cb(err))
  },
}

module.exports = productController