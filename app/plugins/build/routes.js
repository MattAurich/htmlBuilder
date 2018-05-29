'use-strict'
var handlers = require ('./handlers');

const baseRoutes = {
  name: 'build-routes',
  version: '1.0.0',
  register: async function (server, options) {
    server.route([{
      method: ['PUT', 'POST'],
      path: '/build/{key}',
      handler: handlers.build,
      options: {
        payload: {
          allow: 'application/json',
        }
      }
    }]
  );
  }
};

module.exports = baseRoutes;
