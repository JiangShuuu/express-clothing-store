'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Product, { foreignKey: 'productId' })
      Comment.belongsTo(models.User, { foreignKey: 'userId' })
    }
  };
  Comment.init({
    text: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments',
    underscored: true,
  });
  return Comment;
};