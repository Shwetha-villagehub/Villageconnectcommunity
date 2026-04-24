import app, { ensureDatabaseConnection } from '../backend/app.js';

export default async function handler(req, res) {
  await ensureDatabaseConnection();
  return app(req, res);
}
