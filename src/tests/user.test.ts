import request from 'supertest';
import app from '../app';
import { prisma } from '../models/prismaClient';

beforeAll(async () => {
    // Asegura tablas limpias
    await prisma.user.deleteMany();
});

afterAll(async () => {
    // Limpia y cierra conexión
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});

describe('User API CRUD', () => {
    let userId: number;

    it('POST /api/users → crear usuario', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ email: 'test@example.com', password: 'secret', name: 'Tester' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe('test@example.com');
        expect(res.body).not.toHaveProperty('password');

        userId = res.body.id;
    });

    it('GET /api/users → lista de usuarios incluye el creado', async () => {
        const res = await request(app).get('/api/users');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some((u: any) => u.id === userId)).toBe(true);
    });

    it('GET /api/users/:id → obtiene solo ese usuario', async () => {
        const res = await request(app).get(`/api/users/${userId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(userId);
        expect(res.body.email).toBe('test@example.com');
    });

    it('PUT /api/users/:id → actualiza nombre', async () => {
        const res = await request(app)
            .put(`/api/users/${userId}`)
            .send({ name: 'Nuevo Nombre' });

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Nuevo Nombre');
    });

    it('DELETE /api/users/:id → elimina usuario', async () => {
        const res = await request(app).delete(`/api/users/${userId}`);
        expect(res.status).toBe(204);
    });

    it('GET /api/users/:id → ahora no existe', async () => {
        const res = await request(app).get(`/api/users/${userId}`);
        expect(res.status).toBe(404);
    });
});
