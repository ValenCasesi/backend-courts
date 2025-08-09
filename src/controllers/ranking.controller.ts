import { NextFunction, Request, Response } from 'express';
import * as rankingService from '../services/ranking.service';

/**
 * @openapi
 * /api/ranking:
 *   get:
 *     summary: Obtener ranking de jugadores (ordenado por puntos)
 *     tags:
 *       - Ranking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad máxima de resultados
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset para paginación
 *     responses:
 *       200:
 *         description: Ranking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ranking:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       name: { type: string }
 *                       lastName: { type: string }
 *                       email: { type: string }
 *                       total_points: { type: integer }
 *                       matches: { type: integer }
 *                       wins: { type: integer }
 *                       win_rate: { type: number, description: 'Porcentaje (0..100), puede ser null si no jugó' }
 */

export const getRanking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = Math.max(1, Number(req.query.limit ?? 10));
        const offset = Math.max(0, Number(req.query.offset ?? 0));
        const rows = await rankingService.getRanking(limit, offset);
        return res.json({ message: 'Ranking retrieved', ranking: rows });
    } catch (err) {
        next(err);
    }
};

/**
 * @openapi
 * /api/ranking/dashboard:
 *   get:
 *     summary: Obtener estadísticas para el dashboard (total jugadores, líder actual, promedio puntos)
 *     tags:
 *       - Ranking
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats del dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalPlayers:
 *                       type: integer
 *                     leader:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id: { type: integer }
 *                         name: { type: string }
 *                         lastName: { type: string }
 *                         email: { type: string }
 *                         total_points: { type: integer }
 *                     averagePoints:
 *                       type: integer
 */
export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await rankingService.getDashboardStats();
        return res.json({ message: 'Dashboard stats', stats });
    } catch (err) {
        next(err);
    }
};