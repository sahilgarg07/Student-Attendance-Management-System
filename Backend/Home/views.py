import random

from datetime import datetime

import simplejson as json

from rest_framework.decorators import api_view, action
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from .serializers import Session_Record_Table_Serializers, Course_Table_Serializers, Person_Table_Serializers, \
    Attendance_Record_Table_Serializers, Regisatration_Image_Serializer,Admin_Table_Serializers
from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import person_table, course_table, session_record_table, attendance_record_table,admin_table


# @api_view(['POST'])
# def create_new_course(request):
#     code = ""
#     for i in range(0, 10):
#         code = code + chr(random.randint(50, 100))

#     request.data['verification_code'] = code
#     print(request.data)
#     serializer = Course_Table_Serializers(data=request.data)
#     if serializer.is_valid(raise_exception=True):
#         serializer.save()
#         person = person_table.objects.get(rollNumber=request.data["teacher"])
#         course = course_table.objects.filter(verification_code=code)
#         courseId = course.values('id')[0]['id']

#         jsonDec = json.decoder.JSONDecoder()
#         course_records = jsonDec.decode(person.course_list_created)
#         course_records.append(courseId)
#         print(course_records)
#         person.course_list_created = json.dumps(course_records)
#         person.save()

#         person_serializer = Person_Table_Serializers(person)  # Serialize the person object

#         course_data = course_table.objects.filter(id__in=course_records)  # Get course data
#         course_serializer = Course_Table_Serializers(course_data, many=True)  # Serialize the course data

#         return Response({
#             "message": f"Created New Course {request.data['name']}",
#             "Code": f"{code}",
#             "person": person_serializer.data,
#             "course_data": course_serializer.data  # Include serialized course data in the response
#         }, status=status.HTTP_200_OK)



