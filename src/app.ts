import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/error.handler';
import authRoutes from './routes/auth.routes';
import matchRoutes from './routes/match.routes';
import rankingRoutes from './routes/ranking.routes';
import userRoutes from './routes/user.routes';
import { setupSwagger } from './swagger';

const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/ranking', rankingRoutes);

app.use(errorHandler);

app.get('/', (_req, res) => {
    res.send('¡API de Padel operativa!');
});

export default app;