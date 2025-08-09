import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../models/prismaClient';
import { signToken } from '../utils/jwt';

export interface LoginDTO {
    email: string;
    password: string;
}

export const login = async ({
    email,
    password,
}: LoginDTO): Promise<{ user: Omit<User, 'password'>; token: string }> => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

    const token = signToken({ sub: user.id, email: user.email });
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
};
