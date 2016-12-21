python manage.py migrate
echo "from django.contrib.auth.models import User; User.objects.create_superuser('rubbal', 'rubbal@chymeravr.com', 'qwe')" | python manage.py shell

