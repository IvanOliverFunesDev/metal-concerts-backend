## 📌 Arquitectura

![Esquema de Arquitectura](public/frame1.png)

# 🎸 Band & Concerts API - Backend

Este proyecto es una plataforma para gestionar conciertos, bandas y suscripciones, con características de inicio de sesión, registro y control de usuarios, construido con Node.js, Express y MongoDB usando Mongoose.

## 📌 Características
✅ Registro e inicio de sesión de usuarios con JWT.  
✅ Gestión de conciertos y bandas con CRUD.  
✅ Sistema de suscripciones a bandas.  
✅ Soporte para reseñas de conciertos y bandas.  
✅ Implementación de Cloudinary para imágenes.  
✅ Configuración para Docker (opcional).  

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes requisitos:

- Node.js (versión 14 o superior)
- Docker (opcional, para ejecutar con contenedores)
- MongoDB (si no usas Docker)

## 📥 Instalación

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd backend-final-project
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:
   ```env
   PORT=3000
   MONGO_URI=mongodb://<usuario>:<contraseña>@<host>:<puerto>/<nombre_base_de_datos>
   JWT_SECRET=<tu_secreto_jwt>
   USER=<tu_usuario_email>
   PASS=<tu_contraseña_email>
   CLOUDINARY_CLOUD_NAME=<tu_nombre_cloudinary>
   CLOUDINARY_API_KEY=<tu_api_key_cloudinary>
   CLOUDINARY_API_SECRET=<tu_api_secret_cloudinary>
   ```

## 🐳 Uso con Docker (Opcional)

Si deseas ejecutar el proyecto con Docker:

1. Construye y levanta los contenedores:
   ```bash
   docker-compose up --build
   ```

2. El servidor estará corriendo en `http://localhost:3000`, y la base de datos MongoDB en `mongodb://localhost:27017`.

## 🚀 Uso

1. Inicia el servidor:
   ```bash
   npm start
   ```

2. El servidor estará corriendo en `http://localhost:3000`.

## 📚 Endpoints

### 🔐 Autenticación
- `POST /auth/register`: Registro de usuario.
- `POST /auth/login`: Inicio de sesión de usuario.
- `POST /auth/logout`: Cierre de sesión de usuario.
- `GET /auth/profile`: Obtiene el perfil del usuario autenticado.
- `GET /auth/verify-token`: Verifica el token de autenticación.

### 🎤 Conciertos
- `GET /concerts`: Obtiene todos los conciertos.
- `POST /concerts`: Crea un nuevo concierto.
- `GET /concerts/:id`: Obtiene un concierto por ID.
- `PUT /concerts/:id`: Actualiza un concierto por ID.
- `DELETE /concerts/:id`: Elimina un concierto por ID.

### 👥 Usuarios
- `GET /users`: Obtiene todos los usuarios.
- `GET /users/:id`: Obtiene un usuario por ID.
- `PUT /users/:id`: Actualiza un usuario por ID.
- `DELETE /users/:id`: Elimina un usuario por ID.

### 📬 Suscripciones
- `GET /subscriptions`: Obtiene todas las suscripciones.
- `POST /subscriptions`: Crea una nueva suscripción.
- `GET /subscriptions/:id`: Obtiene una suscripción por ID.
- `PUT /subscriptions/:id`: Actualiza una suscripción por ID.
- `DELETE /subscriptions/:id`: Elimina una suscripción por ID.

### 🎸 Bandas
- `GET /bands`: Obtiene todas las bandas.
- `POST /bands`: Crea una nueva banda.
- `GET /bands/:id`: Obtiene una banda por ID.
- `PUT /bands/:id`: Actualiza una banda por ID.
- `DELETE /bands/:id`: Elimina una banda por ID.

