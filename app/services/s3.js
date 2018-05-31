const config = require('../config.js');

const AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = config.aws.accessKeyId;
AWS.config.secretAccessKey = config.aws.secretAccessKey;
AWS.config.region = config.aws.region;

const s3 = new AWS.S3();
const s3Client = { 
  init: async (server) => {
    const s3Calls = {
      put: async (destDir, body) => {
        const myKey = `${destDir}/index.html`;
        const params = {
          Bucket: config.aws.buckets.destination,
          Key: myKey,
          Body: body,
          CacheControl: 'no-cache',
          ContentType: 'text/html',
          Expires: 0,
        };

        return new Promise((resolve, reject) => {
          s3.putObject(params, async (error, data) => {
            if (error) {
              reject(error);
            } else {
              resolve(`Successfully uploaded data to ${config.aws.buckets.destination}/${myKey}`);
            }
          });
        });
        
      },
      listAllObjects: async (token = false) => {
        var allObjects = [];
        
        function listAllPrefixes(token, cb) {
          const params = {
            Bucket: config.aws.buckets.templates,
            Delimiter: '/',
          };
          if (token) {
            params.ContinuationToken = token;
          }

          return s3.listObjectsV2(params, function(err, data) {
            data.CommonPrefixes.forEach(function(object) {
              allObjects.push(object.Prefix.slice(0, -1));
            });

            if (data.IsTruncated) {
              listAllPrefixes(data.NextContinuationToken);
            }
            else {
              cb();
            }
          });
        }

        return new Promise(async resolve => {
          listAllPrefixes(token, () => {
            resolve(allObjects);
          });
        });
      },
      get: async (prefix) => {
        const params = {
          Bucket: config.aws.buckets.templates, 
          Key: `${prefix}/main.hbs`,
        };

        return new Promise((resolve, reject) => {
          s3.getObject(params, async function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve({
                key: prefix,
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
