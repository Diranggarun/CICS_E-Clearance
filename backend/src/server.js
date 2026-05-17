import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import app from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly maps .env file out of the src folder context
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running cleanly via ESM architecture on port ${PORT}`);
});