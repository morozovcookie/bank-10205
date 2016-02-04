Bank
---
Python Django Framework, ReactJS, PostgreSQL

# Requirements
-   Python 2.7
-   Nginx
-   Django Framework 3.3.2
-   Django REST Framework 1.9.1
-   PostgreSQL 9.3.10

For install this soft run `sudo apt-get install python2.7 python-django python-djangorestframework python-psycopg2 libpq-dev python-dev postgresql postgresql-contrib -y`

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
