import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import {bookingRoutes} from "@bookings-module/bookings.module";
import {errorHandler} from "@infra/http/middlewares/error-handler.middleware";
import {venueRoutes} from "@venues-module/venues.module";
import {swaggerSpec} from "@/swagger";

const app = express();

app.use(cors());
app.use(express.json());

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verificar estado del servidor
 *     description: Retorna el estado actual del servidor API
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                   example: OK
 *                 mensaje:
 *                   type: string
 *                   example: El servidor está funcionando correctamente.
 */
app.get('/api/health', (req, res) => {
    res.json({
        estado: 'OK',
        mensaje: 'El servidor está funcionando correctamente.'
    });
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        persistAuthorization: true
    }
}));

app.use("/api/venues", venueRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(errorHandler);

export default app;
