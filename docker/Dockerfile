FROM python:3.11-slim

WORKDIR /app

COPY ../backend/django-api/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY ../backend/django-api /app

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
