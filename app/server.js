'use strict';

const Hapi = require('hapi');
const config = require('./config.js');

const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
});

const init = async () => {
  try {
    await require('./services/redisClient').init(server);
    await require('./services/s3').init(server);
  }
  catch (err) {
    console.log('Deal with your service init error:', err)
  }

  try {
    await server.register([
      require('inert'),
      {
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: true,
            logEvents: ['response']
        }
      },
      require('./plugins/build/routes'),
      require('./plugins/templates/routes'),
    ]);
  }
  catch (err) {
      console.log('Deal with your registration error:', err);
  }


  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log('Unhandled Rejection Error:', err);
    process.exit(1);
});

init();
