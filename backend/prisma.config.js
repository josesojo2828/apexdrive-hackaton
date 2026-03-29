const { defineConfig } = require('prisma/config');
require('dotenv').config();

// DATABASE_URL is provided by Docker environment variables or from .env file
module.exports = defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
