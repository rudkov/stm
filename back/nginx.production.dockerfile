FROM nginx
COPY env/nginx/nginx.production.conf /etc/nginx/conf.d/default.conf
