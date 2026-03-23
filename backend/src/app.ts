import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        estado: 'OK',
        mensaje: 'El servidor está funcionando correctamente.'
    });
});

export default app;