import {Router} from "express";

import {requireAuthenticatedAdmin, requireAuthentication} from "@infra/http/middlewares/auth.middleware";
import {validateBody} from "@infra/http/middlewares/body-validation.middleware";
import {validateParams} from "@infra/http/middlewares/params-validation.middleware";
import {BookingController} from "@bookings-module/interfaces/http/booking.controller";
import {bookingIdParamsSchema} from "@bookings-module/interfaces/http/validation/booking-id-params.schema";
import {createBookingBodySchema} from "@bookings-module/interfaces/http/validation/create-booking.schema";
import {rescheduleBookingBodySchema} from "@bookings-module/interfaces/http/validation/reschedule-booking.schema";
import {updateBookingStatusBodySchema} from "@bookings-module/interfaces/http/validation/update-booking-status.schema";

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Crear una nueva reserva
 *     description: Crea una nueva reserva para el usuario autenticado en un venue específico
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               venueId:
 *                 type: string
 *                 format: uuid
 *                 description: ID del venue
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la reserva (YYYY-MM-DD)
 *               startTime:
 *                 type: string
 *                 example: "10:00:00"
 *                 description: Hora de inicio en formato HH:mm:ss
 *               endTime:
 *                 type: string
 *                 example: "11:00:00"
 *                 description: Hora de fin en formato HH:mm:ss, debe ser posterior a startTime
 *             required:
 *               - venueId
 *               - date
 *               - startTime
 *               - endTime
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *
 * /api/bookings/my:
 *   get:
 *     summary: Obtener mis reservas
 *     description: Retorna todas las reservas del usuario autenticado
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: No autorizado
 *
 * /api/bookings/{bookingId}:
 *   get:
 *     summary: Obtener reserva por ID
 *     description: Retorna los detalles de una reserva específica
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookingId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 *   delete:
 *     summary: Eliminar una reserva (Admin)
 *     description: Elimina una reserva de forma permanente. Solo administradores pueden hacer esto.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookingId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Reserva eliminada exitosamente
 *       401:
 *         description: No autorizado (requiere ser admin)
 *       404:
 *         description: Reserva no encontrada
 *
 * /api/bookings/{bookingId}/status:
 *   patch:
 *     summary: Actualizar estado de reserva (Admin)
 *     description: Actualiza el estado de una reserva. Solo administradores pueden hacer esto.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookingId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APROBACION_PENDIENTE, APROBADA, RECHAZADA, CANCELADA]
 *                 description: Nuevo estado de la reserva
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       401:
 *         description: No autorizado (requiere ser admin)
 *       404:
 *         description: Reserva no encontrada
 *
 * /api/bookings/{bookingId}/cancel:
 *   patch:
 *     summary: Cancelar una reserva
 *     description: Cancela una reserva existente. El usuario solo puede cancelar sus propias reservas.
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookingId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Reserva cancelada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 *
 * /api/bookings/{bookingId}/reschedule:
 *   patch:
 *     summary: Reprogramar una reserva
 *     description: Cambia la fecha y/o hora de una reserva existente
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookingId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 example: "14:00:00"
 *                 description: Nueva hora de inicio en formato HH:mm:ss
 *               endTime:
 *                 type: string
 *                 example: "15:00:00"
 *                 description: Nueva hora de fin en formato HH:mm:ss
 *             required:
 *               - date
 *               - startTime
 *               - endTime
 *     responses:
 *       200:
 *         description: Reserva reprogramada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 *
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único de la reserva
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID del usuario que realizó la reserva
 *         venueId:
 *           type: string
 *           format: uuid
 *           description: ID del venue donde se realizó la reserva
 *         date:
 *           type: string
 *           format: date
 *           description: Fecha de la reserva
 *         startTime:
 *           type: string
 *           description: Hora de inicio de la reserva
 *         endTime:
 *           type: string
 *           description: Hora de fin de la reserva
 *         status:
 *           type: string
 *           enum: [APROBACION_PENDIENTE, APROBADA, RECHAZADA, CANCELADA]
 *           description: Estado actual de la reserva
 *         qrToken:
 *           type: string
 *           description: Token QR para acceso
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación de la reserva
 *       required:
 *         - id
 *         - userId
 *         - venueId
 *         - date
 *         - startTime
 *         - endTime
 *         - status
 *         - createdAt
 */

export const createBookingRoutes = (controller: BookingController) => {
    const router = Router();

    router.post(
        "/",
        requireAuthentication,
        validateBody(createBookingBodySchema),
        controller.createBooking
    );

    router.get(
        "/my",
        requireAuthentication,
        controller.getMyBookings
    );

    router.get(
        "/:bookingId",
        requireAuthentication,
        validateParams(bookingIdParamsSchema),
        controller.getBookingById
    );

    router.patch(
        "/:bookingId/status",
        requireAuthenticatedAdmin,
        validateParams(bookingIdParamsSchema),
        validateBody(updateBookingStatusBodySchema),
        controller.updateBookingStatus
    );

    router.patch(
        "/:bookingId/cancel",
        requireAuthentication,
        validateParams(bookingIdParamsSchema),
        controller.cancelBooking
    );

    router.patch(
        "/:bookingId/reschedule",
        requireAuthentication,
        validateParams(bookingIdParamsSchema),
        validateBody(rescheduleBookingBodySchema),
        controller.rescheduleBooking
    );

    router.delete(
        "/:bookingId",
        requireAuthenticatedAdmin,
        validateParams(bookingIdParamsSchema),
        controller.deleteBooking
    );

    return router;
};
