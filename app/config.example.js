const config = {
  app: {
    host: <INSERT SERVER HOST STRING>,
    port: <INSERT SERVER PORT NUMBER>,
  },
  redis: {
    host: <INSERT REDISDB HOST STRING>,
    port: <INSERT REDISDB PORT NUMBER>,
  },
  aws: {
    accessKeyId: <INSERT AWS ACCESS KEY ID STRING HERE>,
    secretAccessKey: <INSERT AWS SECRET ACCESS KEY STRING HERE>,
    region: <INSERT AWS REGION STRING HERE>,
    buckets: {
      templates: <INSERT AWS BUCKET STRING HERE>,
      destination: <INSERT AWS BUCKET STRING HERE>,
    },
  },
 };
 
 module.exports = config;