###################################################################################################
@api_view(['POST'])
def create_new_course(request):

    #checking if the same course name is already taken
    courses_existing=course_table.objects.filter(name=request.data['name'])
    print(courses_existing)
    if(len(list(courses_existing))!=0):
         return Response({'msg': 'Course Name already taken'},
                            status=status.HTTP_200_OK) 
    # print(request.data)

    #generating code for the course
    code = ""
    for i in range(0, 5):
        code = code + chr(random.randint(50, 100))

    request.data['verification_code'] = code

    #saving the serializer
    serializer = Course_Table_Serializers(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(verification_code=code, students_list=json.dumps([]), name=request.data['name'],teacher=request.data['teacher'])
    else:
        return Response({"msg": "Invalid Serializer: Failed to create course"}, status=status.HTTP_200_OK) 
    

    #creating entry in the database
    jsonDec = json.decoder.JSONDecoder()
    ins=course_table(name=request.data['name'], verification_code=str(code),teacher=request.data['teacher'],students_list=json.dumps([]))
    ins.save()

    #adding the course id to person's created list
    person = person_table.objects.get(rollNumber=request.data["teacher"])


    course = course_table.objects.filter(verification_code=code)
    courseId = course.values('id')[0]['id']

    course_records = jsonDec.decode(person.course_list_created)
    course_records.append(courseId)
    # print(course_records)
    person.course_list_created = json.dumps(course_records)
    person.save()

    person_serializer = Person_Table_Serializers(person)  # Serialize the person object

    # course_data = course_table.objects.filter(id__in=course_records)  # Get course data
    course_serializer = Course_Table_Serializers(course)  # Serialize the course data

    return Response({
        "message": f"Created New Course {request.data['name']}",
        "Code": f"{code}",
        # "person": person_serializer.data,
        # "course_data": course_serializer.data # Include serialized course data in the response
    }, status=status.HTTP_200_OK)


####################################################################################################    

@api_view(['POST'])
def create_new_session(request):

    #checking if the same session is already taken
    session_existing=session_record_table.objects.filter(course_name=request.data['course_name'], 
                                                         date=request.data['date'], 
                                                         start_time=request.data['start_time'],
                                                         end_time=request.data['end_time'],
                                                         lat=request.data['lat'],
                                                         lon=request.data['lon'])
    
    print("Latitude="+str(request.data['lat'])+" Longitude="+str(request.data['lon']))
    if(len(list(session_existing))!=0):
         return Response({'msg': 'Session Already exists'},
                            status=status.HTTP_200_OK) 

    #saving the serializer
    serializer = Session_Record_Table_Serializers(data=request.data)
    if serializer.is_valid(raise_exception=False):
        serializer.save(course_name=request.data['course_name'], 
                        date=request.data['date'], 
                        start_time=request.data['start_time'],
                        end_time=request.data['end_time'],
                        lat=request.data['lat'],
                        lon=request.data['lon'])

        # #creating entry in the 
        # ins=session_record_table(course_name=request.data['course_name'], date=request.data['date'] ,start_time=request.data['start_time'],end_time=request.data['end_time'],lat=request.data['lat'],lon=request.data['lon'])
        # ins.save()

        return Response({
            "message": f"Created the requested session",
        }, status=status.HTTP_200_OK)
    
    return Response({'msg': 'Failed to create session'},
                            status=status.HTTP_200_OK) 
    # session_id = session_record_table.objects.filter(
    #     course_name=course_name, date=date, start_time=start_time, end_time=end_time, location=location).values(
    #     "id")[0]["id"]

    # print(session_id)

    # course = course_table.objects.get(name=course_name)
    # if not (course):
    #     return Response(status=status.HTTP_200_OK)
    # jsonDec = json.decoder.JSONDecoder()
    # session_records = jsonDec.decode(course.sessions_list)
    # session_records.append(session_id)

    # course.sessions_list = json.dumps(session_records)
    # course.save()





####################################################################################################################

@api_view(['POST'])
def new_student(request):
    print(request.data)
    people=person_table.objects.filter(rollNumber=request.data['rollNumber'])

    serializer = Person_Table_Serializers(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(courses_list=json.dumps([]),course_list_created=json.dumps([]))
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def username_availability(request):
    people=person_table.objects.filter(rollNumber=request.data['rollNumber'])
    if(len(people)!=0):
        print("Hello")
        return Response({'msg': 'Username already taken'},status=status.HTTP_200_OK)   
    return Response({'msg': 'Username available'},status=status.HTTP_200_OK)



@api_view(["POST"])
def mark_attendance(request):
    serializer = Attendance_Record_Table_Serializers(data=request.data)
    if serializer.is_valid():
        try:
            #Checking if the person is actually registered for the course or not 
            person=person_table.objects.filter(rollNumber=request.data['student_Id']).first()
            jsonDec = json.decoder.JSONDecoder()
            courses_enrolled=jsonDec.decode(person.courses_list)
            course=course_table.objects.filter(name=request.data['course_name']).first()
            if(course.id not in courses_enrolled):
                return Response({'msg': 'Person is not enrolled in the course.'}, status=status.HTTP_201_CREATED)

            
            session=session_record_table.objects.filter(course_name=request.data['course_name'],date=request.data['date'],lat=request.data['lat'],lon=request.data['lon'],start_time=request.data['start_time'],end_time=request.data['end_time']).first()
            print("Session id=",session.id)
            ins = attendance_record_table(student_Id=request.data['student_Id'], session=session.id)
            ins.save()
            return Response({'msg': 'Attendance marked successfully.'}, status=status.HTTP_201_CREATED)
        except course_table.DoesNotExist:
            return Response({'msg': 'Course not found.'}, status=status.HTTP_200_OK)
        except json.JSONDecodeError:
            return Response({'msg': 'Invalid sessions_list format in course.'},
                            status=status.HTTP_200_OK)
    else:
        return Response({'msg': 'Serializer Error in marking attendance.'},
                            status=status.HTTP_200_OK)
    



@api_view(["POST"])
def session_attendance_list(request):
    if 'course_name' not in request.data or 'date' not in request.data or 'start_time' not in request.data or 'end_time' not in request.data:
        return Response({'msg': 'course_name, date, start_time, and end_time fields are required.'},
                        status=status.HTTP_200_OK)

    course_name = request.data['course_name']
    date = request.data['date']
    start_time = request.data['start_time']
    end_time = request.data['end_time']

    try:
        session = session_record_table.objects.get(
            course_name=course_name, date=date, start_time=start_time, end_time=end_time)

        students_marked = list(attendance_record_table.objects.filter(course_name=course_name, session=session))

        serialized_students = []
        for student in students_marked:
            serialized_student = {
                'student_id': student.student_id,
                'course_name': student.course_name,
                'session': student.session.id,
                # Add other fields if needed
            }
            serialized_students.append(serialized_student)

        return Response(serialized_students, status=status.HTTP_200_OK)

    except session_record_table.DoesNotExist:
        return Response({'msg': 'Session not found.'}, status=status.HTTP_200_OK)

    except attendance_record_table.DoesNotExist:
        return Response({'msg': 'Attendance records not found.'}, status=status.HTTP_200_OK)




# @api_view(["POST"])
# def course_session_details_student(request):
#     if 'course_name' not in request.data or 'student_id' not in request.data:
#         return Response({'error': 'course_name and student_id fields are required.'},
#                         status=status.HTTP_200_OK)

#     course_name = request.data['course_name']
#     student_id = request.data['student_id']

#     try:
#         # Get the list of sessions the student is marked present for
#         present_sessions_data = list(
#             attendance_record_table.objects.filter(course_name=course_name, student_id=student_id))
#         present_sessions = [session_record_table.objects.get(id=i.session) for i in present_sessions_data]

#         # Get the list of all sessions for the specified course
#         course_sessions_list = json.loads(course_table.objects.get(name=course_name).sessions_list)
#         sessions_list = session_record_table.objects.filter(id__in=course_sessions_list)

#         serialized_present_sessions = []
#         for session in present_sessions:
#             serialized_session = {
#                 'id': session.id,
#                 'course_name': session.course_name,
#                 'date': session.date,
#                 'start_time': session.start_time,
#                 'end_time': session.end_time,
#                 'lat': session.lat,
#                 'lon':session.lon
#             }
#             serialized_present_sessions.append(serialized_session)

#         serialized_all_sessions = []
#         for session in sessions_list:
#             serialized_session = {
#                 'id': session.id,
#                 'course_name': session.course_name,
#                 'date': session.date,
#                 'start_time': session.start_time,
#                 'end_time': session.end_time,
#                 'lat': session.lat,
#                 'lon':session.lon
#             }
#             serialized_all_sessions.append(serialized_session)

#         return Response({'present': serialized_present_sessions, 'total': serialized_all_sessions},
#                         status=status.HTTP_200_OK)

#     except attendance_record_table.DoesNotExist:
#         return Response({'error': 'Attendance records not found.'}, status=status.HTTP_200_OK)

#     except course_table.DoesNotExist:
#         return Response({'error': 'Course not found.'}, status=status.HTTP_200_OK)

#     except json.JSONDecodeError:
#         return Response({'error': 'Invalid sessions_list format in course.'}, status=status.HTTP_200_OK)



####################################################################################################
@api_view(["POST"])
def course_registration(request):
    if 'student_id' not in request.data or 'verification_code_entered' not in request.data:
        return Response({'msg': 'student_id and verification_code_entered fields are required.'},
                        status=status.HTTP_200_OK)

    student_id = request.data['student_id']
    verification_code_entered = request.data['verification_code_entered']
    # print(student_id,verification_code_entered)

    try:
        # Check the validity of the verification code
        course = course_table.objects.filter(verification_code=verification_code_entered)
        if(len(list(course))==0):
            return Response({'msg': 'Invalid Verification Code'}, status=status.HTTP_200_OK)
        course=course.first()
        student = person_table.objects.filter(rollNumber=student_id).first()
        # print(course,student)

        # Adding the course to student profile
        jsonDec = json.decoder.JSONDecoder()
        course_records = jsonDec.decode(student.courses_list)
        # print("H?RLLO")
        if(course.id in course_records):
            print( 'Already enrolled in the coures')
            return Response({'msg': 'Already enrolled in the coures'}, status=status.HTTP_200_OK)
        course_records.append(course.id)
        student.courses_list = json.dumps(course_records)

        student.save()

        # Adding the student to course profile
        # print("hello")
        # print(course.students_list)
        if(course.students_list==None):
            students_records = []
        else:
            students_records = json.loads(course.students_list)

        students_records.append(student.id)
        course.students_list = json.dumps(students_records)
        course.save()


        return Response({'msg': 'Course registration successful.'}, status=status.HTTP_200_OK)

    except course_table.DoesNotExist:
        return Response({'msg': 'Invalid Verification Code'}, status=status.HTTP_200_OK)

    except person_table.DoesNotExist:
        return Response({'msg': 'Student not found.'}, status=status.HTTP_200_OK)

    except json.JSONDecodeError:
        return Response({'msg': 'Invalid courses_list format in student.'}, status=status.HTTP_200_OK)

##################################################################################################3



##################################################################################################3

@api_view(['POST'])
def show_created(request):
    jsonDec = json.decoder.JSONDecoder()
    # print(request.data)
    person=person_table.objects.filter(rollNumber=request.data["teacher"]).first()
    course_records = jsonDec.decode(person.course_list_created)
    if(len(course_records)!=0):

        person=person_table.objects.filter(rollNumber=request.data["teacher"])
        person_serialised=Person_Table_Serializers(person, many=True)
        # print(person_serialised)
        if(len(person)==0):
            return Response({'msg': 'No such teacher exist.'}, status=status.HTTP_200_OK)  
        # print(person)
        # print(course_records)
            
        course_data = course_table.objects.filter(id__in=course_records)  # Get course data

        course_data_struct=[]
        for i in course_data:
            course_data_struct.append({'name':i.name,'description':request.data['teacher'], 'verification_code':i.verification_code,'teacher':i.teacher})
        course_serializer = Course_Table_Serializers(course_data_struct, many=True)  # Serialize the course data
        # print(course_serializer)
        a={"info":person_serialised.data}
        a.update({"course_data": course_serializer.data})
        return Response(a, status=status.HTTP_200_OK)
    

    person=person_table.objects.filter(rollNumber=request.data["teacher"])
    person_serialised=Person_Table_Serializers(person, many=True)
    # print(person_serialised)
    if(len(person)==0):
        return Response({'msg': 'No such teacher exist.'}, status=status.HTTP_200_OK)   
    a={"info":person_serialised.data}
    a.update({"course_data": [{'name':"No courses Created so far",'description':":)"}]})
    return Response(a, status=status.HTTP_200_OK)



###################################################################################
@api_view(['POST'])
def show_enrolled(request):
    jsonDec = json.decoder.JSONDecoder()
    # print(request.data)
    person=person_table.objects.filter(rollNumber=request.data["teacher"]).first()
    course_records = jsonDec.decode(person.courses_list)
    if(len(course_records)!=0):

        person=person_table.objects.filter(rollNumber=request.data["teacher"])
        person_serialised=Person_Table_Serializers(person, many=True)
        # print(person_serialised)
        if(len(person)==0):
            return Response({'msg': 'No such course exist.'}, status=status.HTTP_200_OK) 
        # print(person)
        # print(course_records)
            
        course_data = course_table.objects.filter(id__in=course_records)  # Get course data

        course_data_struct=[]
        for i in course_data:
            course_data_struct.append({'name':i.name,'description':i.teacher, 'verification_code':i.verification_code,'teacher':i.teacher})
            # print(i.teacher)
        course_serializer = Course_Table_Serializers(course_data_struct, many=True)  # Serialize the course data
    
        # print(course_serializer)
        a={"info":person_serialised.data}
        a.update({"course_data": course_serializer.data})
        return Response(a, status=status.HTTP_200_OK)
    

    person=person_table.objects.filter(rollNumber=request.data["teacher"])
    person_serialised=Person_Table_Serializers(person, many=True)
    # print(person_serialised)
    if(len(person)==0):
        return Response(status=status.HTTP_200_OK)   
    a={"info":person_serialised.data}
    a.update({"course_data": [{'name':"No courses Enrolled so far",'description':":)"}]})
    return Response(a, status=status.HTTP_200_OK)

###################################################################################


@api_view(['POST'])
def show_sessions(request):

    if 'course_name' not in request.data:
        return Response({'msg': 'course_name field is required.'}, status=status.HTTP_200_OK)
    jsonDec = json.decoder.JSONDecoder()
    # print(request.data)
    
    session_records = session_record_table.objects.filter(course_name=request.data['course_name'])
    if(len(session_records)!=0):

        course=course_table.objects.filter(name=request.data["course_name"])
        course_serializer=Course_Table_Serializers(course, many=True)   
        # print(person_serialised)
        if(len(course)==0):
            return Response({'msg': 'No such course exist.'}, status=status.HTTP_200_OK) 
        # print(person)
        # print(course_records)
            
        
        session_data_struct=[]
        for i in session_records:
            student_present_check=attendance_record_table.objects.filter(student_Id=request.data['student_username'],session=i.id)
            presence="absent"
            print(i.id)
            if(len(student_present_check)!=0):
                presence="present"
            session_data_struct.append({
                'course_name':i.course_name,
                'date':i.date, 
                'start_time':i.start_time,
                'end_time':i.end_time,
                'lat':i.lat,
                'lon':i.lon,
                'presence':presence})
            
        session_serializer = Session_Record_Table_Serializers(session_data_struct, many=True)  # Serialize the course data
    
        # print(course_serializer)
        a={"info":course_serializer.data}
        a.update({"course_data": session_serializer.data})
        return Response(a, status=status.HTTP_200_OK)
    

    course=course_table.objects.filter(name=request.data["course_name"])
    course_serializer=Course_Table_Serializers(course, many=True)
    # print(person_serialised)
    if(len(course)==0):
        return Response({'msg': 'No such course exist.'}, status=status.HTTP_200_OK)  
    a={"info":course_serializer.data}
    a.update({"course_data": [{'date':"No Sessions started so far",'start_time':"00:00:00",'end_time':"00:00:00",'course_name':'John Doe','lat':-1,'lon':-1}]})
    return Response(a, status=status.HTTP_200_OK)

# @api_view(["POST"])
# def course_session_details_teacher(request):
#     if 'course_name' not in request.data:
#         return Response({'error': 'course_name field is required.'}, status=status.HTTP_200_OK)

#     course_name = request.data['course_name']
#     try:
#         course = course_table.objects.get(name=course_name)
#         course_sessions_list = json.loads(course.sessions_list)
#         print(course_sessions_list)
#         sessions_list = session_record_table.objects.filter(id__in=course_sessions_list)
#         print(sessions_list)

#         serialized_sessions = []
#         for session in sessions_list:
#             serialized_session = {
#                 'id': session.id,
#                 'course_name': session.course_name,
#                 'date': session.date,
#                 'start_time': session.start_time,
#                 'end_time': session.end_time,
#                 'location': session.location,
#             }

#             serialized_sessions.append(serialized_session)

#         return Response(serialized_sessions, status=status.HTTP_200_OK)

#     except course_table.DoesNotExist:
#         return Response({'error': 'Course not found.'}, status=status.HTTP_200_OK)
#     except json.JSONDecodeError:
#         return Response({'error': 'Invalid sessions_list format in course.'}, status=status.HTTP_200_OK)
    
#######################################################################################################3


###################################################################################


@api_view(['POST'])
def show_active_sessions(request):

    if 'course_name' not in request.data:
        return Response({'msg': 'course_name field is required.'}, status=status.HTTP_200_OK)
    jsonDec = json.decoder.JSONDecoder()
    # print(request.data)
    
    session_records = session_record_table.objects.filter(course_name=request.data['course_name'])
    if(len(session_records)!=0):

        course=course_table.objects.filter(name=request.data["course_name"])
        course_serializer=Course_Table_Serializers(course, many=True)   
        # print(person_serialised)
        if(len(course)==0):
            return Response({'msg': 'No such course exist.'}, status=status.HTTP_200_OK) 
        # print(person)
        # print(course_records)
            
        # Get today's date
        today_date = datetime.now().date().strftime('%Y-%m-%d')
        current_time = datetime.now().time().strftime('%H:%M:%S')

        session_data_struct=[]
        for i in session_records:
            check_student_attnedance=attendance_record_table.objects.filter(student_Id=request.data['student_id'],session=i.id)
            if(len(check_student_attnedance)==0):

                a=datetime.strptime(str(i.start_time), '%H:%M:%S').time()
                b=datetime.strptime(str(current_time), '%H:%M:%S').time()
                c=datetime.strptime(str(i.end_time), '%H:%M:%S').time()

                x=datetime.strptime(str(i.date), '%Y-%m-%d').date()
                y=datetime.strptime(str(today_date), '%Y-%m-%d').date()

                if (a<=b<=c) and (x == y):
                    session_data_struct.append({
                        'course_name':i.course_name,
                        'date':i.date, 
                        'start_time':i.start_time,
                        'end_time':i.end_time,
                        'lat':i.lat,
                        'lon':i.lon,
                        'check':i.presence})
                else:
                    continue
                
        if(len(session_data_struct)==0):
            course=course_table.objects.filter(name=request.data["course_name"])
            course_serializer=Course_Table_Serializers(course, many=True)
            # print(person_serialised)
            if(len(course)==0):
                return Response({'msg': 'No such course exist.'}, status=status.HTTP_200_OK)   
            a={"info":course_serializer.data}
            a.update({"course_data": [{'date':"There are no active sessions for this course",'start_time':"00:00:00",'end_time':"00:00:00"}]})
            return Response(a, status=status.HTTP_200_OK)            
            
        session_serializer = Session_Record_Table_Serializers(session_data_struct, many=True)  # Serialize the course data
    
        # print(course_serializer)
        a={"info":course_serializer.data}
        a.update({"course_data": session_serializer.data})
        return Response(a, status=status.HTTP_200_OK)
    

    course=course_table.objects.filter(name=request.data["course_name"])
    course_serializer=Course_Table_Serializers(course, many=True)
    # print(person_serialised)
    if(len(course)==0):
        return Response({'msg': 'No such course exist.'}, status=status.HTTP_200_OK)   
    a={"info":course_serializer.data}
    a.update({"course_data": [{'date':"There are no active sessions for this course",'start_time':"00:00:00",'end_time':"00:00:00"}]})
    return Response(a, status=status.HTTP_200_OK)

# @api_view(["POST"])
# def course_session_details_teacher(request):
#     if 'course_name' not in request.data:
#         return Response({'error': 'course_name field is required.'}, status=status.HTTP_200_OK)

#     course_name = request.data['course_name']
#     try:
#         course = course_table.objects.get(name=course_name)
#         course_sessions_list = json.loads(course.sessions_list)
#         print(course_sessions_list)
#         sessions_list = session_record_table.objects.filter(id__in=course_sessions_list)
#         print(sessions_list)

#         serialized_sessions = []
#         for session in sessions_list:
#             serialized_session = {
#                 'id': session.id,
#                 'course_name': session.course_name,
#                 'date': session.date,
#                 'start_time': session.start_time,
#                 'end_time': session.end_time,
#                 'location': session.location,
#             }

#             serialized_sessions.append(serialized_session)

#         return Response(serialized_sessions, status=status.HTTP_200_OK)

#     except course_table.DoesNotExist:
#         return Response({'error': 'Course not found.'}, status=status.HTTP_200_OK)
#     except json.JSONDecodeError:
#         return Response({'error': 'Invalid sessions_list format in course.'}, status=status.HTTP_200_OK)
    
#######################################################################################################

@api_view(['POST'])
def show_students(request):

    jsonDec = json.decoder.JSONDecoder()
    # print(request.data)
    course=course_table.objects.filter(name=request.data["course_name"])
    if(len(list(course))==0):
        course_serialized=Course_Table_Serializers(course, many=True)
        # print(person_serialised)
        if(len(list(course))==0):
            return Response({'msg': 'No such course exist.'}, status=status.HTTP_200_OK)   
        a={"info":course_serialized.data}
        a.update({"course_data": [{'name':"No students enrolled in the course so far",'description':":)"}]})
        return Response(a, status=status.HTTP_200_OK)   

    course_serialized=Course_Table_Serializers(course, many=True)
    course=course.first()
    student_records = list(jsonDec.decode(course.students_list))
    print("student_records:" + str(student_records))
    if(len(student_records)!=0):          
        student_data = person_table.objects.filter(id__in=student_records)  # Get course data

        student_data_struct=[]
        for i in student_data:
            student_data_struct.append({'name':i.name,'rollNumber':i.rollNumber,'email':i.email})
            # print(i.teacher)
        student_serializer = Person_Table_Serializers(student_data_struct, many=True)  # Serialize the course data
    
        # print(course_serializer)
        a={"info":course_serialized.data}
        a.update({"course_data": student_serializer.data})
        return Response(a, status=status.HTTP_200_OK)
    

    course=course_table.objects.filter(name=request.data["course_name"])
    course_serialized=Course_Table_Serializers(course, many=True)
    # print(person_serialised)
    if(len(course)==0):
        return Response({'msg': 'No such course exist.'}, status=status.HTTP_200_OK)   
    a={"info":course_serialized.data}
    a.update({"course_data": [{'name':"No students enrolled in the course so far",'description':":)"}]})
    return Response(a, status=status.HTTP_200_OK)


#######################################################################################################

@api_view(['POST'])
def show_students_in_session(request):
    currSession=session_record_table.objects.filter(course_name=request.data['course_name'],date=request.data['date'],start_time=request.data['start_time'],end_time=request.data['end_time'],lat=request.data['lat'],lon=request.data['lon'])
    session_serializer=Session_Record_Table_Serializers(currSession,many=True)
    currSession=currSession.first()
    attendance_records=attendance_record_table.objects.filter(session=currSession.id)

    student_data_struct=[]
    for i in attendance_records:
        student=person_table.objects.filter(rollNumber=i.student_Id).first()
        student_data_struct.append({'name':student.name,'rollNumber':student.rollNumber,'email':student.email})

    if(len(student_data_struct)!=0):
        student_serializer = Person_Table_Serializers(student_data_struct, many=True)  # Serialize the course data

        # print(course_serializer)
        a={"info":session_serializer.data}
        a.update({"course_data": student_serializer.data})
        return Response(a, status=status.HTTP_200_OK)
    
    else:    
        a={"info":session_serializer.data}
        a.update({"course_data": [{'name':"No students have marked the attendance so far",'rollNumber':":)"}]})
        return Response(a, status=status.HTTP_200_OK)



#######################################################################################################


@api_view(['POST'])
def delete_course(request):
    try:
        #deleting courses from the database
        course=course_table.objects.filter(name=request.data['course_name'],verification_code=request.data['verification_code'])
        if(len(course)==0):
            return Response({'msg': 'No such course exist.'}, status=status.HTTP_200_OK) 


        course=course.first()

        #removing all the session and attendances corresponding to course sessions
        sessions=session_record_table.objects.filter(course_name=request.data['course_name'])
        for i in sessions:
            attendance_records=attendance_record_table.objects.filter(session=i.id)
            for j in attendance_records:
                j.delete()

            i.delete()

        #deleting the course id from the person's course_created list
        teacher=person_table.objects.filter(rollNumber=request.data['teacher']).first()
        jsonDec=json.decoder.JSONDecoder()
        courses_created=jsonDec.decode(teacher.course_list_created)
        courses_created.remove(course.id)
        teacher.course_list_created=json.dumps(courses_created)
        teacher.save()

        #deleting the course from every students enrollment list
        students=list(jsonDec.decode(course.students_list))
        if(students!=['[',']'] and students!=[]):
            for i in students:
                person=person_table.objects.filter(pk=i).first()
                courses_enrolled=jsonDec.decode(person.courses_list)
                courses_enrolled.remove(course.id)
                person.courses_list=json.dumps(courses_enrolled)
                person.save()

        #finally deleting the course
        course_table.objects.filter(name=request.data['course_name'],verification_code=request.data['verification_code']).delete()

        return Response({'msg': 'Course Deletion was successful.'}, status=status.HTTP_200_OK)

    except course_table.DoesNotExist:
        return Response({'msg': 'Invalid Course Code'}, status=status.HTTP_200_OK)

    except person_table.DoesNotExist:
        return Response({'msg': 'Student not found.'}, status=status.HTTP_200_OK)

    except json.JSONDecodeError:
        return Response({'msg': 'Invalid courses_list format in student.'}, status=status.HTTP_200_OK)



####################################################################################################### 


@api_view(['POST'])
def delete_session(request):
    try:
        if(request.data['date']=='No Sessions started so far'):
            return Response({'msg': 'No such session exist.'}, status=status.HTTP_200_OK) 
        currSession=session_record_table.objects.filter(course_name=request.data['course_name'],date=request.data['date'],start_time=request.data['start_time'],end_time=request.data['end_time'],lat=request.data['lat'],lon=request.data['lon'])
        currSession=currSession.first()
        attendance_records=attendance_record_table.objects.filter(session=currSession.id)
        for i in attendance_records:
            i.delete()

        session_record_table.objects.filter(course_name=request.data['course_name'],date=request.data['date'],start_time=request.data['start_time'],end_time=request.data['end_time'],lat=request.data['lat'],lon=request.data['lon']).delete()
        return Response({'msg': 'Session Deleted Successfully.'}, status=status.HTTP_200_OK)  


    except session_record_table.DoesNotExist:
        return Response({'msg': 'Invalid Course Code'}, status=status.HTTP_200_OK)

    except person_table.DoesNotExist:
        return Response({'msg': 'Student not found.'}, status=status.HTTP_200_OK)

    except json.JSONDecodeError:
        return Response({'msg': 'Invalid courses_list format in student.'}, status=status.HTTP_200_OK)
##############################################################################################################################
    

@api_view(["POST"])
def course_stats(request):
    jsonDec = json.decoder.JSONDecoder()
    course=course_table.objects.filter(name=request.data["course_name"],verification_code=request.data["verification_code"]).first()

    number_enrolled_students=len(jsonDec.decode(course.students_list)) #stat1
    number_sessions=len(session_record_table.objects.filter(course_name=request.data["course_name"])) #stat2
    
    session_list=session_record_table.objects.filter(course_name=request.data["course_name"])
    
    temp0=-1
    temp1=-1
    temp2=0

    for i in session_list:
        x=len(attendance_record_table.objects.filter(session=i.id))
        temp2+=x
        if(x>=temp1):
            temp1=x
            temp0=i.id
        



    if(number_sessions==0):
        average_attendance_rate=0    #stat3 i.e.on an average how many students attend every session out of the total enrolled
    else:
        average_attendance_rate=temp2/number_sessions

    if(temp1==-1):
        max_attendance_session=-1   #stat4 the id of the session which had the most attendance
        a={"num_enrolled":number_enrolled_students,"num_sessions":number_sessions,"avg_rate":average_attendance_rate,"max_session_date":"No such sessions started so far","start_time":"00:00","end_time":"00:00"}
        return Response(a,status=status.HTTP_200_OK)

    max_attendance_session=temp0
    session=session_record_table.objects.filter(pk=max_attendance_session).first()
    a={"num_enrolled":number_enrolled_students,"num_sessions":number_sessions,"avg_rate":average_attendance_rate,"max_session_date":session.date,"start_time":session.start_time,"end_time":session.end_time}
    return Response(a,status=status.HTTP_200_OK)





# @api_view(["POST"])
# def session_attendance_stats(request):
#     if 'course_name' not in request.data or 'date' not in request.data or 'start_time' not in request.data or 'end_time' not in request.data:
#         return Response({'error': 'course_name, date, start_time, and end_time fields are required.'},
#                         status=status.HTTP_200_OK)

#     course_name = request.data['course_name']
#     date = request.data['date']
#     start_time = request.data['start_time']
#     end_time = request.data['end_time']

#     try:
#         session = session_record_table.objects.get(
#             course_name=course_name, date=date, start_time=start_time, end_time=end_time)

#         session_id = session.id

#         # getting number of students present
#         students_marked = len(list(attendance_record_table.objects.filter(
#             course_name=course_name, session=session_id)))

#         # getting total number of students in the course
#         course = course_table.objects.get(name=course_name)
#         total_students = len(json.loads(course.students_list))

#         return Response({'students_marked': students_marked, 'total_students': total_students},
#                         status=status.HTTP_200_OK)

#     except session_record_table.DoesNotExist:
#         return Response({'error': 'Session not found.'}, status=status.HTTP_200_OK)

#     except attendance_record_table.DoesNotExist:
#         return Response({'error': 'Attendance records not found.'}, status=status.HTTP_200_OK)

#     except course_table.DoesNotExist:
#         return Response({'error': 'Course not found.'}, status=status.HTTP_200_OK)

#     except json.JSONDecodeError:
#         return Response({'error': 'Invalid students_list format in course.'}, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = (request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)