@echo off
echo.
echo ***** Emptying Database...
python manage.py flush --no-input

echo.
echo ***** Reverting migrations...
python manage.py migrate SpeechTherapy zero

echo.
echo ***** Deleteing migrations...
del SpeechTherapy\migrations\000*

echo.
echo ***** Making migrations...
python manage.py makemigrations

echo.
echo ***** Applying migrations...
python manage.py migrate

echo.
echo ***** Creating user...
python manage.py createsuperuser --username admin --email ""

echo.
echo ***** Running server...
python manage.py runserver 0.0.0.0:8000