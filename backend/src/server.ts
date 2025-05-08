
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('AI SQL Assistant Backend is running!');
});

app.listen(port, () => {
    console.log(`Backend server listening on http://localhost:${port}`);
});
