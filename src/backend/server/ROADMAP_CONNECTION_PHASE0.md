Phase 0 artifacts for Video Generation Connection

Includes:
- SQL migration to add VideoGenerationJobs table (prisma migration folder)
- Basic BullMQ queue and worker skeleton at src/jobs/videoGenerationQueue.ts

How to apply:
1. Ensure Redis is running and reachable via REDIS_URL.
2. Apply the SQL migration via your DB tool or convert to Prisma migration.
3. Install dependencies: bullmq and ioredis in the api-server package.
   npm install bullmq ioredis
4. Start the worker (node dist/src/jobs/videoGenerationQueue.js) or import the module in your server startup.
