'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Products', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Products', 'category_id')
  }
};
