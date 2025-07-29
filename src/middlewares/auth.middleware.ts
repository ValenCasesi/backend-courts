import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export const ensureAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
        return res.status(401).json({ message: 'No token provided' });

    const token = auth.split(' ')[1];
    try {
        const payload = verifyToken(token);
        (req as any).user = payload;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};
