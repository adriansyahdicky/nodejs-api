const controllers = {};

var sequelize = require('../model/database');
var Network = require('../model/Network');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

sequelize.sync();

controllers.create = async (req, res) => {
  console.log('read file ', req.file);

  if (!req.file)
    return res.status(500).json({
      success: false,
      message: 'Please check format file and file cannot be empty!',
    });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuidv4()}`,
    Body: fs.createReadStream(req.file.path),
  };

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }

    fs.unlinkSync(req.file.path, function (err) {
      if (err) throw err;
      console.log('File deleted!');
    });

    let createNetwork = {
      icon: data.key,
      name: req.body.name,
      alias: req.body.alias,
      description: req.body.description
    };

    const dataNetwork = Network.create(createNetwork)
      .then(function (dataNetwork) {
        return dataNetwork;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });

    res.status(200).json({
      success: true,
      message: 'Data saved successfully!',
    });
  });
};

controllers.list = async (req, res) => {
  const data = await Network.findAll({})
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

controllers.delete = async (req, res) => {
  const { id } = req.body;
  const del = await Network.destroy({
    where: { id: id },
  });
  res.json({
    success: true,
    deleted: del,
    message: 'Deleted successfully!',
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/Images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

controllers.upload = multer({
  storage: storage,
  limits: { fileSize: '10000000' },
  fileFilter: (req, file, cb) => {
    const fileTypes = /png/;
    const mimType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      req.fileValidationError = 'Forbidden extension';
      return cb(null, false, req.fileValidationError);
    }
  },
}).single('image');

module.exports = controllers;
