# User Management API

API REST construida con Node.js, Express, y arquitectura hexagonal (Clean Architecture). Permite gestionar usuarios con operaciones CRUD, validación de datos, seguridad de contraseñas y eventos de dominio. Usa Prisma con PostgreSQL, y está preparada para correr en Docker.


### Características

Arquitectura hexagonal (puertos y adaptadores).

Gestión de usuarios (CRUD).

Validación con Value Objects (Email, Password).

Hash de contraseñas con bcrypt.

Base de datos PostgreSQL gestionada por Prisma.

Eventos de dominio (UserEventBus).

Tests unitarios y end-to-end (Jest, Supertest).

Contenedor Docker listo.


### Stack

Node.js + Express

TypeScript

Prisma + PostgreSQL

Docker

Jest + Supertest


### Variables de entorno

Crea un archivo .env en la raíz del proyecto con:

```env
DATABASE_URL=url_ddbb
JWT_SECRET=clave_ultra_secreta
RABBITMQ_URL=amqp://foo@foo
```
