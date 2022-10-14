import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import Convention from './routes/Convention.js';
import Character from './routes/Characters.js'

const app = express();
const PORT = process.env.PORT || 8000
dotenv.config();
app.use(express.json());
app.use(cors());

app.use('/conventions', Convention);
app.use('/characters', Character);

app.use((err,req,res,next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Something went wrong, no error message found';
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.listen(PORT, () => {
    console.log(`Connected to backend on port ${PORT}`);
});

