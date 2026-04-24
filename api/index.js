import app, { ensureDatabaseConnection } from '../village community website/backend/app.js';

export default async function handler(req, res) {
  await ensureDatabaseConnection();
  return app(req, res);
}
