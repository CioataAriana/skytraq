import express from 'express';
import cors from 'cors';
import routes from './routes.js'; 
import fs from 'fs';       
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use('/api', routes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, '../server.key')),
  cert: fs.readFileSync(path.join(__dirname, '../server.crt'))
};

if (process.env.NODE_ENV !== 'test') {
  https.createServer(sslOptions, app).listen(3000, '0.0.0.0', () => {
    console.log('🔒 SECURE API running on https://172.20.10.4:3000');
  });
}

export default app;