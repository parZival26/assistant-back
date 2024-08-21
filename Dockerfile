# Usa una imagen base de Node.js 20.11
FROM node:20.11-alpine

# Establece el directorio de trabajo en /app
WORKDIR /usr/src/app 

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install


# Copia el resto de la aplicación
COPY . .

RUN npx prisma generate

# Construye la aplicación
RUN npm run build

# Expone el puerto en el que correrá la aplicación
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]