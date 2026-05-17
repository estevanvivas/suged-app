import {Router} from "express";

import {requireAuthenticatedAdmin, requireAuthentication} from "@infra/http/middlewares/auth.middleware";
import {validateBody} from "@infra/http/middlewares/body-validation.middleware";
import {validateParams} from "@infra/http/middlewares/params-validation.middleware";
import {validateQuery} from "@infra/http/middlewares/query-validation.middleware";
import {VenueController} from "@venues-module/interfaces/http/venue.controller";
import {createRecurringBlockBodySchema} from "@venues-module/interfaces/http/validation/create-recurring-block.schema";
import {createVenueBlockBodySchema} from "@venues-module/interfaces/http/validation/create-venue-block.schema";
import {createVenueBodySchema} from "@venues-module/interfaces/http/validation/create-venue.schema";
import {deleteVenueBlockParamsSchema} from "@venues-module/interfaces/http/validation/delete-venue-block-params.schema";
import {
    getVenueAvailableTimeSlotsQuerySchema,
} from "@venues-module/interfaces/http/validation/get-venue-available-time-slots.schema";
import {getVenueCalendarQuerySchema} from "@venues-module/interfaces/http/validation/get-venue-calendar.schema";
import {updateVenueBodySchema} from "@venues-module/interfaces/http/validation/update-venue.schema";
import {
    upsertVenueScheduleBodySchema,
} from "@venues-module/interfaces/http/validation/upsert-venue-schedule.schema";
import {recurringBlockParamsSchema} from "@venues-module/interfaces/http/validation/recurring-block-params.schema";
import {updateRecurringBlockBodySchema} from "@venues-module/interfaces/http/validation/update-recurring-block.schema";
import {venueIdParamsSchema} from "@venues-module/interfaces/http/validation/venue-id-params.schema";

