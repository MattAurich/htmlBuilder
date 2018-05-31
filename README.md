Built using hapi.js, it caches mustache templates into a redis server from s3, and upon request will inject JSON into the templates and publish to an S3 bucket.

# To start
replace app/config.example.js values and rename to app/config.js

npm install

start a redis server/instance (https://redis.io/topics/quickstart)

node app/server.js

# S3 template bucket setup

  * folder structure like so:

# S3 destination bucket setup
  * set up for static hosting like so:
