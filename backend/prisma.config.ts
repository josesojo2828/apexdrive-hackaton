import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

dotenv.config()

// DATABASE_URL is provided by Docker Compose environment variables or from .env file
export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: process.env.DATABASE_URL!,
    },
})
