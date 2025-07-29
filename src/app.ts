import express from 'express';
import { errorHandler } from './middlewares/error.handler';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { setupSwagger } from './swagger';

const app = express();
app.use(express.json());

setupSwagger(app);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use(errorHandler);

app.get('/', (_req, res) => {
    res.send('¡API de Padel operativa!');
});

export default app;