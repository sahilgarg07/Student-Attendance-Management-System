from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

class person_table(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    rollNumber = models.CharField(max_length=255)
    # courses_list = models.ManyToManyField(course_table)
    # course_list_created = models.ManyToManyField(course_table)
    courses_list = models.TextField(default=None)
    course_list_created = models.TextField(default=None)


class course_table(models.Model):
    name = models.CharField(max_length=50)
    verification_code = models.TextField()
    # teacher = models.ForeignKey(person_table, on_delete=models.CASCADE, related_name='teacher')
    teacher=models.TextField()
    # students_list = models.ManyToManyField(person_table, related_name='students')
    students_list = models.TextField(default=None)

class session_record_table(models.Model):
    course_name = models.CharField(max_length=50)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.TextField()


class attendance_record_table(models.Model):
    student_Id = models.ForeignKey(person_table, on_delete=models.CASCADE)
    session = models.ForeignKey(session_record_table, on_delete=models.CASCADE)