### 📝 Reseñas
- `GET /reviews`: Obtiene todas las reseñas.
- `POST /reviews`: Crea una nueva reseña.
- `GET /reviews/:id`: Obtiene una reseña por ID.
- `PUT /reviews/:id`: Actualiza una reseña por ID.
- `DELETE /reviews/:id`: Elimina una reseña por ID.

### 🔧 Administración
- `GET /admin`: Endpoint de administración.

## 🧪 Pruebas

Para ejecutar las pruebas:
```bash
npm test
```

Para ejecutar las pruebas en modo watch:
```bash
npm run test:watch
```

Para generar un reporte de cobertura de pruebas:
```bash
npm run test:coverage
```

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia ISC.

## 📂 Estructura 
📦src
 ┣ 📂config
 ┃ ┗ 📜cloudinary.js
 ┣ 📂constants
 ┃ ┣ 📜genres.js
 ┃ ┗ 📜locations.js
 ┣ 📂controllers
 ┃ ┣ 📂admin
 ┃ ┃ ┗ 📜band-approval.controller.js
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📜auth.controller.js
 ┃ ┃ ┣ 📜band-auth.controller.js
 ┃ ┃ ┣ 📜forgot-password.controller.js
 ┃ ┃ ┗ 📜user-auth.controller.js
 ┃ ┣ 📂bands
 ┃ ┃ ┗ 📜band.controller.js
 ┃ ┣ 📂concerts
 ┃ ┃ ┗ 📜concert.controller.js
 ┃ ┣ 📂review
 ┃ ┃ ┗ 📜review.controller.js
 ┃ ┣ 📂users
 ┃ ┃ ┗ 📜user.controller.js
 ┃ ┗ 📜subscription.controller.js
 ┣ 📂loaders
 ┃ ┣ 📜db.js
 ┃ ┣ 📜express.js
 ┃ ┗ 📜index.js
 ┣ 📂logs
 ┃ ┣ 📜combined.log
 ┃ ┗ 📜errors.log
 ┣ 📂middleware
 ┃ ┣ 📜check-admin.middleware.js
 ┃ ┣ 📜check-owner-ship.middleware.js
 ┃ ┣ 📜check-role.middleware.js
 ┃ ┣ 📜check-target-band-status.middleware.js
 ┃ ┣ 📜error-handling.middleware.js
 ┃ ┣ 📜logger.middleware.js
 ┃ ┣ 📜upload.middleware.js
 ┃ ┣ 📜validate-token.middleware.js
 ┃ ┗ 📜validator-schema.middleware.js
 ┣ 📂models
 ┃ ┣ 📜band.model.js
 ┃ ┣ 📜concerts.model.js
 ┃ ┣ 📜review.model.js
 ┃ ┗ 📜user.model.js
 ┣ 📂routes
 ┃ ┣ 📜admin.routes.js
 ┃ ┣ 📜auth.routes.js
 ┃ ┣ 📜band.routes.js
 ┃ ┣ 📜concert.routes.js
 ┃ ┣ 📜index.routes.js
 ┃ ┣ 📜review.routes.js
 ┃ ┣ 📜subscription.routes.js
 ┃ ┗ 📜user.routes.js
 ┣ 📂schemas
 ┃ ┗ 📂auth
 ┃ ┃ ┣ 📜band-auth.schema.js
 ┃ ┃ ┣ 📜create-concerts.schema.js
 ┃ ┃ ┣ 📜login-auth.schema.js
 ┃ ┃ ┣ 📜reset-password.schema.js
 ┃ ┃ ┣ 📜review.schema.js
 ┃ ┃ ┗ 📜user-auth.schema.js
 ┣ 📂services
 ┃ ┣ 📜cloudinary.service.js
 ┃ ┣ 📜email.service.js
 ┃ ┗ 📜jwt.js
 ┣ 📂utils
 ┃ ┣ 📜logger.js
 ┃ ┗ 📜responseHelper.js
 ┣ 📜app.js
 ┣ 📜config.js
 ┗ 📜index.js