'use-strict'
var handlers = require ('./handlers');

const baseRoutes = {
  name: 'template-routes',
  version: '1.0.0',
  register: async function (server, options) {
    server.route([{
      method: ['PUT'],
      path: '/templates/{key?}',
      handler: handlers.getTemplates,
    }
  ]
  );
  }
};

module.exports = baseRoutes;
