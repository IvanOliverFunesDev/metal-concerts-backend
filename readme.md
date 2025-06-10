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
``` 
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
 ```
## 📂 Coleccion Postman

Este proyecto incluye una **colección de Postman** para probar la API de gestión de conciertos de metal, usuarios, bandas y más. A continuación, se describen las variables de entorno necesarias para utilizar correctamente la colección.

### Variables de Entorno

Antes de utilizar la colección de Postman, asegúrate de configurar las siguientes variables de entorno en Postman:

- **`url`**: La URL base de la API.
  - Ejemplo: `https://metal-concerts-backend.onrender.com`
  
- **`authTokenUser`**: Token de autenticación para usuarios.
  - Ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWI3ZmFhMGI3NTVlN2FhMDU2MDlkNiIsInJvbGUiOiJ1c2VyIiwic3RhdHVzIjoiTi9BIiwiaWF0IjoxNzQ5MzIxOTYyLCJleHAiOjE3NDk0MDgzNjJ9...`

- **`authTokenBand`**: Token de autenticación para bandas.
  - Ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MjA4NGRkNTMxMDQwYTg2NDVjYzE4YiIsInJvbGUiOiJiYW5kIiwic3RhdHVzIjoiYXBwcm92ZWQiLCJpYXQiOjE3NDkzMjE3OTgsImV4cCI6MTc0OTQwODE5OH0...`

