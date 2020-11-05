FROM node:alpine AS build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY .env.js.tpl .
COPY . .
RUN npm install --no-optional
RUN npm run build
RUN ls

FROM nginx:alpine AS runtime
EXPOSE 80

RUN apk add --no-cache bash

RUN rm -rf /etc/nginx/conf.d
COPY --from=build /app/nginx.conf /etc/nginx

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

# COPY --from=build app/.env.js.tpl .
CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]
# CMD ["/bin/sh", "-c", "envsubst < .env.js.tpl > /usr/share/nginx/html/static/js/env.js && nginx -g 'daemon off;'"]
