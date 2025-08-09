# API Padel

API REST para gestión de usuarios, partidos y rankings, desarrollada en **Node.js, Express, TypeScript, Prisma y PostgreSQL (Supabase)**.

Incluye:
- CRUD de usuarios (con protección JWT).
- CRUD de partidos.
- Ranking de usuarios y KPI's.
- Autenticación (login/register).
- Documentación automática con Swagger.
- Tests con Jest y Supertest.
- Configuración lista para Docker.

---

## **Requisitos**

- Node.js >= 18
- npm >= 9
- PostgreSQL (o Supabase)

---

## **Instalación**

Clona el proyecto e instala dependencias:

```bash
git clone https://github.com/TU-USUARIO/api-padel.git
cd api-padel
npm install