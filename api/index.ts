import { app } from '../server.js';
import { testConnection, initSchema, seedInitialData } from '../db.js';

try {
  await testConnection();
  await initSchema();
  await seedInitialData();
} catch (err) {
  console.error('[api/index] DB init failed, continuing without DB:', err);
}

export default app;
