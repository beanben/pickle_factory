# Generated by Django 4.2 on 2023-05-11 06:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('loan', '0044_alter_unit_area_size'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lease',
            name='lease_frequency',
        ),
        migrations.RemoveField(
            model_name='lease',
            name='term',
        ),
        migrations.AddField(
            model_name='lease',
            name='end_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
