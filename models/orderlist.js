'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orderlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Orderlist.init({
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    productCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Orderlist',
    tableName: 'Orderlists',
    underscored: true,
  });
  return Orderlist;
};