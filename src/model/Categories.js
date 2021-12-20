const Sequelize = require('sequelize');
var sequelize = require('./database');

var nametable = 'categories';

var Categories = sequelize.define(nametable, {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: Sequelize.STRING,
});

module.exports = Categories;
