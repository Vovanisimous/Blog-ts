# build step
FROM node:10-alpine AS build

WORKDIR /devel

COPY . .

RUN yarn install && yarn run build

# serve step
FROM nginx:1.17-alpine AS serve

WORKDIR /var/www/blog

COPY --from=build /devel/build .
COPY nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
