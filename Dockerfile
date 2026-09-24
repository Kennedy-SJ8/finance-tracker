# Usamos la imagen oficial ligera de Nginx sobre Alpine Linux
FROM nginx:alpine

# Copiamos el HTML de la aplicación al directorio predeterminado de Nginx
COPY index.html /usr/share/nginx/html/index.html

# Exponemos el puerto 80 del contenedor
EXPOSE 80

# Nginx inicia automáticamente por defecto en primer plano
CMD ["nginx", "-g", "daemon off;"]
