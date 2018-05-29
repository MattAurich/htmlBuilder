const redis = require('redis');
const config = require('../config.js');

const redisClient = { 
  init: async (server) => {
    const client = redis.createClient({host: config.redis.host, port: config.redis.port});
    client.on('error', function(err){
      console.log('Something went wrong with the Redis Client ', err)
      client.quit();
    });
    
    const clientCalls = {
      set: async function (key, value) {
        const expiration = 86400;
        return new Promise((resolve, reject) => {
          client.setex(key, expiration, value, async function(error, result) {
            if (error) {
              reject(error);
            } else {
              resolve({
                key: key,
                value: value
              });
            }
          });
        })
        
      },
      get: async function (key) {
        return new Promise((resolve, reject) => {
          client.get(key, function(result) {
            if (!result || result === 'NoSuchKey: The specified key does not exist.') {
              reject(result);
            } else {
              resolve(result);
            }
          });
        })
      }
    }

    server.method('redisDB.set', clientCalls.set, {});
    server.method('redisDB.get', clientCalls.get, {});

    return client;
  }
}

module.exports = redisClient;
