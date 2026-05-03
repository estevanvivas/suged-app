import express from 'express';
import cors from 'cors';
import {errorHandler} from "@infra/http/middlewares/error-handler.middleware";
import {venueRoutes} from "@venues-module/venues.module";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        estado: 'OK',
        mensaje: 'El servidor está funcionando correctamente.'
    });
});

app.use("/api/venues", venueRoutes);

app.use(errorHandler);

export default app;
