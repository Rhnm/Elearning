# Generated by Django 4.0 on 2024-03-04 10:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('elearn_app', '0023_updatehistory_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentprofile',
            name='user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='elearn_app.customuser'),
        ),
        migrations.AlterField(
            model_name='teacherprofile',
            name='user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='elearn_app.customuser'),
        ),
    ]
