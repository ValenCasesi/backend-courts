// src/server.ts
import dotenv from 'dotenv';
// si NODE_ENV === 'test' carga .env.test, sino .env
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

import app from './app';

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server en http://localhost:${PORT}`));
