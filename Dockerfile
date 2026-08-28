# Etape 1 : build du bundle webpack.
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Etape 2 : service des fichiers statiques via nginx.
# Variante non privilegiee de l'image nginx : le processus maitre tourne
# sous l'uid 101 et non sous root, et ecoute sur 8080 plutot que sur 80.
FROM nginxinc/nginx-unprivileged:1.31-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
