from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

class person_table(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    rollNumber = models.CharField(max_length=255)
    courses_list = models.TextField(default=None)
    course_list_created = models.TextField(default=None)

class admin_table(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    rollNumber = models.CharField(max_length=255)
    image=models.ImageField()


class course_table(models.Model):
    name = models.CharField(max_length=50)
    verification_code = models.TextField()
    teacher=models.TextField()
    students_list = models.TextField(default=None)

class session_record_table(models.Model):
    course_name = models.CharField(max_length=50)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    lat = models.FloatField(default=None)
    lon = models.FloatField(default=None)
    presence=models.TextField(default="absent")        #for secondary purposes while sharing response with frontend does not in any way affect what is stored in database and need not be changed

class attendance_record_table(models.Model):
    student_Id = models.CharField(max_length=255)
    session = models.TextField(default=None)
