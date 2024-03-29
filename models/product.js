'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Product.hasMany(models.Comment, { foreignKey: 'productId' })
      // 多對多
      Product.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'productId',
        as: 'FavoritedUsers'
      })
      Product.belongsToMany(models.User, {
        through: models.Cart,
        foreignKey: 'productId',
        as: 'CartUsers'
      })
      Product.belongsToMany(models.Order, {
        through: models.Orderlist,
        foreignKey: 'productId',
        as: 'UsersOrder'
      })
    }
  }
  Product.init({
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    og_price: DataTypes.INTEGER,
    short_intro: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    viewCounts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    underscored: true,
  });
  return Product;
};