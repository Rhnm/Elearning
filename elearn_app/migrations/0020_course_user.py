# Generated by Django 4.0 on 2024-03-01 12:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('elearn_app', '0019_enrollment'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='user',
            field=models.ForeignKey(default='10', on_delete=django.db.models.deletion.CASCADE, to='elearn_app.customuser'),
        ),
    ]
