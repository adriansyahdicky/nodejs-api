const controllers = {};

//import model and sequalize

var sequelize = require('../model/database');
var Categories = require('../model/Categories');

sequelize.sync();

controllers.list = async (req, res) => {
  const data = await Categories.findAll({})
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      return error;
    });

  res.json({
    success: true,
    data: data,
  });
};

controllers.create = async (req, res) => {
  const { name } = req.body;

  const data = await Categories.create({
    name: name,
  })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });

  res.status(200).json({
    success: true,
    message: 'Data saved successfully!',
    data: data,
  });
};

controllers.get = async (req, res) => {
  const { id } = req.params;

  const data = await Categories.findOne({
    where: { id: id },
  })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });

  res.json({
    success: true,
    data: data,
  });
};

controllers.update = async (req, res) => {
  // parameter get id
  const { id } = req.params;
  // parameter POST
  const { name } = req.body;
  // Update data
  const data = await Categories.update(
    {
      name: name,
    },
    {
      where: { id: id },
    }
  )
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      return error;
    });
  res.json({
    success: true,
    data: data,
    message: 'Successfully update in the database!',
  });
};

controllers.delete = async (req, res) => {
  // parameter post
  const { id } = req.body;
  // delete sequelize
  const del = await Categories.destroy({
    where: { id: id },
  });
  res.json({ success: true, deleted: del, message: 'Deleted successfully!' });
};

module.exports = controllers;
