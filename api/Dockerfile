# stage 1 - build flask app for backend
FROM python:3.10-alpine
RUN mkdir /app
WORKDIR /app
COPY . .
RUN pip3 install -r requirements.txt
# CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]

# stage 2 - nginx
# FROM nginx:1.23.3-alpine-slim
# COPY --from=build /backend/build /usr/share/nginx/html
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx/nginx.conf /etc/nginx/conf.d
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]