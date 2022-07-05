const { Product } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const productController = {
  getProducts: (req, cb) => {
    Product.findAll({
      // 若沒raw會拿到sequelize物件
      raw: true
    })
      .then(products => cb(null, { products }))
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

    const { file } = req
    localFileHandler(file)
      .then(filePath => Product.create({ 
        title,
        price,
        og_price,
        short_intro,
        description,
        image: filePath || null
      }))
      .then((newProduct) => cb(null, { product: newProduct }))
      .catch(err => next(err))
  },
  editProduct: (req, cb) => {
    Product.findByPk(req.params.id, { 
      raw: true 
    })
      .then(product => cb(null, { product }))
      .catch(err => cb(err))
  },
  putProduct: (req, cb) => {
    const { title, price, og_price, short_intro, description } = req.body
    if (!title) throw new Error('Product title is required!')

    const { file } = req

    Promise.all([
      Product.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([product, filePath]) => {
        if (!product) throw new Error("Product didn't exist!")
        return product.update({
          title,
          price,
          og_price,
          short_intro,
          description,
          image: filePath || product.image
        })
      })
      .then((updateProduct) => cb(null, {product: updateProduct}))
      .catch(err => cb(err))
  },
  deleteProduct: (req, cb) => {
    return Product.findByPk(req.params.id)
      .then(product => {
        if (!product) throw new Error("Product didn't exist!")
        return product.destroy()
      })
      .then(() => cb(null))
      .catch(err => cb(err))
  }
}

module.exports = productController