import { app } from '../server.js';
import { testConnection, initSchema, seedInitialData } from '../db.js';

await testConnection();
await initSchema();
await seedInitialData();

export default app;
