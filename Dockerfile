# Usamos la imagen oficial ligera de Nginx sobre Alpine Linux
FROM nginx:alpine

# Copiamos todos los archivos (HTML, manifest, sw.js, íconos) al directorio de Nginx
COPY . /usr/share/nginx/html/

# Exponemos el puerto 80 del contenedor
EXPOSE 80

# Nginx inicia automáticamente por defecto en primer plano
CMD ["nginx", "-g", "daemon off;"]
