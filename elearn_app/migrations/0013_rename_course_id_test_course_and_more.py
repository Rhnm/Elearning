# Generated by Django 4.0 on 2024-02-26 13:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('elearn_app', '0012_test'),
    ]

    operations = [
        migrations.RenameField(
            model_name='test',
            old_name='course_id',
            new_name='course',
        ),
        migrations.RenameField(
            model_name='test',
            old_name='topic_id',
            new_name='topic',
        ),
    ]
