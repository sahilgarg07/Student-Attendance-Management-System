import random

from datetime import datetime

import simplejson as json

from rest_framework.decorators import api_view, action
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from .serializers import Session_Record_Table_Serializers, Course_Table_Serializers, Person_Table_Serializers, \
    Attendance_Record_Table_Serializers, Regisatration_Image_Serializer
from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import person_table, course_table, session_record_table, attendance_record_table


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
    if(len(list(courses_existing))!=0):
         return Response({'error': 'Course Name already taken'},
                            status=status.HTTP_400_BAD_REQUEST) 
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
         return Response({'error': 'Session Already exists'},
                            status=status.HTTP_400_BAD_REQUEST) 

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
    
    return Response({'error': 'Serializer Invalid'},
                            status=status.HTTP_400_BAD_REQUEST) 
    # session_id = session_record_table.objects.filter(
    #     course_name=course_name, date=date, start_time=start_time, end_time=end_time, location=location).values(
    #     "id")[0]["id"]

    # print(session_id)

    # course = course_table.objects.get(name=course_name)
    # if not (course):
    #     return Response(status=status.HTTP_404_NOT_FOUND)
    # jsonDec = json.decoder.JSONDecoder()
    # session_records = jsonDec.decode(course.sessions_list)
    # session_records.append(session_id)

    # course.sessions_list = json.dumps(session_records)
    # course.save()





####################################################################################################################

