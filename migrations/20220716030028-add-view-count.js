'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'view_counts', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Products', 'view_counts')
  }
};
