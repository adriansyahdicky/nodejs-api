const Sequelize = require('sequelize');
var sequelize = require('./database');

var nametable = 'network';

var Network = sequelize.define(nametable, {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: Sequelize.STRING,
  icon: Sequelize.STRING,
  alias: Sequelize.STRING,
  description: Sequelize.STRING
});

module.exports = Network;
