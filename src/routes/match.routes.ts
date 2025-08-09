// src/routes/match.routes.ts
import { Router } from 'express';
import * as matchCtrl from '../controllers/match.controller';

const router = Router();

/**
 * POST /api/matches
 * Crear nuevo partido
 */
router.post('/', matchCtrl.createMatch);

/**
 * GET /api/matches
 * Listar partidos (historial)
 */
router.get('/', matchCtrl.listMatches);

/**
 * GET /api/matches/:id
 * Obtener detalle de un partido
 */
router.get('/:id', matchCtrl.getMatch);

router.delete('/:id', matchCtrl.deleteMatch);

export default router;
