const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const cacheAll = async (request) => {
    const response = await request.server.methods.s3.listAllObjects(false)
    .then(async function(response) {
        const templateKeys = [];
        await asyncForEach(response, async function(object) {
            let templateKey = await cacheS3Templates(request, object.Key);
            templateKeys.push(templateKey);
        });
        return `[ ${templateKeys.join(', ')} ]`;
    })

    return response;
}

const cacheS3Templates = (request, objectKey) => {
    return request.server.methods.s3.get(objectKey)
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
            var objectKey = `templates/${request.params.key}`;

            response = await cacheS3Templates(request, objectKey);
        } else {
            response = await cacheAll(request);
        }
        
        return response;
    }
}

module.exports = handler;
