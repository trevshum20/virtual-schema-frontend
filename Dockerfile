# ---- build ----
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# We’ll call the API through /api from the container (nginx will proxy it)
ARG REACT_APP_API_BASE=/api
ENV REACT_APP_API_BASE=${REACT_APP_API_BASE}
RUN npm run build

# ---- serve ----
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build ./
# Explicit root + index to avoid rewrite loops
RUN printf "server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / { try_files \$uri \$uri/ /index.html; }\n\
  location /api/ {\n\
    proxy_pass http://backend:8080/;\n\
    proxy_http_version 1.1;\n\
    proxy_set_header Host \$host;\n\
    proxy_set_header X-Forwarded-Proto \$scheme;\n\
    proxy_set_header X-Forwarded-For \$remote_addr;\n\
  }\n\
}\n" > /etc/nginx/conf.d/default.conf
EXPOSE 80

