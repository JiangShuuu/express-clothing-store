const { Product, Category, Comment, User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const productServices = {
  getProducts: (req, cb) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Product.findAndCountAll({
        // 若沒raw會拿到sequelize物件
        raw: true,
        nest: true,
        include: [Category],
        limit,
        offset,
        where: {  // 新增查詢條件
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        },
      }),
      Category.findAll({
        raw: true
      })
    ])
      .then(([products, categories]) => {
        const FavoritedProductsId = req.user && req.user.FavoritedProducts.map(fr => fr.id)
        const CartProductsId = req.user && req.user.CartProducts.map(fr => fr.id)

        const data = products.rows.map( item => ({
          ...item,
          description: item.description.substring(0, 50),
          isFavorited: FavoritedProductsId.includes(item.id),
          isCart: CartProductsId.includes(item.id)
        }))
        cb(null, { 
          data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, products.count)
        })
      })
      .catch(err => cb(err))
  },
  getProduct: (req, cb) => {
    return Product.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'CartUsers'}
      ]
    })
      .then(product => {
        if (!product) throw new Error ("Product didn't exist!")
        const isFavorited = product.FavoritedUsers.some(f => f.id === req.user.id)
        const isCart = product.CartUsers.some(f => f.id === req.user.id)

        product.increment('viewCounts')
        cb(null, { product, isFavorited, isCart })
      })
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
  },
  // Feeds
  getFeeds: (req, cb) => {
    return Promise.all([
      Product.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Product],
        raw: true,
        nest: true
      })
    ])
      .then(([products, comments]) => {
        cb(null, {products, comments})
      })
      .catch(err => cb(err))
  },
  getTopProducts: (req, cb) => {
    return Product.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }]
    })
      .then(product => {
        const result = product
          .map(product => ({
            ...product.toJSON(),
            favoritedCount: product.FavoritedUsers.length,
            isFavorited: req.user && req.user.FavoritedProducts.some(l => l.id === product.id)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
        result.splice(10)
        return cb(null, {result})
      })
      .catch(err => cb(err))
    // const favorite = await Favorite.findAll({
    //   group: 'product_id',
    //   attributes: ['product_id', [Sequelize.fn('count', Sequelize.col('user_id')), 'favorite_count']],
    //   order: [[Sequelize.col('favorite_count'), 'DESC']],
    //   limit: 10,
    //   raw: true
    // })
    // console.log(123, favorite)
    // cb(null, { favorite })
  }
}

module.exports = productServices