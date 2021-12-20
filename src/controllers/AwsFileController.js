const controllers = {};

const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

controllers.getAwsFile = async (req, res) => {
  const { key } = req.params;

  const dowloadsParams = {
    Key: key,
    Bucket: process.env.AWS_BUCKET_NAME,
  };

  const fileStream = s3.getObject(dowloadsParams).createReadStream();

  fileStream.pipe(res);
};

module.exports = controllers;
