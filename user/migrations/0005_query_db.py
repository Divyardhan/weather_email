# Generated by Django 5.0.2 on 2024-04-01 10:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_user_db_isactive'),
    ]

    operations = [
        migrations.CreateModel(
            name='Query_db',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('date', models.DateField()),
                ('query', models.TextField()),
                ('status', models.IntegerField()),
            ],
        ),
    ]
