const controllers = {};

var sequelize = require('../model/database');
var Starship = require('../model/Starship');
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

    let createStarship = {
      name: req.body.name,
      logo: data.key,
      description: req.body.description,
      website: req.body.website,
      twitter: req.body.twitter,
      discord: req.body.discord,
      cointmarkecap: req.body.cointmarkecap,
      networkId: req.body.network,
    };

    const dataStrashipInsert = Starship.create(createStarship)
      .then(function (dataStrashipInsert) {
        fs.unlinkSync(req.file.path, function (err) {
          if (err) throw err;
          console.log('File deleted!');
        });
        return dataStrashipInsert;
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

controllers.listAdmin = async (req, res) => {
  const data = await Starship.findAll({
    include: [Network],
  })
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

controllers.listFe = async (req, res) => {
  const data = await Starship.findAll({
    include: [Network],
  })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      return error;
    });

  
  let resultArray = new Array();

  var query_mission_counter_status =
  'select  b."starshipId" , count(b.status) as counter from ( ' +
  'select m.id as missionId, m."starshipId",  m.startdate, m.expirationdate, ' +
  'm.description, m.reward, m.winner, m.title, ' +
  '(CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) as days_left,  ' +
  's.name, s.logo, n.icon,  ' +
  "case when (CAST(MAX(m.expirationdate) AS date) - CAST(MIN(now()) AS date)) < 1 then 'Expired'  " +
  "else 'Available' end as status, amount, currency " +
  'from missions m inner join starships s ' +
  'on m."starshipId"=s.id ' +
  'inner join networks n on n.id=s."networkId" ' +
  'group by  ' +
  'm.id, m."starshipId",  m.startdate, m.expirationdate,  ' +
  'm.description, m.reward, m.winner, m.title,s.name, s.logo, n.icon order by m.expirationdate desc) as b ' +
  "where b.status='Available' " +
  'and b."starshipId" = :id group by b."starshipId" ';

  for (const element of data) {
    const missions_by_starship_counter = await Starship.sequelize.query(
      query_mission_counter_status,
      {
        replacements: { id: element.id},
        type: Starship.sequelize.QueryTypes.SELECT,
      }
    );

    let result = new Object();
    let resultNetwork = new Object();
    
    result.id = element.id,
    result.name = element.name,
    result.logo = element.logo;
    result.description = element.description;
    result.website = element.website;
    result.twitter = element.twitter;
    result.discord = element.discord;
    result.cointmarkecap = element.cointmarkecap;

    resultNetwork.id = element.network.id;
    resultNetwork.name = element.network.name;
    resultNetwork.icon = element.network.icon;

    result.network = resultNetwork;
    if(missions_by_starship_counter.length === 0){
        result.counter = '0';
    }else{
      result.counter = missions_by_starship_counter[0].counter;
    }

    resultArray.push(result);
  }


  res.json({
    success: true,
    data: resultArray,
  });
};

controllers.searchByName = async (req, res) => {
  const { name } = req.body;

  const data = await Starship.findAll({
    where: {
      name: Starship.sequelize.where(
        Starship.sequelize.fn('LOWER', Starship.sequelize.col('starship.name')),
        'ilike',
        '%' + name + '%'
      ),
    },
    include: [Network],
  })
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

controllers.get = async (req, res) => {
  const { id } = req.params;

  const data = await Starship.findOne({
    where: { id: id },
    include: [Network],
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
    const updateData = Starship.update(
      {
        name: req.body.name,
        logo: data.key,
        description: req.body.description,
        website: req.body.website,
        twitter: req.body.twitter,
        discord: req.body.discord,
        cointmarkecap: req.body.cointmarkecap,
        networkId: req.body.network,
      },
      {
        where: { id: id },
      }
    )
      .then(function (updateData) {
        fs.unlinkSync(req.file.path, function (err) {
          if (err) throw err;
          console.log('File deleted!');
        });
        return updateData;
      })
      .catch((error) => {
        return error;
      });

    res.status(200).json({
      success: true,
      message: 'Successfully update in the database!',
    });
  });
};

controllers.delete = async (req, res) => {
  const { id } = req.body;

  const del = await Starship.destroy({
    where: { id: id },
  });
  res.json({
    success: true,
    deleted: del,
    message: 'Deleted successfully!',
  });
};

controllers.getNetworkId = async (req, res) => {
  const { id } = req.params;

  const data = await Starship.findAll({
    where: { networkId: id },
    include: [Network],
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
    console.log('Hasil Starship', file);

    if (file.mimetype == 'image/png') {
      cb(null, true);
    } else {
      req.fileValidationError = 'Forbidden extension';
      return cb(null, false, req.fileValidationError);
    }

    //cb('Give proper file format upload')
  },
}).single('image');

module.exports = controllers;
