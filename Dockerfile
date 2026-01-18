# ETAPA 1: Construcción
# Usamos Node 22 ya que tu package.json requiere "node": "^20.19.0 || >=22.12.0"
FROM node:22-alpine as build-stage

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación para producción (ejecuta "vite build")
RUN npm run build-only

# ETAPA 2: Producción
FROM nginx:stable-alpine as production-stage

# Copiar los archivos construidos de la etapa anterior al directorio de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx si es necesaria
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
