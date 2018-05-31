const nunjucks = require('nunjucks');
const showdown = require('showdown')

showdown.setOption('noHeaderId', 'false');
const converter = new showdown.Converter();

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('public'));
env.addFilter('markdown', function(val, cb) {
  return converter.makeHtml(val)
});

const handler = {
  build: async (request, h) => {
    const objKey = request.params.key;
    var response = await request.server.methods.redisDB.get(objKey)
    .catch(function(error) {
      return request.server.methods.s3.get(objKey)
      .then(function(result) {
        return request.server.methods.redisDB.set(objKey, result.body);
      })
      .catch(function(error) {
        return error;
      });
    });

    if (!response || (response.statusCode >= 400)) {
      return String(response);
    }

    const body = await env.renderString(response.value, request.payload.context);
    
    response = await request.server.methods.s3.put(request.payload.destDir, body)
    .catch(function(error) {
      return error.message;
    });

    return response;
  }
}

module.exports = handler;