/**
 * @swagger
 * /api/venues:
 *   post:
 *     summary: Crear un nuevo venue (Admin)
 *     description: Crea un nuevo venue. Solo administradores pueden hacer esto.
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del venue
 *               description:
 *                 type: string
 *                 description: Descripción del venue
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Capacidad maxima del venue
 *             required:
 *               - name
 *               - description
 *               - capacity
 *     responses:
 *       201:
 *         description: Venue creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venue'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado (requiere ser admin)
 *
 * /api/venues/{venueId}:
 *   patch:
 *     summary: Actualizar venue (Admin)
 *     description: Actualiza la información de un venue existente
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: venueId
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
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del venue
 *               description:
 *                 type: string
 *                 description: Nueva descripcion del venue
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Nueva capacidad maxima del venue
 *             minProperties: 1
 *     responses:
 *       200:
 *         description: Venue actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venue'
 *       401:
 *         description: No autorizado (requiere ser admin)
 *       404:
 *         description: Venue no encontrado
 *   delete:
 *     summary: Eliminar venue (Admin)
 *     description: Elimina un venue de forma permanente
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: venueId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Venue eliminado exitosamente
 *       401:
 *         description: No autorizado (requiere ser admin)
 *       404:
 *         description: Venue no encontrado
 *
 * /api/venues/{venueId}/available-time-slots:
 *   get:
 *     summary: Obtener slots de tiempo disponibles
 *     description: Retorna los horarios disponibles para un venue en una fecha específica
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: venueId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: date
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para consultar disponibilidad
 *     responses:
 *       200:
 *         description: Slots disponibles obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TimeSlot'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Venue no encontrado
 *
 * /api/venues/{venueId}/calendar:
 *   get:
 *     summary: Obtener calendario del venue
 *     description: Retorna el calendario de disponibilidad del venue
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: venueId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: from
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango (YYYY-MM-DD)
 *       - name: to
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Calendario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VenueCalendarDay'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Venue no encontrado
 *
 * /api/venues/{venueId}/schedules:
 *   post:
 *     summary: Crear o actualizar horario del venue (Admin)
 *     description: Define o actualiza el horario de operación del venue
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: venueId
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
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 7
 *                 description: Dia de la semana (1 lunes, 7 domingo)
 *               openingTime:
 *                 type: string
 *                 example: "08:00:00"
 *                 description: Hora de apertura en formato HH:mm:ss
 *               closingTime:
 *                 type: string
 *                 example: "18:00:00"
 *                 description: Hora de cierre en formato HH:mm:ss
 *             required:
 *               - dayOfWeek
 *               - openingTime
 *               - closingTime
 *     responses:
 *       204:
 *         description: Horario actualizado exitosamente, sin contenido de respuesta
 *       401:
 *         description: No autorizado (requiere ser admin)
 *       404:
 *         description: Venue no encontrado
 *
 * /api/venues/{venueId}/blocks:
 *   post:
 *     summary: Crear bloqueo de tiempo (Admin)
 *     description: Crea un bloqueo de tiempo puntual para un venue
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: venueId
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
 *                 description: Fecha del bloqueo puntual (YYYY-MM-DD)
 *               startTime:
 *                 type: string
 *                 example: "12:00:00"
 *                 description: Hora de inicio en formato HH:mm:ss
 *               endTime:
 *                 type: string
 *                 example: "13:00:00"
 *                 description: Hora de fin en formato HH:mm:ss
 *               reason:
 *                 type: string
 *                 description: Motivo opcional del bloqueo
 *             required:
 *               - date
 *               - startTime
 *               - endTime
 *     responses:
 *       201:
 *         description: Bloqueo creado exitosamente
 *       401:
 *         description: No autorizado (requiere ser admin)
 *       404:
 *         description: Venue no encontrado
 *
 * /api/venues/{venueId}/blocks/{blockId}:
 *   delete:
 *     summary: Eliminar bloqueo de tiempo (Admin)
 *     description: Elimina un bloqueo de tiempo específico
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: venueId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: blockId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Bloqueo eliminado exitosamente
 *       401:
 *         description: No autorizado (requiere ser admin)
 *       404:
 *         description: Bloqueo o venue no encontrado
 *
 * /api/venues/{venueId}/recurring-blocks:
 *   get:
 *     summary: Listar bloqueos recurrentes (Admin)
 *     description: Obtiene todos los bloqueos recurrentes de un venue
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: venueId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Bloqueos recurrentes obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecurringBlock'
 *       401:
 *         description: No autorizado (requiere ser admin)
 *       404:
 *         description: Venue no encontrado
 *   post:
 *     summary: Crear bloqueo recurrente (Admin)
 *     description: Crea un bloqueo recurrente (ej. fines de semana, días específicos)
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: venueId
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
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 7
 *                 description: Dia de la semana (1 lunes, 7 domingo)
 *               startTime:
 *                 type: string
 *                 example: "08:00:00"
 *                 description: Hora de inicio en formato HH:mm:ss
 *               endTime:
 *                 type: string
 *                 example: "09:00:00"
 *                 description: Hora de fin en formato HH:mm:ss
 *               reason:
 *                 type: string
 *                 description: Motivo opcional del bloqueo recurrente
 *             required:
 *               - dayOfWeek
 *               - startTime
 *               - endTime
 *     responses:
 *       201:
 *         description: Bloqueo recurrente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecurringBlock'
 *       401:
 *         description: No autorizado (requiere ser admin)
 *       404:
 *         description: Venue no encontrado
 *
 * /api/venues/{venueId}/recurring-blocks/{recurringBlockId}:
 *   get:
 *     summary: Obtener bloqueo recurrente (Admin)
 *     description: Obtiene detalles de un bloqueo recurrente específico
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: venueId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: recurringBlockId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Bloqueo recurrente obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecurringBlock'
 *       401:
 *         description: No autorizado (requiere ser admin)
 *       404:
 *         description: Bloqueo o venue no encontrado
 *   patch:
 *     summary: Actualizar bloqueo recurrente (Admin)
 *     description: Actualiza un bloqueo recurrente existente
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: venueId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: recurringBlockId
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
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 7
 *                 description: Dia de la semana (1 lunes, 7 domingo)
 *               startTime:
 *                 type: string
 *                 example: "08:00:00"
 *                 description: Hora de inicio en formato HH:mm:ss
 *               endTime:
 *                 type: string
 *                 example: "09:00:00"
 *                 description: Hora de fin en formato HH:mm:ss
 *               reason:
 *                 type: string
 *                 nullable: true
 *                 description: Motivo opcional del bloqueo recurrente
 *             minProperties: 1
 *     responses:
 *       200:
 *         description: Bloqueo recurrente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecurringBlock'
 *       401:
 *         description: No autorizado (requiere ser admin)
 *       404:
 *         description: Bloqueo o venue no encontrado
 *   delete:
 *     summary: Eliminar bloqueo recurrente (Admin)
 *     description: Elimina un bloqueo recurrente existente
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: venueId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: recurringBlockId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Bloqueo recurrente eliminado exitosamente
 *       401:
 *         description: No autorizado (requiere ser admin)
 *       404:
 *         description: Bloqueo o venue no encontrado
 *
 * components:
 *   schemas:
 *     Venue:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del venue
 *         description:
 *           type: string
 *           description: Descripcion del venue
 *         capacity:
 *           type: integer
 *           description: Capacidad maxima del venue
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           description: URL de imagen del venue, si existe
 *       required:
 *         - name
 *         - description
 *         - capacity
 *     TimeSlot:
 *       type: object
 *       properties:
 *         startTime:
 *           type: string
 *           example: "08:00:00"
 *         endTime:
 *           type: string
 *           example: "09:00:00"
 *         label:
 *           type: string
 *           example: "08:00 - 09:00"
 *       required:
 *         - startTime
 *         - endTime
 *         - label
 *     VenueCalendarDay:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *         dayOfWeek:
 *           type: integer
 *           minimum: 1
 *           maximum: 7
 *           description: Dia de la semana (1 lunes, 7 domingo)
 *         isOpen:
 *           type: boolean
 *           description: Indica si el venue tiene horario configurado ese dia
 *         slots:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TimeSlot'
 *       required:
 *         - date
 *         - dayOfWeek
 *         - isOpen
 *         - slots
 *     RecurringBlock:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         venueId:
 *           type: string
 *           format: uuid
 *         dayOfWeek:
 *           type: integer
 *           minimum: 1
 *           maximum: 7
 *         startTime:
 *           type: string
 *           example: "08:00:00"
 *         endTime:
 *           type: string
 *           example: "09:00:00"
 *         reason:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - venueId
 *         - dayOfWeek
 *         - startTime
 *         - endTime
 *         - createdAt
 */

