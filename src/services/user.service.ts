import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto'

const prisma = new PrismaClient()
const SALT_ROUNDS = 10

export async function createUser(data: CreateUserDTO): Promise<User> {
    const hash = await bcrypt.hash(data.password, SALT_ROUNDS)
    return prisma.user.create({
        data: {
            email: data.email,
            password: hash,
            name: data.name,
            lastName: data.lastName,
        },
    })
}

export async function getAllUsers(): Promise<User[]> {
    return prisma.user.findMany()
}

export async function getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
}

export async function updateUser(id: number, data: UpdateUserDTO): Promise<User> {
    const updateData: any = { ...data }
    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS)
    }
    return prisma.user.update({
        where: { id },
        data: updateData,
    })
}

export async function deleteUser(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } })
}
