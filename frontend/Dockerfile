FROM node:18-alpine AS build
WORKDIR /frontend
COPY /package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
# CMD ["npm", "start"]

FROM nginx:latest
COPY --from=build /frontend/build /usr/share/nginx/html
COPY /nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]