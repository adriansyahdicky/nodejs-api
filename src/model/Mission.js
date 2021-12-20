const req = require('express/lib/request');
const Sequelize = require('sequelize');
var sequelize = require('./database');

var nametable = 'mission';

var Starship = require('./Starship');
var Categories = require('./Categories');

var Mission = sequelize.define(nametable, {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  starshipId: {
    type: Sequelize.INTEGER,
    refences: {
      model: Starship,
      key: 'id',
    },
  },
  startdate: Sequelize.DATE,
  expirationdate: Sequelize.DATE,
  categoryId: {
    type: Sequelize.INTEGER,
    refences: {
      model: Categories,
      key: 'id',
    },
  },
  description: Sequelize.STRING,
  reward: Sequelize.STRING,
  winner: Sequelize.STRING,
  amount: Sequelize.INTEGER,
  currency: Sequelize.STRING,
  title: Sequelize.STRING,
});

Mission.belongsTo(Starship);
Mission.belongsTo(Categories);

module.exports = Mission;
