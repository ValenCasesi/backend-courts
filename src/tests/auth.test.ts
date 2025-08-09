// src/tests/user.test.ts

import request from 'supertest';
import app from '../app';
import prisma from '../models/prismaClient';

const TEST_USER = {
    email: 'test@example.com',
    password: 'secret',
    name: 'Tester',
};

let userId: number;
let token: string;

beforeAll(async () => {
    // Limpiar usuario de pruebas si existe
    await prisma.user.deleteMany({ where: { email: TEST_USER.email } });
});

afterAll(async () => {
    // Limpiar y cerrar conexión
    await prisma.user.deleteMany({ where: { email: TEST_USER.email } });
    await prisma.$disconnect();
});

describe('User API CRUD (con JWT)', () => {
    it('POST /api/users → crear usuario', async () => {
        const res = await request(app)
            .post('/api/users')
            .send(TEST_USER);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        userId = res.body.id;
    });

    it('POST /api/auth/login → obtenemos token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: TEST_USER.email,
                password: TEST_USER.password,
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('GET /api/users → lista de usuarios (protegido)', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some((u: any) => u.id === userId)).toBe(true);
    });

    it('GET /api/users/:id → obtiene solo ese usuario (protegido)', async () => {
        const res = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(userId);
        expect(res.body.email).toBe(TEST_USER.email);
    });

    it('PUT /api/users/:id → actualiza nombre (protegido)', async () => {
        const res = await request(app)
            .put(`/api/users/${userId}`)
            .send({ name: 'NuevoNombre' })
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('NuevoNombre');
    });

    it('DELETE /api/users/:id → elimina usuario (protegido)', async () => {
        const res = await request(app)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(204);
    });

    it('GET /api/users/:id → ahora no existe', async () => {
        const res = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(404);
    });
});
