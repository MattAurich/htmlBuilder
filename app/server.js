'use strict';

const Hapi = require('hapi');
const BasicAuth = require('hapi-auth-basic');
const Bcrypt = require('bcrypt');

const config = require('./config.js');

const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
});

const basicValidation = async function (request, username, password) {  
  const user = config.users[ username ]

  if (!user) {
    return { isValid: false }
  }
  
  const isValid = await Bcrypt.compare(password, user.password)

  return { isValid, credentials: { id: user.id, username: user.username } }
}

const init = async () => {
  try {
    await require('./services/redisClient').init(server);
    await require('./services/s3').init(server);
  } catch (err) {
    console.log('Service init error:', err)
  }

  try {
    await server.register([
      require('hapi-auth-basic'),
      {
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: true,
            logEvents: ['request-error']
        }
      },
      require('./plugins/build/routes'),
      require('./plugins/templates/routes'),
    ]);
  } catch (err) {
    console.log('Deal with your registration error:', err);
  }

  server.auth.strategy('simple', 'basic', { validate: basicValidation });
  server.auth.default('simple');
  
  try {
    await server.start()
    console.log(`Server running at: ${server.info.uri}`);
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
};

init();
