import express from 'express';
import cors from 'cors';
import {errorHandler} from "./infrastructure/http/middlewares/error-handler.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        estado: 'OK',
        mensaje: 'El servidor está funcionando correctamente.'
    });
});

app.use(errorHandler);

export default app;