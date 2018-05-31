const Handlebars = require('handlebars');
const showdown = require('showdown');

const converter = new showdown.Converter({
  'noHeaderId': false,
  'strikethrough': true,
  'tables': true,
});

Handlebars.registerHelper('markdown', function(val) {
  return new Handlebars.SafeString(converter.makeHtml(val));
});

const getAndCacheTemplate = (request, error) => {
  const templateKey = request.params.key;
  
  return request.server.methods.s3.get(templateKey)
    .then(function(result) {
      return request.server.methods.redisDB.set(templateKey, result.body);
    })
    .catch(function(error) {
      return error;
    });
}

const handler = {
  build: async (request, h) => {
    const templateKey = request.params.key;

    const response = await request.server.methods.redisDB.get(templateKey)
      .catch(getAndCacheTemplate.bind(this, request));

    if (!response || (response.statusCode >= 400)) {
      return String(response);
    } else {
      const template = Handlebars.compile(response.value);
      const htmlFile = template(request.payload.context);
    
      return request.server.methods.s3.put(request.payload.destDir, htmlFile)
        .catch(function(error) {
          return error.message;
        });
    }
  }
}

module.exports = handler;
