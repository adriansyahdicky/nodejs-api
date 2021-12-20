var Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.NAME_DATABASE, //database
  process.env.USER_DATABASE, //username
  process.env.PASSWORD_DATABASE, //password
  {
    host: process.env.HOST_DATABASE,
    port: process.env.POSRT_DATABASE,
    dialect: process.env.DIALECT_DATABASE,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = sequelize;
