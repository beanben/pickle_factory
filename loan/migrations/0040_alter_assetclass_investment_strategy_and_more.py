# Generated by Django 4.2 on 2023-05-01 10:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('loan', '0039_alter_assetclass_investment_strategy_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assetclass',
            name='investment_strategy',
            field=models.CharField(blank=True, choices=[('build_to_sell', 'build to sell'), ('build_to_rent', 'build to rent')], default='build_to_sell', max_length=100),
        ),
        migrations.AlterField(
            model_name='assetclass',
            name='use',
            field=models.CharField(choices=[('hotel', 'hotel'), ('residential', 'residential'), ('commercial', 'commercial'), ('student_accommodation', 'student accommodation'), ('office', 'office'), ('shopping_centre', 'shopping centre')], default='residential', max_length=40),
        ),
    ]
