const { Product, Category, Comment, User, Favorite } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const Sequelize = require('sequelize');
const error = new Error()

const productServices = {
  searchProducts: (req, cb) => {
    const keyword = req.query.keyword

    Product.findAll({
      raw: true,
      attributes: [
        'id',
        'title',
        'price',
        'og_price',
        'image',
        'short_intro'
      ]
    })
      .then(products => {

          if (!products) {
            error.code = 400
            error.message = "查無商品!"
            return cb(error)
          }

          const items = products.filter(item => {
          return item.title.toLowerCase().includes(keyword.toLowerCase())
        })
        cb(null, { products: items })
      })
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  getProducts: (req, cb) => {
    const DEFAULT_LIMIT = 8
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    const sort = req.query.sort || 'DESC'
    const condition = req.query.value || 'createdAt'

    return Promise.all([
      Product.findAndCountAll({
        // 若沒raw會拿到sequelize物件
        raw: true,
        nest: true,
        order: [[`${condition}`, `${sort}`]],
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
        let FavoritedProductsId
        let CartProductsId

        if (!products || !categories) {
          error.code = 400
          error.message = "找不到商品, 稍後重新查詢"
          return cb(error)
        }

        if(req.user) {
          FavoritedProductsId = req.user && req.user.FavoritedProducts.map(fr => fr.id)
          CartProductsId = req.user && req.user.CartProducts.map(fr => fr.id)
        }
        
        const data = products.rows.map( item => ({
          ...item,
          description: item.description.substring(0, 50),
          isFavorited: FavoritedProductsId?.includes(item.id),
          isCart: CartProductsId?.includes(item.id)
        }))
        
        cb(null, { 
          data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, products.count)
        })
      })
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  getProduct: (req, cb) => {
    return Product.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'CartUsers', attributes: ['id', 'name', 'email'] }
      ]
    })
      .then(product => {

        if (!product) {
          error.code = 400
          error.message = "商品不存在!"
          return cb(error)
        }

        product.increment('viewCounts')

        if (req.user) {

          const isFavorited = product.FavoritedUsers.some(f => f.id === req.user.id)
          const isCart = product.CartUsers.some(f => f.id === req.user.id)

          return cb(null, { product, isFavorited, isCart })
        } else {

          cb(null, { product })

        }
      })
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  postProduct: (req, cb) => {
    const { title, price, og_price, short_intro, description, categoryId } = req.body
    
    if (!title) {
      error.code = 400
      error.message = "title 為必填!"
      return cb(error)
    }

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
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  editProduct: (req, cb) => {
    Promise.all([
      Product.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([product, categories]) => cb(null, { product, categories }))
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  putProduct: (req, cb) => {
    const { title, price, og_price, short_intro, description, categoryId } = req.body

    if (!title) {
      error.code = 400
      error.message = "title 為必填!"
      return cb(error)
    }

    const { file } = req

    Promise.all([
      Product.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([product, filePath]) => {

        if (!product) {
          error.code = 400
          error.message = "商品不存在!"
          return cb(error)
        }

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
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  deleteProduct: (req, cb) => {
    return Product.findByPk(req.params.id)
      .then(product => {

        if (!product) {
          error.code = 400
          error.message = "商品不存在!"
          return cb(error)
        }

        return product.destroy()
      })
      .then(() => cb(null))
      .catch(error => {
        error.code = 500
        cb(error)
      })
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
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  getTopProducts: (req, cb) => {
    return Favorite.findAll({
      group: 'product_id',
      attributes: ['product_id', [Sequelize.fn('count', Sequelize.col('user_id')), 'favorite_count']],
      order: [[Sequelize.col('favorite_count'), 'DESC']],
      limit: 10,
      raw: true,
      
    })
      .then(result => {
        const top = result.map(product => ({
          ...product,
          isFavorited: req.user && req.user.FavoritedProducts?.some(l => l.id === product.product_id)
        })) 
        cb(null, { top })
      })
      .catch(error => {
        error.code = 500
        cb(error)
      })
  }
}

module.exports = productServices