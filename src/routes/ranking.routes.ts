import { Router } from 'express';
import * as rankingCtrl from '../controllers/ranking.controller';
import { ensureAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// lista el ranking (top N)
router.get('/', ensureAuthenticated, rankingCtrl.getRanking);

// stats para dashboard (total players, leader, avg points)
router.get('/dashboard', ensureAuthenticated, rankingCtrl.getDashboardStats);

export default router;