export const createVenueRoutes = (controller: VenueController) => {
    const router = Router();

    router.post(
        "/",
        requireAuthenticatedAdmin,
        validateBody(createVenueBodySchema),
        controller.createVenue
    );

    router.patch(
        "/:venueId/",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        validateBody(updateVenueBodySchema),
        controller.upateVenue
    );

    router.delete(
        "/:venueId/",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        controller.deleteVenue
    );

    router.get(
        "/:venueId/available-time-slots",
        requireAuthentication,
        validateParams(venueIdParamsSchema),
        validateQuery(getVenueAvailableTimeSlotsQuerySchema),
        controller.getAvailableTimeSlots
    );

    router.get(
        "/:venueId/calendar",
        requireAuthentication,
        validateParams(venueIdParamsSchema),
        validateQuery(getVenueCalendarQuerySchema),
        controller.getCalendar
    );

    router.post(
        "/:venueId/schedules",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        validateBody(upsertVenueScheduleBodySchema),
        controller.upsertVenueSchedule
    );

    router.post(
        "/:venueId/blocks",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        validateBody(createVenueBlockBodySchema),
        controller.createVenueBlock
    );

    router.delete(
        "/:venueId/blocks/:blockId",
        requireAuthenticatedAdmin,
        validateParams(deleteVenueBlockParamsSchema),
        controller.deleteVenueBlock
    );

    router.get(
        "/:venueId/recurring-blocks",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        controller.listRecurringBlocks
    );

    router.get(
        "/:venueId/recurring-blocks/:recurringBlockId",
        requireAuthenticatedAdmin,
        validateParams(recurringBlockParamsSchema),
        controller.getRecurringBlock
    );

    router.post(
        "/:venueId/recurring-blocks",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        validateBody(createRecurringBlockBodySchema),
        controller.createRecurringBlock
    );

    router.patch(
        "/:venueId/recurring-blocks/:recurringBlockId",
        requireAuthenticatedAdmin,
        validateParams(recurringBlockParamsSchema),
        validateBody(updateRecurringBlockBodySchema),
        controller.updateRecurringBlock
    );

    router.delete(
        "/:venueId/recurring-blocks/:recurringBlockId",
        requireAuthenticatedAdmin,
        validateParams(recurringBlockParamsSchema),
        controller.deleteRecurringBlock
    );

    return router;
};
