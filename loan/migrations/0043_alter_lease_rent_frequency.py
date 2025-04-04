# Generated by Django 4.2 on 2023-05-06 08:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('loan', '0042_rename_duration_unit_lease_lease_frequency_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lease',
            name='rent_frequency',
            field=models.CharField(blank=True, choices=[('per_week', 'per week'), ('per_month', 'per month')], default='per_month', max_length=100),
        ),
    ]
