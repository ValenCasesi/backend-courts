import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export interface CreateUserDTO {
    email: string;
    password: string;
    name?: string;
}

export const createUser = async (data: CreateUserDTO): Promise<User> => {
    const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
    return prisma.user.create({
        data: {
            email: data.email,
            password: hashed,
            name: data.name,
        },
    });
};

export const getAllUsers = async (): Promise<User[]> => {
    return prisma.user.findMany();
};

export const getUserById = async (id: number): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } });
};

export const updateUser = async (
    id: number,
    data: Partial<CreateUserDTO>
): Promise<User> => {
    const updateData: Partial<CreateUserDTO> = { ...data };

    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    return prisma.user.update({
        where: { id },
        data: updateData,
    });
};

export const deleteUser = async (id: number): Promise<User> => {
    return prisma.user.delete({ where: { id } });
};
