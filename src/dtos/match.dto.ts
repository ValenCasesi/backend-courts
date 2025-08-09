export interface CreateMatchDTO {
    date: string;                // ISO string, p.ej. "2025-08-06T20:00:00.000Z"
    players: number[];           // array de 4 userIds, p.ej. [1,2,3,4]
    winners: number[];           // array de 2 userIds (subconjunto de players)
    pointsForWinners: number;    // entero positivo, p.ej. 50
    pointsForLosers: number;     // entero positivo, p.ej. 25
}