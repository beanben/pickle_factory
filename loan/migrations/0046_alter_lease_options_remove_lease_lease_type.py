# Generated by Django 4.2 on 2023-05-12 19:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('loan', '0045_remove_lease_lease_frequency_remove_lease_term_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='lease',
            options={'ordering': ['-created_at']},
        ),
        migrations.RemoveField(
            model_name='lease',
            name='lease_type',
        ),
    ]
