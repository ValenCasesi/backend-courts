import { NextFunction, Request, Response } from 'express'
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto'
import * as userService from '../services/user.service'

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
 *         lastName:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
export const createUser = async (
    req: Request<{}, {}, CreateUserDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password, name, lastName } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y password son obligatorios' })
        }
        const user = await userService.createUser({ email, password, name, lastName })
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                lastName: user.lastName,
            },
        })
    } catch (err) {
        next(err)
    }
}

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
export const listUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers()
        const safe = users.map(u => ({
            id: u.id,
            email: u.email,
            name: u.name,
            lastName: u.lastName,
        }))
        res.json({
            message: `Found ${safe.length} user(s)`,
            users: safe,
        })
    } catch (err) {
        next(err)
    }
}

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
export const getUser = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id)
        const user = await userService.getUserById(id)
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json({
            message: 'User retrieved successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                lastName: user.lastName,
            },
        })
    } catch (err) {
        next(err)
    }
}

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
export const updateUser = async (
    req: Request<{ id: string }, {}, UpdateUserDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id)
        const { email, password, name, lastName } = req.body
        if (!email && !password && !name && !lastName) {
            return res
                .status(400)
                .json({ message: 'Debes enviar al menos un campo para actualizar' })
        }
        const user = await userService.updateUser(id, { email, password, name, lastName })
        res.json({
            message: 'User updated successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                lastName: user.lastName,
            },
        })
    } catch (err) {
        next(err)
    }
}

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 */
export const deleteUser = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id)
        await userService.deleteUser(id)
        res.json({ message: `User with ID ${id} deleted successfully` })
    } catch (err) {
        next(err)
    }
}
