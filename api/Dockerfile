FROM python:3.9-alpine
WORKDIR /backend
COPY requirements.txt /requirements.txt
RUN pip install -r /requirements.txt
EXPOSE 5000
COPY . /backend
CMD ["python3", "app.py"]