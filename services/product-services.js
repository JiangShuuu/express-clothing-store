const { Product, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const productServices = {
  getProducts: (req, cb) => {
    const categoryId = Number(req.query.categoryId) || ''

    return Promise.all([
      Product.findAll({
        // 若沒raw會拿到sequelize物件
        raw: true,
        nest: true,
        include: [Category],
        where: {  // 新增查詢條件
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        },
      }),
      Category.findAll({
        raw: true
      })
    ])
      .then(([products, categories]) => {
        const data = products.map( item => ({
          ...item,
          description: item.description.substring(0, 50)
        }))
        cb(null, { data, categories })
      })
      .catch(err => cb(err))
  },
  getProduct: (req, cb) => {
    Product.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(product => {
        if (!product) throw new Error ("Product didn't exist!")
        return product.increment('viewCounts')
      })
      .then((product) => cb(null, { product }))
      .catch(err => cb(err))
  },
  postProduct: (req, cb) => {
    const { title, price, og_price, short_intro, description, categoryId } = req.body  
    if (!title) throw new Error('title name is required!')

    const { file } = req
    imgurFileHandler(file)
      .then(filePath => Product.create({ 
        title,
        price,
        og_price,
        short_intro,
        description,
        image: filePath || null,
        categoryId
      }))
      .then((newProduct) => cb(null, { product: newProduct }))
      .catch(err => next(err))
  },
  editProduct: (req, cb) => {
    Promise.all([
      Product.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([product, categories]) => cb(null, { product, categories }))
      .catch(err => cb(err))
  },
  putProduct: (req, cb) => {
    const { title, price, og_price, short_intro, description, categoryId } = req.body
    if (!title) throw new Error('Product title is required!')

    const { file } = req

    Promise.all([
      Product.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([product, filePath]) => {
        if (!product) throw new Error("Product didn't exist!")
        return product.update({
          title,
          price,
          og_price,
          short_intro,
          description,
          image: filePath || product.image,
          categoryId
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

module.exports = productServices