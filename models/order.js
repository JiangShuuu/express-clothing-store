'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: 'userId' })
      Order.belongsToMany(models.Product, {
        through: models.Orderlist,  
        foreignKey: 'orderId',
        as: 'OrderProducts'
      })
    }
  }
  Order.init({
    name: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    address: DataTypes.STRING,
    total: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: true,
  });
  return Order;
};