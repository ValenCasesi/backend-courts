// src/controllers/match.controller.ts
import { NextFunction, Request, Response } from 'express';
import { CreateMatchDTO } from '../dtos/match.dto';
import * as matchService from '../services/match.service';

/**
 * @openapi
 * components:
 *   schemas:
 *     UserSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         lastName:
 *           type: string
 *
 *     MatchParticipant:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user:
 *           $ref: '#/components/schemas/UserSummary'
 *         isWinner:
 *           type: boolean
 *         points:
 *           type: integer
 *
 *     Match:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         date:
 *           type: string
 *           format: date-time
 *         pointsForWinners:
 *           type: integer
 *         pointsForLosers:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MatchParticipant'
 *
 *     CreateMatchRequest:
 *       type: object
 *       required:
 *         - date
 *         - players
 *         - winners
 *         - pointsForWinners
 *         - pointsForLosers
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del partido en formato ISO (p.ej. 2025-08-06T20:00:00.000Z)
 *         players:
 *           type: array
 *           items:
 *             type: integer
 *           description: Array de 4 userIds (seleccionados en el frontend)
 *           example: [1,2,3,4]
 *         winners:
 *           type: array
 *           items:
 *             type: integer
 *           description: Array de 2 userIds (subconjunto de players)
 *           example: [1,4]
 *         pointsForWinners:
 *           type: integer
 *           description: Puntos que suman los ganadores (positivo)
 *           example: 50
 *         pointsForLosers:
 *           type: integer
 *           description: Puntos que se restan a los perdedores (positivo)
 *           example: 25
 */

/**
 * Helper: mapea un match (Prisma result) para respuesta JSON.
 * Garantiza que cada participant tenga un `user` con datos (usa snapshot si user es null).
 */
function mapMatchForResponse(match: any) {
    const mappedParticipants = (match.participants ?? []).map((p: any) => {
        const user = p.user
            ? {
                id: p.user.id ?? null,
                name: p.user.name ?? null,
                lastName: p.user.lastName ?? null,
                email: p.user.email ?? null,
            }
            : {
                id: p.userId ?? null,
                name: p.userName ?? null,
                lastName: p.userLastName ?? null,
                email: p.userEmail ?? null,
            };

        return {
            id: p.id,
            isWinner: p.isWinner,
            points: p.points,
            user,
        };
    });

    return {
        id: match.id,
        date: match.date,
        pointsForWinners: match.pointsForWinners,
        pointsForLosers: match.pointsForLosers,
        createdAt: match.createdAt,
        participants: mappedParticipants,
    };
}

/**
 * @openapi
 * /api/matches:
 *   post:
 *     summary: Crear un nuevo partido (match)
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMatchRequest'
 *           example:
 *             date: "2025-08-06T20:00:00.000Z"
 *             players: [1, 2, 3, 4]
 *             winners: [1, 4]
 *             pointsForWinners: 50
 *             pointsForLosers: 25
 *     responses:
 *       201:
 *         description: Partido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 match:
 *                   $ref: '#/components/schemas/Match'
 */
export const createMatch = async (req: Request<{}, {}, CreateMatchDTO>, res: Response, next: NextFunction) => {
    try {
        const body = req.body;

        if (!body || !body.date || !body.players || !body.winners) {
            return res.status(400).json({ message: 'Invalid payload' });
        }

        body.pointsForWinners = Number(body.pointsForWinners ?? 0);
        body.pointsForLosers = Number(body.pointsForLosers ?? 0);

        const match = await matchService.createMatch(body);

        const mapped = mapMatchForResponse(match);
        return res.status(201).json({ message: 'Match created', match: mapped });
    } catch (err: any) {
        if (err.message && /must|required|distinct|exist/i.test(err.message)) {
            return res.status(400).json({ message: err.message });
        }
        next(err);
    }
};

/**
 * @openapi
 * /api/matches:
 *   get:
 *     summary: Listar partidos (historial)
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Cantidad máxima de resultados
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset para paginación
 *     responses:
 *       200:
 *         description: Lista de partidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 matches:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Match'
 */
export const listMatches = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = Number(req.query.limit ?? 50);
        const offset = Number(req.query.offset ?? 0);
        const matches = await matchService.listMatches(limit, offset);
        const mapped = matches.map((m: any) => mapMatchForResponse(m));
        res.json({ message: 'Matches retrieved', matches: mapped });
    } catch (err) {
        next(err);
    }
};

/**
 * @openapi
 * /api/matches/{id}:
 *   get:
 *     summary: Obtener detalle de un partido por ID
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del partido
 *     responses:
 *       200:
 *         description: Detalle del partido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 match:
 *                   $ref: '#/components/schemas/Match'
 */
export const getMatch = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
        const match = await matchService.getMatchById(id);
        if (!match) return res.status(404).json({ message: 'Match not found' });

        const mapped = mapMatchForResponse(match);
        res.json({ message: 'Match retrieved', match: mapped });
    } catch (err) {
        next(err);
    }
};

/**
 * @openapi
 * /api/matches/{id}:
 *   delete:
 *     summary: Elimina un partido por ID
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del partido a eliminar
 *     responses:
 *       200:
 *         description: Partido eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Match deleted
 *                 match:
 *                   $ref: '#/components/schemas/Match'
 */
export const deleteMatch = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

        const deleted = await matchService.deleteMatch(id);
        const mapped = mapMatchForResponse(deleted);
        return res.json({ message: 'Match deleted', match: mapped });
    } catch (err: any) {
        if (err.message === 'Match not found') return res.status(404).json({ message: err.message });
        next(err);
    }
};
