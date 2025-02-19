# Usa una imagen oficial de Node.js como base
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de tu aplicación al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Instala nodemon globalmente
RUN npm install -g nodemon

# Copia el resto de los archivos del proyecto
COPY . .

# Expone el puerto en el que tu app escuchará (por defecto 3000)
EXPOSE 3000

# Comando para iniciar la app usando nodemon
CMD ["nodemon", "app.js"]
