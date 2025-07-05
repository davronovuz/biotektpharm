FROM python:3.11-slim

# Python uchun muhit o'zgaruvchilari
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Talablar faylini alohida nusxalash va o'rnatish
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Loyiha fayllarini nusxalash
COPY . .

# Static fayllar uchun papka yaratish va collectstatic
RUN mkdir -p /app/staticfiles && \
    python manage.py collectstatic --noinput --clear

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]