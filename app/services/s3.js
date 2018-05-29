const config = require('../config.js');

const AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = config.aws.accessKeyId;
AWS.config.secretAccessKey = config.aws.secretAccessKey;
AWS.config.region = config.aws.region;

const s3 = new AWS.S3();
const s3Client = { 
  init: async (server) => {
    let myBucket = config.aws.bucket;
    
    const s3Calls = {
      put: async (destDir, body) => {
        const myKey = `${destDir}/index.html`;
        const params = {Bucket: myBucket, Key: myKey, Body: body };

        return new Promise((resolve, reject) => {
          s3.putObject(params, async (error, data) => {
            if (error) {
              reject(error);
            } else {
              resolve(`Successfully uploaded data to ${myBucket}/${myKey}`);
            }
          });
        });
        
      },
      listAllObjects: async (token) => {
        var allObjects = [];
        
        function listAllKeys(token, cb) {
          const params = {
            Bucket: config.aws.bucket, 
            Prefix: 'templates/',
            Delimiter: '/',
          };
          if (token) {
            params.ContinuationToken = token;
          }

          return s3.listObjectsV2(params, function(err, data) {
            data.Contents.forEach(function(object) {
              if (object.Size > 0) {
                allObjects.push(object);
              }
            });

            if (data.IsTruncated) {
              listAllKeys(data.NextContinuationToken);
            }
            else {
              cb();
            }
          });
        }

        return new Promise(async resolve => {
          listAllKeys(token, () => {
            resolve(allObjects);
          });
        });
      },
      get: async (key) => {
        const params = {
          Bucket: config.aws.bucket, 
          Key: key,
        };

        return new Promise((resolve, reject) => {
          s3.getObject(params, async function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve({
                key: key,
                body: data.Body.toString('utf-8').toString(),
              });
            }
          });
        });
      }
    }

    server.method('s3.put', s3Calls.put, {});
    server.method('s3.get', s3Calls.get, {});
    server.method('s3.listAllObjects', s3Calls.listAllObjects, {});
  }
}

module.exports = s3Client;
