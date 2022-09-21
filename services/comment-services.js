const { Comment, User, Product } = require('../models')
const error = new Error()

const commentController = {
  postComment: (req, cb) => {
    const { productId, text } = req.body
    const userId = req.user.id

    if (!text) {
      error.code = 400
      error.message = "評論為必填!"
      return cb(error)
    }

    return Promise.all([
      User.findByPk(userId),
      Product.findByPk(productId)
    ])
      .then(([User, Product]) => {

        if (!User) {
          error.code = 400
          error.message = "此使用者不存在!"
          return cb(error)
        }

        if (!Product) {
          error.code = 400
          error.message = "此商品不存在!"
          return cb(error)
        }

        return Comment.create({
          text,
          productId,
          userId
        })
      })
      .then(() => {
        cb(null, {})
      })
      .catch(error => {
        error.code = 500
        cb(error)
      })
  },
  deleteComment: (req, cb) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {

        if (!comment) {
          error.code = 400
          error.message = "此評論不存在!"
          return cb(error)
        }

        return comment.destroy()
      })
      .then(() => cb(null, {}))
      .catch(error => {
        error.code = 500
        cb(error)
      })
  }
}

module.exports = commentController