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
  getProduct: (req, cb) => {
    Product.findByPk(req.params.id, {
      raw: true
    })
      .then(product => {
        if (!product) throw new Error ("Product didn't exist!")
        cb(null, { product })
      })
      .catch(err => cb(err))
  },
  postProduct: (req, cb) => {
    const { title, price, og_price, short_intro, description } = req.body  
    if (!title) throw new Error('title name is required!')

    Product.create({ 
      title,
      price,
      og_price,
      short_intro,
      description
    })
      .then((newProduct) => cb(null, { product: newProduct }))
      .catch(err => next(err))
  }
}

module.exports = productController