'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Carts', 'product_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Carts', 'product_count')
  }
};
