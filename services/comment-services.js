const { Comment, User, Product } = require('../models')

const commentController = {
  postComment: (req, cb) => {
    const { productId, text } = req.body
    const userId = req.user.id
    if (!text) throw new Error('Comment text is required!')
    return Promise.all([
      User.findByPk(userId),
      Product.findByPk(productId)
    ])
      .then(([User, Product]) => {
        if (!User) throw new Error("User didn't exist!")
        if (!Product) throw new Error("product didn't exist!")
        return Comment.create({
          text,
          productId,
          userId
        })
      })
      .then(() => {
        cb(null, {})
      })
      .catch(err => cb(err))
  }
}

module.exports = commentController