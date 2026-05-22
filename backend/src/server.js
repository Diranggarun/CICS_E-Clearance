<<<<<<< HEAD
import 'dotenv/config'
import app from './app.js'

const port = Number(process.env.PORT || 8000)

app.listen(port, () => {
  console.log(`CICS E-Clearance API running on http://localhost:${port}`)
})
=======
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
>>>>>>> d28bd3b538eb5eb7f22a9b7749abab309e37038e
