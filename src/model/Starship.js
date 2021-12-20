const Sequelize = require('sequelize');
var sequelize = require('./database');

var nametable = 'starship';

var Network = require('./Network');

var Starship = sequelize.define(nametable, {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: Sequelize.STRING,
  logo: Sequelize.STRING,
  description: Sequelize.STRING,
  website: Sequelize.STRING,
  twitter: Sequelize.STRING,
  discord: Sequelize.STRING,
  cointmarkecap: Sequelize.STRING,
  networkId: {
    type: Sequelize.INTEGER,
    refences: {
      model: Network,
      key: 'id',
    },
  },
});

Starship.belongsTo(Network);

module.exports = Starship;
