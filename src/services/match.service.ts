// src/services/match.service.ts
import { CreateMatchDTO } from '../dtos/match.dto';
import prisma from '../models/prismaClient';

export async function createMatch(data: CreateMatchDTO) {
    // validations
    if (!data.date) throw new Error('Date is required');
    if (!Array.isArray(data.players) || data.players.length !== 4) {
        throw new Error('Players must be an array of 4 userIds');
    }
    if (!Array.isArray(data.winners) || data.winners.length !== 2) {
        throw new Error('Winners must be an array of 2 userIds');
    }
    const uniquePlayers = new Set(data.players);
    if (uniquePlayers.size !== 4) throw new Error('Players must be 4 distinct users');
    const winnersSet = new Set(data.winners);
    if (winnersSet.size !== 2) throw new Error('Winners must be 2 distinct users');
    for (const w of data.winners) {
        if (!uniquePlayers.has(w)) throw new Error('Each winner must be one of the selected players');
    }
    if (data.pointsForWinners <= 0 || data.pointsForLosers < 0) throw new Error('Points must be positive numbers');

    return prisma.$transaction(async (tx) => {
        // traemos usuarios con los campos que necesitamos para snapshot
        const users = await tx.user.findMany({
            where: { id: { in: data.players } },
            select: { id: true, name: true, lastName: true, email: true },
        });

        if (users.length !== 4) throw new Error('One or more selected players do not exist');

        const usersMap = new Map<number, { id: number; name?: string | null; lastName?: string | null; email?: string | null }>(
            users.map(u => [u.id, u])
        );

        // armamos los participants con snapshot
        const participantsCreate = [
            // winners -> positive points
            ...data.winners.map((uid) => {
                const u = usersMap.get(uid)!;
                return {
                    userId: uid,
                    isWinner: true,
                    points: data.pointsForWinners,
                    userName: u?.name ?? null,
                    userLastName: u?.lastName ?? null,
                    userEmail: u?.email ?? null
                };
            }),
            // losers -> negative points
            ...data.players.filter((uid) => !winnersSet.has(uid)).map((uid) => {
                const u = usersMap.get(uid)!;
                return {
                    userId: uid,
                    isWinner: false,
                    points: -data.pointsForLosers,
                    userName: u?.name ?? null,
                    userLastName: u?.lastName ?? null,
                    userEmail: u?.email ?? null
                };
            })
        ];

        const match = await tx.match.create({
            data: {
                date: new Date(data.date),
                pointsForWinners: data.pointsForWinners,
                pointsForLosers: data.pointsForLosers,
                participants: {
                    create: participantsCreate
                }
            },
            include: {
                participants: { include: { user: { select: { id: true, name: true, lastName: true, email: true } } } }
            }
        });

        return match;
    });
}

export async function listMatches(limit = 50, offset = 0) {
    return prisma.match.findMany({
        orderBy: { date: 'desc' },
        take: limit,
        skip: offset,
        include: {
            participants: { include: { user: { select: { id: true, name: true, lastName: true, email: true } } } },
        },
    });
}

export async function getMatchById(id: number) {
    return prisma.match.findUnique({
        where: { id },
        include: {
            participants: { include: { user: { select: { id: true, name: true, lastName: true, email: true } } } },
        },
    });
}

export async function deleteMatch(id: number) {
    return prisma.$transaction(async (tx) => {
        const match = await tx.match.findUnique({
            where: { id },
            include: {
                participants: { include: { user: { select: { id: true, name: true, lastName: true, email: true } } } },
            },
        });

        if (!match) throw new Error('Match not found');

        await tx.matchParticipant.deleteMany({ where: { matchId: id } });
        await tx.match.delete({ where: { id } });

        return match;
    });
}
