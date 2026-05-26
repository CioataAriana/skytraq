import express from 'express';
import cors from 'cors';
import routes from './routes.js'; 

const app = express();

// Permitem frontend-ului să comunice cu backend-ul
app.use(cors()); 
app.use(express.json()); 

// Rutele tale
app.use('/api', routes);

// Cloud-ul (Render) va folosi process.env.PORT. Local va folosi 3000.
const PORT = process.env.PORT || 3000;

// Ascultăm pe '0.0.0.0' pentru ca Render să poată detecta serverul
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;