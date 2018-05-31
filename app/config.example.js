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
    accessKeyId: <INSERT AWS ACCESS KEY ID STRING>,
    secretAccessKey: <INSERT AWS SECRET ACCESS KEY STRING>,
    region: <INSERT AWS REGION STRING>,
    buckets: {
      templates: <INSERT AWS BUCKET STRING>,
      destination: <INSERT AWS BUCKET STRING>,
    },
  },
  users: {
    <USERNAME> : {
      id: <ID STRING>,
      username: <USERNAME>,
      password: <PASSWORD>,
    },
    <ETC..>,
  }
 };
 
 module.exports = config;