@api_view(['POST'])
def new_student(request):
    serializer = Person_Table_Serializers(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(courses_list=json.dumps([]),course_list_created=json.dumps([]))
    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
def mark_attendance(request):
    serializer = Attendance_Record_Table_Serializers(data=request.data)
    if serializer.is_valid():
        student_id = serializer.validated_data['student_id']
        course_name = serializer.validated_data['course_name']

        try:
            course = course_table.objects.get(name=course_name)
            print(course.sessions_list)
            course_sessions_list = json.loads(course.sessions_list)
            print(course_sessions_list)
            session_id = course_sessions_list[-1]
            print(session_id)
            ins = attendance_record_table(student_id=student_id, session=session_id)
            ins.save()
            return Response({'msg': 'Attendance marked successfully.'}, status=status.HTTP_201_CREATED)
        except course_table.DoesNotExist:
            return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
        except json.JSONDecodeError:
            return Response({'error': 'Invalid sessions_list format in course.'},
                            status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



@api_view(["POST"])
def session_attendance_list(request):
    if 'course_name' not in request.data or 'date' not in request.data or 'start_time' not in request.data or 'end_time' not in request.data:
        return Response({'error': 'course_name, date, start_time, and end_time fields are required.'},
                        status=status.HTTP_400_BAD_REQUEST)

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
        return Response({'error': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)

    except attendance_record_table.DoesNotExist:
        return Response({'error': 'Attendance records not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
def session_attendance_stats(request):
    if 'course_name' not in request.data or 'date' not in request.data or 'start_time' not in request.data or 'end_time' not in request.data:
        return Response({'error': 'course_name, date, start_time, and end_time fields are required.'},
                        status=status.HTTP_400_BAD_REQUEST)

    course_name = request.data['course_name']
    date = request.data['date']
    start_time = request.data['start_time']
    end_time = request.data['end_time']

    try:
        session = session_record_table.objects.get(
            course_name=course_name, date=date, start_time=start_time, end_time=end_time)

        session_id = session.id

        # getting number of students present
        students_marked = len(list(attendance_record_table.objects.filter(
            course_name=course_name, session=session_id)))

        # getting total number of students in the course
        course = course_table.objects.get(name=course_name)
        total_students = len(json.loads(course.students_list))

        return Response({'students_marked': students_marked, 'total_students': total_students},
                        status=status.HTTP_200_OK)

    except session_record_table.DoesNotExist:
        return Response({'error': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)

    except attendance_record_table.DoesNotExist:
        return Response({'error': 'Attendance records not found.'}, status=status.HTTP_404_NOT_FOUND)

    except course_table.DoesNotExist:
        return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

    except json.JSONDecodeError:
        return Response({'error': 'Invalid students_list format in course.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def course_session_details_student(request):
    if 'course_name' not in request.data or 'student_id' not in request.data:
        return Response({'error': 'course_name and student_id fields are required.'},
                        status=status.HTTP_400_BAD_REQUEST)

    course_name = request.data['course_name']
    student_id = request.data['student_id']

    try:
        # Get the list of sessions the student is marked present for
        present_sessions_data = list(
            attendance_record_table.objects.filter(course_name=course_name, student_id=student_id))
        present_sessions = [session_record_table.objects.get(id=i.session) for i in present_sessions_data]

        # Get the list of all sessions for the specified course
        course_sessions_list = json.loads(course_table.objects.get(name=course_name).sessions_list)
        sessions_list = session_record_table.objects.filter(id__in=course_sessions_list)

        serialized_present_sessions = []
        for session in present_sessions:
            serialized_session = {
                'id': session.id,
                'course_name': session.course_name,
                'date': session.date,
                'start_time': session.start_time,
                'end_time': session.end_time,
                'lat': session.lat,
                'lon':session.lon
            }
            serialized_present_sessions.append(serialized_session)

        serialized_all_sessions = []
        for session in sessions_list:
            serialized_session = {
                'id': session.id,
                'course_name': session.course_name,
                'date': session.date,
                'start_time': session.start_time,
                'end_time': session.end_time,
                'lat': session.lat,
                'lon':session.lon
            }
            serialized_all_sessions.append(serialized_session)

        return Response({'present': serialized_present_sessions, 'total': serialized_all_sessions},
                        status=status.HTTP_200_OK)

    except attendance_record_table.DoesNotExist:
        return Response({'error': 'Attendance records not found.'}, status=status.HTTP_404_NOT_FOUND)

    except course_table.DoesNotExist:
        return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

    except json.JSONDecodeError:
        return Response({'error': 'Invalid sessions_list format in course.'}, status=status.HTTP_400_BAD_REQUEST)



####################################################################################################
@api_view(["POST"])
def course_registration(request):
    if 'student_id' not in request.data or 'verification_code_entered' not in request.data:
        return Response({'error': 'student_id and verification_code_entered fields are required.'},
                        status=status.HTTP_400_BAD_REQUEST)

    student_id = request.data['student_id']
    verification_code_entered = request.data['verification_code_entered']
    # print(student_id,verification_code_entered)

    try:
        # Check the validity of the verification code
        course = course_table.objects.filter(verification_code=verification_code_entered).first()
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
        return Response({'error': 'Invalid Verification Code'}, status=status.HTTP_400_BAD_REQUEST)

    except person_table.DoesNotExist:
        return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)

    except json.JSONDecodeError:
        return Response({'error': 'Invalid courses_list format in student.'}, status=status.HTTP_400_BAD_REQUEST)

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
            return Response(status=status.HTTP_404_NOT_FOUND)
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
        return Response(status=status.HTTP_404_NOT_FOUND)   
    a={"info":person_serialised.data}
    a.update({"course_data": [{'name':"No courses Created so far",'description':":)"}]})
    return Response(a, status=status.HTTP_200_OK)



###################################################################################
@api_view(['POST'])
def show_enrolled(request):
    jsonDec = json.decoder.JSONDecoder()
    # print(request.data)
    person=person_table.objects.filter(rollNumber=request.data["teacher"])
    course_records = jsonDec.decode(person[0].courses_list)
    if(len(course_records)!=0):

        person=person_table.objects.filter(rollNumber=request.data["teacher"])
        person_serialised=Person_Table_Serializers(person, many=True)
        # print(person_serialised)
        if(len(person)==0):
            return Response(status=status.HTTP_404_NOT_FOUND)
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
        return Response(status=status.HTTP_404_NOT_FOUND)   
    a={"info":person_serialised.data}
    a.update({"course_data": [{'name':"No courses Enrolled so far",'description':":)"}]})
    return Response(a, status=status.HTTP_200_OK)

###################################################################################


@api_view(['POST'])
def show_sessions(request):

    if 'course_name' not in request.data:
        return Response({'error': 'course_name field is required.'}, status=status.HTTP_400_BAD_REQUEST)
    jsonDec = json.decoder.JSONDecoder()
    # print(request.data)
    
    session_records = session_record_table.objects.filter(course_name=request.data['course_name'])
    if(len(session_records)!=0):

        course=course_table.objects.filter(name=request.data["course_name"])
        course_serializer=Course_Table_Serializers(course, many=True)   
        # print(person_serialised)
        if(len(course)==0):
            return Response(status=status.HTTP_404_NOT_FOUND)
        # print(person)
        # print(course_records)
            
        
        session_data_struct=[]
        for i in session_records:
            session_data_struct.append({
                'course_name':i.course_name,
                'date':i.date, 
                'start_time':i.start_time,
                'end_time':i.end_time,
                'lat':i.lat,
                'lon':i.lon})
            
        session_serializer = Session_Record_Table_Serializers(session_data_struct, many=True)  # Serialize the course data
    
        # print(course_serializer)
        a={"info":course_serializer.data}
        a.update({"course_data": session_serializer.data})
        return Response(a, status=status.HTTP_200_OK)
    

    course=course_table.objects.filter(name=request.data["course_name"])
    course_serializer=Course_Table_Serializers(course, many=True)
    # print(person_serialised)
    if(len(course)==0):
        return Response(status=status.HTTP_404_NOT_FOUND)   
    a={"info":course_serializer.data}
    a.update({"course_data": [{'date':"No Sessions started so far",'start_time':"00:00:00",'end_time':"00:00:00"}]})
    return Response(a, status=status.HTTP_200_OK)

# @api_view(["POST"])
# def course_session_details_teacher(request):
#     if 'course_name' not in request.data:
#         return Response({'error': 'course_name field is required.'}, status=status.HTTP_400_BAD_REQUEST)

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
#         return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
#     except json.JSONDecodeError:
#         return Response({'error': 'Invalid sessions_list format in course.'}, status=status.HTTP_400_BAD_REQUEST)
    
#######################################################################################################3


###################################################################################


@api_view(['POST'])
def show_active_sessions(request):

    if 'course_name' not in request.data:
        return Response({'error': 'course_name field is required.'}, status=status.HTTP_400_BAD_REQUEST)
    jsonDec = json.decoder.JSONDecoder()
    # print(request.data)
    
    session_records = session_record_table.objects.filter(course_name=request.data['course_name'])
    if(len(session_records)!=0):

        course=course_table.objects.filter(name=request.data["course_name"])
        course_serializer=Course_Table_Serializers(course, many=True)   
        # print(person_serialised)
        if(len(course)==0):
            return Response(status=status.HTTP_404_NOT_FOUND)
        # print(person)
        # print(course_records)
            
        # Get today's date
        today_date = datetime.now().date().strftime('%Y-%m-%d')
        current_time = datetime.now().time().strftime('%H:%M:%S')

        session_data_struct=[]
        for i in session_records:
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
                    'lon':i.lon})
            else:
                continue
        if(len(session_data_struct)==0):
            course=course_table.objects.filter(name=request.data["course_name"])
            course_serializer=Course_Table_Serializers(course, many=True)
            # print(person_serialised)
            if(len(course)==0):
                return Response(status=status.HTTP_404_NOT_FOUND)   
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
        return Response(status=status.HTTP_404_NOT_FOUND)   
    a={"info":course_serializer.data}
    a.update({"course_data": [{'date':"There are no active sessions for this course",'start_time':"00:00:00",'end_time':"00:00:00"}]})
    return Response(a, status=status.HTTP_200_OK)

# @api_view(["POST"])
# def course_session_details_teacher(request):
#     if 'course_name' not in request.data:
#         return Response({'error': 'course_name field is required.'}, status=status.HTTP_400_BAD_REQUEST)

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
#         return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
#     except json.JSONDecodeError:
#         return Response({'error': 'Invalid sessions_list format in course.'}, status=status.HTTP_400_BAD_REQUEST)
    
#######################################################################################################

@api_view(['POST'])
def show_students(request):
    jsonDec = json.decoder.JSONDecoder()
    # print(request.data)
    course=course_table.objects.filter(name=request.data["course_name"])
    student_records = list(jsonDec.decode(course[0].students_list))
    print("student_records:" + str(student_records))
    if(len(student_records)!=0):

        
        course_serialized=Course_Table_Serializers(course, many=True)
        # print(person_serialised)
        if(len(course)==0):
            return Response(status=status.HTTP_404_NOT_FOUND)
        # print(person)
        # print(course_records)
            
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
        return Response(status=status.HTTP_404_NOT_FOUND)   
    a={"info":course_serialized.data}
    a.update({"course_data": [{'name':"No students enrolled in the course so far",'description':":)"}]})
    return Response(a, status=status.HTTP_200_OK)


#######################################################################################################
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = (request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)