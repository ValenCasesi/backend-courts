import prisma from '../models/prismaClient';

export interface RankingRow {
    id: number;
    name: string | null;
    lastName: string | null;
    email: string | null;
    total_points: number;
    matches: number;
    wins: number;
    win_rate: number | null; // porcentaje (0..100) con 2 decimales
}

export async function getRanking(limit = 10, offset = 0): Promise<RankingRow[]> {
    const rows = await prisma.$queryRaw<RankingRow[]>`
    SELECT
      u.id,
      u.name,
      u."lastName",
      u.email,
      COALESCE(SUM(mp.points), 0)::int AS total_points,
      COUNT(mp.*)::int AS matches,
      COALESCE(SUM(CASE WHEN mp."isWinner" THEN 1 ELSE 0 END),0)::int AS wins,
      CASE WHEN COUNT(mp.*) = 0 THEN NULL
           ELSE ROUND((SUM(CASE WHEN mp."isWinner" THEN 1 ELSE 0 END)::numeric / COUNT(mp.*)) * 100, 2)
      END AS win_rate
    FROM "User" u
    LEFT JOIN "MatchParticipant" mp ON mp."userId" = u.id
    GROUP BY u.id, u.name, u."lastName", u.email
    ORDER BY total_points DESC
    LIMIT ${limit} OFFSET ${offset};
  `;
    return rows;
}

export interface DashboardStats {
    totalPlayers: number;
    leader?: { id: number; name: string | null; lastName: string | null; email: string | null; total_points: number } | null;
    averagePoints: number; // redondeado
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const totalPlayers = await prisma.user.count();

    // leader: top 1 by total_points
    const top = await prisma.$queryRaw<
        { id: number; name: string | null; "lastName": string | null; email: string | null; total_points: number }[]
    >`
    SELECT u.id, u.name, u."lastName", u.email, COALESCE(SUM(mp.points),0)::int AS total_points
    FROM "User" u
    LEFT JOIN "MatchParticipant" mp ON mp."userId" = u.id
    GROUP BY u.id, u.name, u."lastName", u.email
    ORDER BY total_points DESC
    LIMIT 1;
  `;

    // average points per user: compute totals per user and avg them
    const totals = await prisma.$queryRaw<{ total_points: number }[]>`
    SELECT COALESCE(SUM(mp.points),0)::int AS total_points
    FROM "User" u
    LEFT JOIN "MatchParticipant" mp ON mp."userId" = u.id
    GROUP BY u.id;
  `;
    const avg =
        totals.length === 0 ? 0 : Math.round((totals.reduce((s, r) => s + Number(r.total_points), 0) / totals.length) || 0);

    return {
        totalPlayers,
        leader: top[0]
            ? {
                id: top[0].id,
                name: top[0].name,
                lastName: top[0].lastName,
                email: top[0].email,
                total_points: Number(top[0].total_points),
            }
            : null,
        averagePoints: avg,
    };
}