# Static build of the site, served by nginx.
FROM node:22 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
# nginx renders templates in /etc/nginx/templates with envsubst at start-up.
# ROBOTS_TAG is set to "noindex, nofollow" on staging only; leave it empty in production
# (an empty add_header value is not sent).
ENV ROBOTS_TAG=""
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
