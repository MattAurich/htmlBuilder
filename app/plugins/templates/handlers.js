const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const cacheAll = async (request) => {
    const response = await request.server.methods.s3.listAllObjects()
        .then(async function(response) {
            const templatePrefixes = [];
            await asyncForEach(response, async function(prefix) {
                let templateKey = await cacheS3Template(request, prefix);
                templatePrefixes.push(templateKey);
            });
            return `[ ${templatePrefixes.join(', ')} ]`;
        });

    return response;
}

const cacheS3Template = (request, templatePrefix) => {
    return request.server.methods.s3.get(templatePrefix)
        .then(async response => {
            const template = await request.server.methods.redisDB.set(response.key, response.body);
            return `${template.key} now cached`;
        })
        .catch(function(error) {
            return error.message;
        });
}

const handler = {
    getTemplates: async (request, h) => {
        var response;

        if (request.params.key) {
            var templatePrefix = request.params.key;

            response = await cacheS3Template(request, templatePrefix);
        } else {
            response = await cacheAll(request);
        }
        
        return response;
    }
}

module.exports = handler;
