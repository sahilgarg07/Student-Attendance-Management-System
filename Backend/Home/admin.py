from django.contrib import admin

# Register your models here.
from .models import *
# Register your models here.
admin.site.register(person_table)
admin.site.register(course_table)
admin.site.register(session_record_table)
admin.site.register(attendance_record_table)