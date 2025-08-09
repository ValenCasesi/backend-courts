import { Router } from 'express';
import * as rankingCtrl from '../controllers/ranking.controller';

const router = Router();

// lista el ranking (top N)
router.get('/', rankingCtrl.getRanking);

// stats para dashboard (total players, leader, avg points)
router.get('/dashboard', rankingCtrl.getDashboardStats);
//ensureAuthenticated,
export default router;