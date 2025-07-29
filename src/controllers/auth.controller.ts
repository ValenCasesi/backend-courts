import { NextFunction, Request, Response } from 'express';
import { login } from '../services/auth.service';

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, token } = await login(req.body);
        res.json({ user, token });
    } catch (err) {
        next(err);
    }
};
