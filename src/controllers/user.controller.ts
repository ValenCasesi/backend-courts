import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user.service';

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({
            message: 'User created successfully',
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (err) {
        next(err);
    }
};

export const listUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        const safe = users.map(u => ({ id: u.id, email: u.email, name: u.name }));
        res.json({
            message: `Found ${safe.length} user(s)`,
            users: safe
        });
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const user = await userService.getUserById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({
            message: 'User retrieved successfully',
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const user = await userService.updateUser(id, req.body);
        res.json({
            message: 'User updated successfully',
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        await userService.deleteUser(id);
        res.json({ message: `User with ID ${id} deleted successfully` });
    } catch (err) {
        next(err);
    }
};
