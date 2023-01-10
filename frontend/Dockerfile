FROM node:18-alpine
WORKDIR /frontend
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["nohup", "npm", "start", "&"]
