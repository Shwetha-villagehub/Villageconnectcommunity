import { disconnectServerDatabase, startServer } from './app.js';

startServer();

process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await disconnectServerDatabase();
  process.exit(0);
});
