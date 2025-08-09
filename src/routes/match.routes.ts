// src/routes/match.routes.ts
import { Router } from 'express';
import * as matchCtrl from '../controllers/match.controller';
import { ensureAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

/**
 * POST /api/matches
 * Crear nuevo partido
 */
router.post('/', ensureAuthenticated, matchCtrl.createMatch);

/**
 * GET /api/matches
 * Listar partidos (historial)
 */
router.get('/', ensureAuthenticated, matchCtrl.listMatches);

/**
 * GET /api/matches/:id
 * Obtener detalle de un partido
 */
router.get('/:id', ensureAuthenticated, matchCtrl.getMatch);

router.delete('/:id', ensureAuthenticated, matchCtrl.deleteMatch);

export default router;
