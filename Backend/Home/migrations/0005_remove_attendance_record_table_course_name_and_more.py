# Generated by Django 4.2.7 on 2023-11-18 11:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Home', '0004_person_table_course_list_created_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='attendance_record_table',
            name='course_name',
        ),
        migrations.RemoveField(
            model_name='course_table',
            name='sessions_list',
        ),
        migrations.RemoveField(
            model_name='person_table',
            name='course_list_created',
        ),
        migrations.RemoveField(
            model_name='person_table',
            name='courses_list',
        ),
        migrations.AlterField(
            model_name='attendance_record_table',
            name='session',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Home.session_record_table'),
        ),
        migrations.AlterField(
            model_name='attendance_record_table',
            name='student_Id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Home.person_table'),
        ),
        migrations.RemoveField(
            model_name='course_table',
            name='students_list',
        ),
        migrations.AlterField(
            model_name='course_table',
            name='teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='teacher', to='Home.person_table'),
        ),
        migrations.AlterField(
            model_name='session_record_table',
            name='course_name',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Home.course_table'),
        ),
        migrations.AddField(
            model_name='course_table',
            name='students_list',
            field=models.ManyToManyField(related_name='students', to='Home.person_table'),
        ),
    ]
