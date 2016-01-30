Bank
---
Project for banking moneys and logging pays.

Python Django Framework, ReactJS, PostgreSQL

# Requirements
-   Python 2.7
-   Nginx
-   Django Framework
-   Django REST Framework
-   PostgreSQL

On debian, install packages:
`sudo apt-get install python2.7 python-django python-djangorestframework python-psycopg2 libpq-dev python-dev postgresql postgresql-contrib -y`

# Installation
before all, need this:
- python 3.5
- pip
- virtualenv (optional, but recommended)

Then, just run `pip install -r requirements.txt`. This install all needed
python packages for this project.

# Prepare database
Needs create migrations, migrate. After this you have ready DB.

`./manage.py makemigrations`

Create migration for app:

`./manage.py makemigrations banking`

Then migrate:

`./manage.py migrate`

And last, create superuser to login in admin page:

`./manage.py createsuperuser`

# Running
Next you can just run server `./manage.py runserver`.

#API Guide
-   `/api/auth/  -   авторизация пользователя
    params: username, password
    return: token`
-   `/api/user/  -   получить данные о пользователе
    params: none
    return: json (username, e-mail, first_name, second_name, is_superuser)`
-   `/api/user/{id}  -   получить данные о пользователе (only for admin)
    params: none
    return: json (username, e-mail, first_name, second_name, is_superuser)`
-   `/api/users/ -   получить список пользователей
    params: none
    return: array of users`
