# Generated by Django 4.2 on 2023-04-26 07:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('loan', '0035_remove_individual_author_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lease',
            name='rent',
        ),
        migrations.RemoveField(
            model_name='lease',
            name='rent_frequency',
        ),
        migrations.RemoveField(
            model_name='sale',
            name='price',
        ),
        migrations.AddField(
            model_name='lease',
            name='rent_achieved_amount',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=20),
        ),
        migrations.AddField(
            model_name='lease',
            name='rent_achieved_frequency',
            field=models.CharField(blank=True, choices=[('weekly', 'weekly'), ('monthly', 'monthly')], default='weekly', max_length=100),
        ),
        migrations.AddField(
            model_name='lease',
            name='rent_target_amount',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=20),
        ),
        migrations.AddField(
            model_name='lease',
            name='rent_target_frequency',
            field=models.CharField(blank=True, choices=[('weekly', 'weekly'), ('monthly', 'monthly')], default='weekly', max_length=100),
        ),
        migrations.AddField(
            model_name='sale',
            name='price_achieved',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=20),
        ),
        migrations.AddField(
            model_name='sale',
            name='price_target',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=20),
        ),
    ]
