'use strict';

const { faker } = require('@faker-js/faker')
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 50 }, () => ({
        title: faker.word.adjective(5),
        price: faker.random.numeric(3),
        og_price: faker.random.numeric(4),
        short_intro: faker.random.words(5),
        description: faker.lorem.sentence(25),
        image: faker.image.fashion(800, 1200, true),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
