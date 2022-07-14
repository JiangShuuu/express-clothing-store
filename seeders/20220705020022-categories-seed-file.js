'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories',
        ['上衣', '褲子', '外套', '特價商品', '熱門商品']
          .map(item => {
            return {
              name: item,
              created_at: new Date(),
              updated_at: new Date()
            }
          }
          ), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null , {})
  }
};
