Built using hapi.js, it caches mustache templates into a redis server from s3, and upon request will inject JSON into the templates and publish to an S3 bucket.

# To start
1. replace app/config.example.js values and rename to app/config.js

2. npm install

3. start a redis server/instance (https://redis.io/topics/quickstart)

4. node app/server.js

# Routes
* Templates
    * used to update the templates found redis cache

# S3 template bucket setup
* folder structure like so: TBD

# S3 destination bucket setup
* set up for static hosting like so: TBD

# For input validation
* handled by TBD

# Error handling
* handled by TBD

# Logging
* handled by hapi-pino

* log files put to TBD
