'use strict';

const bcrypt = require('bcryptjs')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'root',
      avatar: `https://loremflickr.com/240/240?lock=${(Math.random() * 100) + 1}`,
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user1',
      avatar: `https://loremflickr.com/240/240?lock=${(Math.random() * 100) + 1}`,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: `https://loremflickr.com/240/240?lock=${(Math.random() * 100) + 1}`,
      name: 'user2',
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
