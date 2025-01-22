# 1️⃣ Usa una imagen oficial de Node.js (elige la versión que usas)
FROM node:18

# 2️⃣ Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3️⃣ Copia los archivos package.json y package-lock.json
COPY package*.json ./

# 4️⃣ Instala las dependencias
RUN npm ci

# 5️⃣ Copia el resto del código al contenedor
COPY . .

# 6️⃣ Expone el puerto en el que corre el backend (el mismo que en docker-compose)
EXPOSE 3000
USER 1000
# 7️⃣ Comando por defecto para ejecutar la aplicación
CMD ["npm", "start"]
