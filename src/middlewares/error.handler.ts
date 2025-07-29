// src/middlewares/error.handler.ts

import { NextFunction, Request, Response } from 'express';

interface HttpError extends Error {
    statusCode?: number;
}

export function errorHandler(
    err: HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    // Si el error ya trae un statusCode (por ejemplo lanzado manualmente), úsalo;
    // si no, por defecto es 500.
    const status = err.statusCode ?? 500;

    // Mensaje de error: si es producción, podrías ocultar detalles.
    const message =
        process.env.NODE_ENV === 'production' && status === 500
            ? 'Internal server error'
            : err.message;

    // Logueo (puedes ampliar con Winston, etc.)
    console.error(`[${new Date().toISOString()}]`, err);

    res.status(status).json({
        status,
        message,
    });
}
