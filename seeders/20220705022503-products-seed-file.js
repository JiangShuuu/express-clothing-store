'use strict';

const { faker } = require('@faker-js/faker')

module.exports = {
  async up (queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 50 }, () => ({
        title: faker.word.adjective(5),
        price: faker.random.numeric(3),
        og_price: faker.random.numeric(4),
        short_intro: faker.random.words(5),
        description: faker.lorem.sentence(),
        image: faker.image.fashion(800, 1200, true),
        isOpen: false,
        category_id: categories[Math.floor(Math.random() * categories.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