- **`authTokenAdmin`**: Token de autenticación para administradores.
  - Ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWJhMjU4YTk4YzQwMTMxNWQ5NjE2NSIsInJvbGUiOiJhZG1pbiIsInN0YXR1cyI6Ik4vQSIsImlhdCI6MTc0OTMyMjcyNiwiZXhwIjoxNzQ5NDA5MTI2fQ...`

{
	"info": {
		"_postman_id": "fd4e20b7-cda4-4d82-bc8c-fb2045d23c9f",
		"name": "TFG",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "44530605"
	},
	"item": [
		{
			"name": "AUTH",
			"item": [
				{
					"name": "Login",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"email\": \"admin@gmail.com\",\n    \"password\": \"123456\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/auth/login",
							"host": [
								"{{url}}"
							],
							"path": [
								"auth",
								"login"
							]
						}
					},
					"response": []
				},
				{
					"name": "Register Band",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"email\": \"testbands@gmail.com\",\n    \"bandName\": \"testbands\",\n    \"description\":\"testbandtestbandtestbandtestband\",\n    \"genre\": \"Nu Metal\",\n    \"password\": \"123456\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/auth/register/band",
							"host": [
								"{{url}}"
							],
							"path": [
								"auth",
								"register",
								"band"
							]
						}
					},
					"response": []
				},
				{
					"name": "Register User",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"email\": \"test@gmail.com\",\n    \"username\": \"test\",\n    \"description\":\"testtesttest\",\n    \"genre\": \"Nu Metal\",\n    \"password\": \"123456\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/auth/register/user",
							"host": [
								"{{url}}"
							],
							"path": [
								"auth",
								"register",
								"user"
							]
						}
					},
					"response": []
				},
				{
					"name": "Profile Band",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [
							{
								"key": "",
								"value": "",
								"type": "text",
								"disabled": true
							}
						],
						"url": {
							"raw": "{{url}}/auth/profile/band",
							"host": [
								"{{url}}"
							],
							"path": [
								"auth",
								"profile",
								"band"
							]
						}
					},
					"response": []
				},
				{
					"name": "Profile User",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenUser}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [
							{
								"key": "",
								"value": "",
								"type": "text",
								"disabled": true
							}
						],
						"url": {
							"raw": "{{url}}/auth/profile/user",
							"host": [
								"{{url}}"
							],
							"path": [
								"auth",
								"profile",
								"user"
							]
						}
					},
					"response": []
				},
				{
					"name": "Forgot Password",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"email\":\"test@gmail.com\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/auth/forgot-password",
							"host": [
								"{{url}}"
							],
							"path": [
								"auth",
								"forgot-password"
							]
						}
					},
					"response": []
				},
				{
					"name": "Verify Reset Code",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"email\":\"test@gmail.com\",\n    \"code\": \"\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/auth//verify-reset-code",
							"host": [
								"{{url}}"
							],
							"path": [
								"auth",
								"",
								"verify-reset-code"
							]
						}
					},
					"response": []
				},
				{
					"name": "Reset Password",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n     \"email\":\"test@gmail.com\",\n    \"code\": \"\",\n    \"newPassword\":\"test@gmail.com\",\n    \"confirmPassword\":\"test@gmail.com\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/auth/reset-password",
							"host": [
								"{{url}}"
							],
							"path": [
								"auth",
								"reset-password"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "ADMIN",
			"item": [
				{
					"name": "Approved Band",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWJhMjU4YTk4YzQwMTMxNWQ5NjE2NSIsInJvbGUiOiJhZG1pbiIsInN0YXR1cyI6Ik4vQSIsImlhdCI6MTc0Njk2MTY0OCwiZXhwIjoxNzQ3MDQ4MDQ4fQ.ZEOWIWoj5PR07ZpX-FAXiSUEK6vgpZvrMQy6Uugqnmw",
									"type": "string"
								}
							]
						},
						"method": "PATCH",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWJhMjU4YTk4YzQwMTMxNWQ5NjE2NSIsInJvbGUiOiJhZG1pbiIsInN0YXR1cyI6Ik4vQSIsImlhdCI6MTc0NjY0MTUwNCwiZXhwIjoxNzQ2NzI3OTA0fQ.7i8Njgz7_GkWkfXcwp4acdAybT92ScuhP_pIXYL7yI",
								"type": "text",
								"disabled": true
							}
						],
						"body": {
							"mode": "formdata",
							"formdata": []
						},
						"url": {
							"raw": "{{url}}/admin/bands/67b383ab4c92a53f27dbadab/approved",
							"host": [
								"{{url}}"
							],
							"path": [
								"admin",
								"bands",
								"67b383ab4c92a53f27dbadab",
								"approved"
							]
						}
					},
					"response": []
				},
				{
					"name": "Reject Band",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWJhMjU4YTk4YzQwMTMxNWQ5NjE2NSIsInJvbGUiOiJhZG1pbiIsInN0YXR1cyI6Ik4vQSIsImlhdCI6MTc0Njk2MTY0OCwiZXhwIjoxNzQ3MDQ4MDQ4fQ.ZEOWIWoj5PR07ZpX-FAXiSUEK6vgpZvrMQy6Uugqnmw",
									"type": "string"
								}
							]
						},
						"method": "PATCH",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWJhMjU4YTk4YzQwMTMxNWQ5NjE2NSIsInJvbGUiOiJhZG1pbiIsInN0YXR1cyI6Ik4vQSIsImlhdCI6MTc0NjY0MTUwNCwiZXhwIjoxNzQ2NzI3OTA0fQ.7i8Njgz7_GkWkfXcwp4acdAybT92ScuhP_pIXYL7yI",
								"type": "text",
								"disabled": true
							}
						],
						"body": {
							"mode": "formdata",
							"formdata": []
						},
						"url": {
							"raw": "{{url}}/admin/bands/67b383ab4c92a53f27dbadab/reject",
							"host": [
								"{{url}}"
							],
							"path": [
								"admin",
								"bands",
								"67b383ab4c92a53f27dbadab",
								"reject"
							]
						}
					},
					"response": []
				},
				{
					"name": "See Pending Bands",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenAdmin}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MWJhMjU4YTk4YzQwMTMxNWQ5NjE2NSIsInJvbGUiOiJhZG1pbiIsInN0YXR1cyI6Ik4vQSIsImlhdCI6MTc0NjY0MTUwNCwiZXhwIjoxNzQ2NzI3OTA0fQ.7i8Njgz7_GkWkfXcwp4acdAybT92ScuhP_pIXYL7yI",
								"type": "text",
								"disabled": true
							}
						],
						"body": {
							"mode": "raw",
							"raw": "",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/admin/bands/pending",
							"host": [
								"{{url}}"
							],
							"path": [
								"admin",
								"bands",
								"pending"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "BAND",
			"item": [
				{
					"name": "Me",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"body": {
							"mode": "formdata",
							"formdata": []
						},
						"url": {
							"raw": "{{url}}/bands/me",
							"host": [
								"{{url}}"
							],
							"path": [
								"bands",
								"me"
							]
						}
					},
					"response": []
				},
				{
					"name": "Band Popular",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{url}}/bands/popular",
							"host": [
								"{{url}}"
							],
							"path": [
								"bands",
								"popular"
							]
						}
					},
					"response": []
				},
				{
					"name": "Top Rated",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MjA4NGRkNTMxMDQwYTg2NDVjYzE4YiIsInJvbGUiOiJiYW5kIiwic3RhdHVzIjoiYXBwcm92ZWQiLCJpYXQiOjE3NDg4ODc1NTUsImV4cCI6MTc0ODk3Mzk1NX0.86QMfGG01Zo4ftPkPOCq2KnRmcIKKoveZnEmJcT-7UM",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"body": {
							"mode": "formdata",
							"formdata": [
								{
									"key": "file",
									"type": "file",
									"src": [],
									"disabled": true
								},
								{
									"key": "title",
									"value": "otrapruebademierda",
									"type": "text",
									"disabled": true
								}
							]
						},
						"url": {
							"raw": "{{url}}/bands/top-rated",
							"host": [
								"{{url}}"
							],
							"path": [
								"bands",
								"top-rated"
							]
						}
					},
					"response": []
				},
				{
					"name": "Band Id",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MjA4NGRkNTMxMDQwYTg2NDVjYzE4YiIsInJvbGUiOiJiYW5kIiwic3RhdHVzIjoiYXBwcm92ZWQiLCJpYXQiOjE3NDg4ODc1NTUsImV4cCI6MTc0ODk3Mzk1NX0.86QMfGG01Zo4ftPkPOCq2KnRmcIKKoveZnEmJcT-7UM",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"body": {
							"mode": "formdata",
							"formdata": [
								{
									"key": "file",
									"type": "file",
									"src": [],
									"disabled": true
								},
								{
									"key": "title",
									"value": "otrapruebademierda",
									"type": "text",
									"disabled": true
								}
							]
						},
						"url": {
							"raw": "{{url}}/bands/682084dd531040a8645cc18b",
							"host": [
								"{{url}}"
							],
							"path": [
								"bands",
								"682084dd531040a8645cc18b"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update Image",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "PATCH",
						"header": [
							{
								"key": "Authorization",
								"value": "",
								"type": "text"
							}
						],
						"body": {
							"mode": "formdata",
							"formdata": [
								{
									"key": "image",
									"type": "file",
									"src": "/home/ivanoliverfunes/Imágenes/Capturas de pantalla/Captura desde 2025-06-07 20-31-10.png"
								},
								{
									"key": "",
									"value": "",
									"type": "text",
									"disabled": true
								}
							]
						},
						"url": {
							"raw": "{{url}}/bands/me/image",
							"host": [
								"{{url}}"
							],
							"path": [
								"bands",
								"me",
								"image"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update Genre",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "PATCH",
						"header": [
							{
								"key": "Authorization",
								"value": "",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"genre\": \"Heavy Metal\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/bands/me/genre",
							"host": [
								"{{url}}"
							],
							"path": [
								"bands",
								"me",
								"genre"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update Band Name",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "PATCH",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"bandName\": \"Heavy Metal\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/bands/me/band-name",
							"host": [
								"{{url}}"
							],
							"path": [
								"bands",
								"me",
								"band-name"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update Description",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "PATCH",
						"header": [
							{
								"key": "Authorization",
								"value": "",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"description\": \"Heavy Metal\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/bands/me/description",
							"host": [
								"{{url}}"
							],
							"path": [
								"bands",
								"me",
								"description"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "CONCERTS",
			"item": [
				{
					"name": "See Concerts",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"genre\": \"Heavy Metal\"\n}"
						},
						"url": {
							"raw": "{{url}}/concerts/",
							"host": [
								"{{url}}"
							],
							"path": [
								"concerts",
								""
							]
						}
					},
					"response": []
				},
				{
					"name": "See Concerts Id",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"genre\": \"Heavy Metal\"\n}"
						},
						"url": {
							"raw": "{{url}}/concerts/683de6984f7d8567e25da21a",
							"host": [
								"{{url}}"
							],
							"path": [
								"concerts",
								"683de6984f7d8567e25da21a"
							]
						}
					},
					"response": []
				},
				{
					"name": "See Recent Concerts",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"genre\": \"Heavy Metal\"\n}"
						},
						"url": {
							"raw": "{{url}}/concerts/recent",
							"host": [
								"{{url}}"
							],
							"path": [
								"concerts",
								"recent"
							]
						}
					},
					"response": []
				},
				{
					"name": "See Popular Concerts",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"genre\": \"Heavy Metal\"\n}"
						},
						"url": {
							"raw": "{{url}}/concerts/most-popular",
							"host": [
								"{{url}}"
							],
							"path": [
								"concerts",
								"most-popular"
							]
						}
					},
					"response": []
				},
				{
					"name": "See Top Rated Concerts",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"genre\": \"Heavy Metal\"\n}"
						},
						"url": {
							"raw": "{{url}}/concerts/top-rated",
							"host": [
								"{{url}}"
							],
							"path": [
								"concerts",
								"top-rated"
							]
						}
					},
					"response": []
				},
				{
					"name": "See Genres",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"genre\": \"Heavy Metal\"\n}"
						},
						"url": {
							"raw": "{{url}}/concerts/genres",
							"host": [
								"{{url}}"
							],
							"path": [
								"concerts",
								"genres"
							]
						}
					},
					"response": []
				},
				{
					"name": "See Locations",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"genre\": \"Heavy Metal\"\n}"
						},
						"url": {
							"raw": "{{url}}/concerts/locations",
							"host": [
								"{{url}}"
							],
							"path": [
								"concerts",
								"locations"
							]
						}
					},
					"response": []
				},
				{
					"name": "Delete Concert",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "DELETE",
						"header": [],
						"url": {
							"raw": "{{url}}/concerts/68360b7ade24cb79c6b56ac1",
							"host": [
								"{{url}}"
							],
							"path": [
								"concerts",
								"68360b7ade24cb79c6b56ac1"
							]
						}
					},
					"response": []
				},
				{
					"name": "Create Concerts",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "formdata",
							"formdata": [
								{
									"key": "file",
									"type": "file",
									"src": "/home/ivanoliverfunes/Imágenes/Capturas de pantalla/Captura desde 2025-05-25 12-26-48.png"
								},
								{
									"key": "title",
									"value": "prueba 2",
									"type": "text"
								},
								{
									"key": "description",
									"value": "daskjdnbasjkhdbnaskhjibnsahkijbnsaldkbnsadkbanskdl",
									"type": "text"
								},
								{
									"key": "date",
									"value": "2025-12-12",
									"type": "text"
								},
								{
									"key": "location",
									"value": "Sevilla",
									"type": "text"
								}
							]
						},
						"url": {
							"raw": "{{url}}/concerts",
							"host": [
								"{{url}}"
							],
							"path": [
								"concerts"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update Concerts",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "PUT",
						"header": [],
						"url": {
							"raw": "{{url}}/concerts/68360b7ade24cb79c6b56ac1",
							"host": [
								"{{url}}"
							],
							"path": [
								"concerts",
								"68360b7ade24cb79c6b56ac1"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "REVIEWS",
			"item": [
				{
					"name": "See Reviews",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/reviews/6836076223bf0feb29306087",
							"host": [
								"{{url}}"
							],
							"path": [
								"reviews",
								"6836076223bf0feb29306087"
							]
						}
					},
					"response": []
				},
				{
					"name": "Create Reviews",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenUser}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"rating\": 4,\n    \"comment\":\"hola\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/reviews/6836076223bf0feb29306087",
							"host": [
								"{{url}}"
							],
							"path": [
								"reviews",
								"6836076223bf0feb29306087"
							]
						}
					},
					"response": []
				},
				{
					"name": "Delete Reviews",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenUser}}",
									"type": "string"
								}
							]
						},
						"method": "DELETE",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"rating\": 4,\n    \"comment\":\"hola\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/reviews/6836076223bf0feb29306087",
							"host": [
								"{{url}}"
							],
							"path": [
								"reviews",
								"6836076223bf0feb29306087"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update Review",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenUser}}",
									"type": "string"
								}
							]
						},
						"method": "PUT",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"rating\": 5,\n    \"comment\":\"hola\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{url}}/reviews/6836076223bf0feb29306087",
							"host": [
								"{{url}}"
							],
							"path": [
								"reviews",
								"6836076223bf0feb29306087"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "SUBSCRIPTIONS",
			"item": [
				{
					"name": "See Subscribers",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenBand}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{url}}/subscriptions/subscribers",
							"host": [
								"{{url}}"
							],
							"path": [
								"subscriptions",
								"subscribers"
							]
						}
					},
					"response": []
				},
				{
					"name": "See Subscriptions",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenUser}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{url}}/subscriptions/subscriptions",
							"host": [
								"{{url}}"
							],
							"path": [
								"subscriptions",
								"subscriptions"
							]
						}
					},
					"response": []
				},
				{
					"name": "Unsubscribe",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenUser}}",
									"type": "string"
								}
							]
						},
						"method": "DELETE",
						"header": [],
						"url": {
							"raw": "{{url}}/subscriptions/unsubscribe/682084dd531040a8645cc18b",
							"host": [
								"{{url}}"
							],
							"path": [
								"subscriptions",
								"unsubscribe",
								"682084dd531040a8645cc18b"
							]
						}
					},
					"response": []
				},
				{
					"name": "Subscribe",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenUser}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"url": {
							"raw": "{{url}}/subscriptions/subscribe/682084dd531040a8645cc18b",
							"host": [
								"{{url}}"
							],
							"path": [
								"subscriptions",
								"subscribe",
								"682084dd531040a8645cc18b"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Users",
			"item": [
				{
					"name": "Favorites",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenUser}}",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{url}}/users/favorites",
							"host": [
								"{{url}}"
							],
							"path": [
								"users",
								"favorites"
							]
						}
					},
					"response": []
				},
				{
					"name": "New Request",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenUser}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"url": {
							"raw": "{{url}}/users/favorites/679f6d318efb1498f7527b85",
							"host": [
								"{{url}}"
							],
							"path": [
								"users",
								"favorites",
								"679f6d318efb1498f7527b85"
							]
						}
					},
					"response": []
				},
				{
					"name": "New Request Copy",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{authTokenUser}}",
									"type": "string"
								}
							]
						},
						"method": "DELETE",
						"header": [],
						"url": {
							"raw": "{{url}}/users/favorites/679f6d318efb1498f7527b85",
							"host": [
								"{{url}}"
							],
							"path": [
								"users",
								"favorites",
								"679f6d318efb1498f7527b85"
							]
						}
					},
					"response": []
				}
			]
		}
	]
}

## 📂 YAML

info:
  contact:
    email: ioliverfunes@gmail.com
  description: API para la gestión de conciertos de metal, usuarios, bandas, suscripciones
    y más.
  title: Metal Concerts API
  version: 1.0.0
openapi: 3.0.0
paths:
  /admin/bands/pending:
    get:
      tags:
        - admin
      responses:
        '200':
          description: Lista de bandas pendientes obtenida correctamente
        '500':
          description: Error en el servidor
      summary: Obtener bandas pendientes de aprobación
  /admin/bands/{bandId}/approved:
    patch:
      tags:
        - admin
      parameters:
      - in: path
        name: bandId
        required: true
        schema:
          type: string
      responses:
        '200':
          description: Banda aprobada correctamente
        '404':
          description: Banda no encontrada
      summary: Aprobar una banda
  /admin/create-admin:
    post:
      tags:
        - admin
      requestBody:
        content:
          application/json:
            schema:
              properties:
                email:
                  example: admin@example.com
                  type: string
                password:
                  example: securepassword
                  type: string
                username:
                  example: adminuser
                  type: string
              required:
              - email
              - username
              - password
              type: object
        required: true
      responses:
        '201':
          description: Administrador creado correctamente
        '400':
          description: Error en la solicitud
      summary: Crear un administrador
  /auth/login:
    post:
      tags:
        - auth
      requestBody:
        content:
          application/json:
            schema:
              properties:
                email:
                  example: user@example.com
                  type: string
                password:
                  example: mypassword
                  type: string
              required:
              - email
              - password
              type: object
        required: true
      responses:
        '200':
          description: Inicio de sesión exitoso
        '401':
          description: Credenciales incorrectas
        '403':
          description: Cuenta no validada por el administrador
      summary: Iniciar sesión
  /auth/logout:
    post:
      tags:
        - auth
      responses:
        '200':
          description: Sesión cerrada correctamente
      summary: Cerrar sesión
  /auth/register/band:
    post:
      tags:
        - auth
      requestBody:
        content:
          application/json:
            schema:
              properties:
                bandName:
                  example: Metallica
                  type: string
                description:
                  example: Una banda de metal
                  type: string
                email:
                  example: band@example.com
                  type: string
                genre:
                  example: Heavy Metal
                  type: string
                password:
                  example: mypassword
                  type: string
              required:
              - email
              - bandName
              - password
              - description
              - genre
              type: object
        required: true
      responses:
        '201':
          description: Banda registrada correctamente
        '400':
          description: Error en la solicitud
      summary: Registrar una banda
  /auth/register/user:
    post:
      tags:
        - auth
      requestBody:
        content:
          application/json:
            schema:
              properties:
                email:
                  example: user@example.com
                  type: string
                password:
                  example: mypassword
                  type: string
                username:
                  example: user123
                  type: string
              required:
              - username
              - email
              - password
              type: object
        required: true
      responses:
        '201':
          description: Usuario registrado correctamente
        '400':
          description: Error en la solicitud
      summary: Registrar un usuario
  /bands:
    get:
      tags:
        - bands
      responses:
        '200':
          description: Lista de bandas obtenida correctamente
        '500':
          description: Error en el servidor
      summary: Obtener lista de bandas registradas
  /bands/update-profile:
    put:
      tags:
        - bands
      requestBody:
        content:
          application/json:
            schema:
              properties:
                bandName:
                  example: Metallica
                  type: string
                description:
                  example: Banda icónica de metal
                  type: string
                genre:
                  example: Heavy Metal
                  type: string
              required:
              - bandName
              - genre
              - description
              type: object
        required: true
      responses:
        '200':
          description: Perfil actualizado correctamente
        '400':
          description: Error en la solicitud
      summary: Actualizar perfil de banda
  /bands/{bandId}:
    get:
      tags:
        - bands
      parameters:
      - in: path
        name: bandId
        required: true
        schema:
          type: string
      responses:
        '200':
          description: Perfil de banda obtenido correctamente
        '404':
          description: Banda no encontrada
      summary: Obtener perfil público de una banda
  /concerts:
    get:
      tags:
        - concerts
      responses:
        '200':
          description: Lista de conciertos obtenida correctamente
        '500':
          description: Error en el servidor
      summary: Obtener lista de conciertos
    post:
      tags:
        - concerts
      requestBody:
        content:
          application/json:
            schema:
              properties:
                date:
                  example: '2026-01-01'
                  type: string
                title:
                  example: Rock Fest
                  type: string
              required:
              - title
              - date
              type: object
        required: true
      responses:
        '201':
          description: Concierto creado correctamente
        '400':
          description: Error en la solicitud
      summary: Crear un nuevo concierto
  /concerts/{id}:
    delete:
      tags:
        - concerts
      parameters:
      - in: path
        name: id
        required: true
        schema:
          type: string
      responses:
        '200':
          description: Concierto eliminado correctamente
        '404':
          description: Concierto no encontrado
      summary: Eliminar un concierto
    put:
      tags:
        - concerts
      parameters:
      - in: path
        name: id
        required: true
        schema:
          type: string
      requestBody:
        content:
          application/json:
            schema:
              properties:
                date:
                  example: '2026-02-01'
                  type: string
                title:
                  example: Nuevo título
                  type: string
              required:
              - title
              - date
              type: object
        required: true
      responses:
        '200':
          description: Concierto actualizado correctamente
        '400':
          description: Error en la solicitud
      summary: Actualizar información de un concierto
  /reviews/{concertId}:
    delete:
      tags:
        - reviews
      parameters:
      - in: path
        name: concertId
        required: true
        schema:
          type: string
      responses:
        '200':
          description: Reseña eliminada correctamente
        '404':
          description: Reseña no encontrada
      summary: Eliminar una reseña
    get:
      tags:
        - reviews
      parameters:
      - in: path
        name: concertId
        required: true
        schema:
          type: string
      responses:
        '200':
          description: Lista de reseñas obtenida correctamente
        '404':
          description: Concierto no encontrado
      summary: Obtener reseñas de un concierto
    post:
      tags:
        - reviews
      parameters:
      - in: path
        name: concertId
        required: true
        schema:
          type: string
      requestBody:
        content:
          application/json:
            schema:
              properties:
                comment:
                  example: ¡Excelente concierto!
                  type: string
                rating:
                  example: 5
                  type: integer
              required:
              - rating
              - comment
              type: object
        required: true
      responses:
        '201':
          description: Reseña creada correctamente
        '400':
          description: Error en la solicitud
      summary: Crear una reseña para un concierto
  /subscriptions/subscribe/{bandId}:
    post:
      tags:
        - subscriptions
      parameters:
      - in: path
        name: bandId
        required: true
        schema:
          type: string
      responses:
        '201':
          description: Suscripción realizada correctamente
        '400':
          description: Error en la solicitud
      summary: Suscribirse a una banda
  /subscriptions/subscribers:
    get:
      tags:
        - subscriptions
      responses:
        '200':
          description: Lista de suscriptores obtenida correctamente
        '500':
          description: Error en el servidor
      summary: Obtener lista de suscriptores
  /subscriptions/subscriptions:
    get:
      tags:
        - subscriptions
      responses:
        '200':
          description: Lista de suscripciones obtenida correctamente
        '500':
          description: Error en el servidor
      summary: Obtener lista de suscripciones del usuario
  /subscriptions/unsubscribe/{subscriptionId}:
    delete:
      tags:
        - subscriptions
      parameters:
      - in: path
        name: subscriptionId
        required: true
        schema:
          type: string
      responses:
        '200':
          description: Suscripción eliminada correctamente
        '404':
          description: Suscripción no encontrada
      summary: Eliminar una suscripción
servers:
- description: Producción
  url: https://metal-concerts-backend.onrender.com/api/v1
- description: Desarrollo Local
  url: http://localhost:3000/api/v1
