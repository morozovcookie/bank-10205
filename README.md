Bank
---
Project for banking moneys and logging pays.

# Installation
before all, need this:
- python 3.5
- pip
- virtualenv (optional)

Then, just run `pip install -r requirements.txt`. This install all needed
python packages for this project.

# Prepare database
Needs create migrations, migrate. After this you have ready DB.

`./manage.py makemigrations`

In my case, migrations cerated for django internal parts, but not for banking
app. So do it manyally:

`./manage.py makemigrations banking`

Then migrate:

`./manage.py migrate`

And last, create superuser to login in admin page:

`./manage.py createsuperuser`

# Running
Next you can just run server `./manage.py runserver`.
