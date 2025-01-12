import os
import token
from django.conf import settings
from django.http import FileResponse, JsonResponse,HttpResponse
from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.urls import reverse_lazy,reverse
from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,viewsets,generics
from django.views.decorators.csrf import csrf_exempt,ensure_csrf_cookie,csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view
from .tasks import *
from .models import *
from .serializers import *
from django.utils.encoding import smart_str
from urllib.parse import urljoin
from django.middleware.csrf import get_token
from django.contrib.auth.models import Group,User
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate,get_user_model
from django.db import IntegrityError
from elearn_app.serializers import serializers
from django.contrib.auth.hashers import check_password
from django.test import TestCase
from rest_framework.test import APIClient

import secrets
from jose import jwt

SECRET_KEY = 'cf22caa8b5ec97f6e27c23254c87983fb9ca57afea19aae6e0'

# Create your views here.
# Generate a random 50-character string
#secret_key = secrets.token_hex(25)
#print(secret_key)


def generate_auth_token(user_id):
    # Define the payload (data you want to include in the token)
    payload = {'user_id': user_id}

    # Generate the token
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return token

def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

@api_view(['POST'])
def upload_file(request, room_name):
    if 'file' in request.FILES:
        file = request.FILES['file']
        file_path = os.path.join(settings.MEDIA_ROOT, room_name, file.name)
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        # Get the file URL
        #file_url = request.build_absolute_uri(reverse('download_file', args=[room_name, file.name]))
        file_url = urljoin(settings.MEDIA_URL, f'{room_name}/{file.name}')
        print(file_url)
        return JsonResponse({'message': 'File uploaded successfully', 'file_url': file_url})
    else:
        return JsonResponse({'error': 'No file provided'}, status=400)


@csrf_exempt
def download_file(request, room_name, filename):
    file_path = os.path.join(settings.MEDIA_ROOT, room_name, filename)
    with open(file_path, 'rb') as file:
        response = FileResponse(file)
        response['Content-Disposition'] = f'attachment; filename={smart_str(filename)}'
        return response
    
@api_view(['GET'])
def search_user(request):
    name = request.query_params.get('name', '')
    print(name)
    try:
        user = CustomUser.objects.get(name__icontains=name)
        user_data = UserFetchSerializer(user).data

        if user.role == CustomUser.TEACHER:
            teacher_profile = TeacherProfile.objects.get(user=user)
            user_data['teacherProfile'] = TeacherProfileSerializer(teacher_profile).data
        elif user.role == CustomUser.STUDENT:
            student_profile = StudentProfile.objects.get(user=user)
            user_data['studentProfile'] = StudentProfileSerializer(student_profile).data

        return Response(user_data)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

class TeacherListView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(role=1)
    serializer_class = TeacherUserSerializer

class CourseList(APIView):
    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CourseDetailsView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CourseFetchDetailsView(generics.ListAPIView):
    serializer_class = CourseSerializer

    def get_queryset(self):
        # Retrieve the user ID from the request parameters
        user_id = self.request.query_params.get('user_id')
        print(user_id)
        if user_id:
            # Filter topics based on the provided course_id
            queryset = Course.objects.filter(user=user_id)
            return queryset
        else:
            return Course.objects.all()

        # Filter courses based on the user ID
        #return Course.objects.filter(user=user_id)
    
class TopicsForCourseView(generics.ListAPIView):
    serializer_class = TopicSerializer

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        if course_id:
            # Filter topics based on the provided course_id
            queryset = Topic.objects.filter(course__id=course_id)
            return queryset
        else:
            return Topic.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class Register(APIView):
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        print("Request data:",request.data)
        
        serializer = UserSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as validation_error:
            # Handle validation error
            print("Validation Errors: ",str(validation_error));
            return Response({'message': str(validation_error), 'errors': str(validation_error)}, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            serialized_data = serializer.validated_data
            print("Serialized data:", serialized_data)
            user = serializer.save()
            StudentProfile.objects.create(user = user)
            return Response({'message': 'Registration successful!'}, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", serializer.errors)
            return Response({'message': 'Registration failed!', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            

class Login(APIView):
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        data = request.data
        print("Data Found:",data)
        print(data.get('username'))
        print(data.get('password'))
        user = authenticate(request, username=data.get('username'), password=data.get('password'))
        print("User Authenticate Data:", user)
        
        if user and check_password(data['password'], user.password):
            print("in if logic")
            serializer = UserSerializer(user)
            # Generate the authentication token
            auth_token = generate_auth_token(serializer.data['id'])
            #token, created = Token.objects.get_or_create(user=user)
            return Response({'isLogin': True, 'uid': serializer.data['id'], 'role': serializer.data['role'], 'token': auth_token, 'username': serializer.data['username']}) #, 'token': token.key
        else:
            print("User not authenticated")
            return Response({'isLogin': False}, status=status.HTTP_401_UNAUTHORIZED)
        

class AdminData(APIView):
    
    def get(self, request, *args, **kwargs):
        data = request.data
        print("Data Found:",data)
        try:
            admin_user = Admin.objects.get(user=request.user)
            admin_serializer = AdminSerializer(admin_user)
            return Response(admin_serializer.data)
        except Admin.DoesNotExist:
            return Response({'detail': 'Admin data not found for the user.'}, status=status.HTTP_404_NOT_FOUND)
        
class CreateUserRoles(APIView):
    def get(self, request, *args, **kwargs):
        try:
            admin_group, _ = Group.objects.get_or_create(name='Admin')
            teacher_group, _ = Group.objects.get_or_create(name='Teacher')
            student_group, _ = Group.objects.get_or_create(name='Student')

            User = get_user_model()

            admin_user, created = User.objects.get_or_create(username='admin', defaults={'role': User.ADMIN})
            if created:
                admin_user.set_password('admin_password')
                admin_user.save()
                admin_group.user_set.add(admin_user)

            teacher_user, created = User.objects.get_or_create(username='teacher', defaults={'role': User.TEACHER})
            if created:
                teacher_user.set_password('teacher_password')
                teacher_user.save()
                teacher_group.user_set.add(teacher_user)

            student_user, created = User.objects.get_or_create(username='student', defaults={'role': User.STUDENT})
            if created:
                student_user.set_password('student_password')
                student_user.save()
                student_group.user_set.add(student_user)

            return Response({'message': 'User roles created successfully.'}, status=status.HTTP_200_OK)

        except IntegrityError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChangePasswordView(APIView):
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        data = request.data
        print("Data Found:",data)
        try:
            user = CustomUser.objects.get(username='admin')
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        current_password = data.get('currentPassword', '')
        new_password = data.get('newPassword', '')
        confirm_new_password = data.get('confirmNewPassword', '')
        # Check if the current password provided matches the user's current password
        print(user.password)
        if not check_password(current_password, user.password):
            return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the new password and confirmation match
        if new_password != confirm_new_password:
            return Response({'error': 'New password and confirmation do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the user's password
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password Changed Successfully.'}, status=status.HTTP_200_OK)

class CurrentUserView(APIView):
    def get(self, request):
        # Assuming user is logged in and you are using Django's default authentication
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UsernameFromUserIdView(APIView):
    def get(self, request, *args, **kwargs):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            user = get_object_or_404(CustomUser, id=user_id)
            return Response({'username': user.username}, status=status.HTTP_200_OK)
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class UploadedFileAPIView(APIView):
    def post(self, request, format=None):
        serializer = UploadedFileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    @csrf_exempt
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.is_valid():
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class EnrollmentView(generics.ListCreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    
    @csrf_exempt
    def create(self, request, *args, **kwargs):
        print(request.data)
        user_id = request.data.get('user')
        course_id = request.data.get('course')

        # Check if the user is already enrolled in the course
        existing_enrollment = Enrollment.objects.filter(user=user_id, course=course_id).first()
        if existing_enrollment:
            return Response({'error': 'User is already enrolled in this course.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.is_valid():
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class EnrollmentFetchView(generics.ListCreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentFetchSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            return Enrollment.objects.filter(user=user_id).select_related('course')
        return Enrollment.objects.none()
    
class EnrollmentGetFetchView(generics.ListCreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentGetFetchSerializer
    
    def get_queryset(self):
        course_id = self.request.query_params.get('course_id', None)

        if course_id is not None:
            queryset = Enrollment.objects.filter(course=course_id).select_related('user', 'course')
            return queryset
        return Enrollment.objects.none()


class TopicsGetFetchView(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    
    def get_queryset(self):
        course_id = self.request.query_params.get('course_id', None)

        if course_id is not None:
            queryset = Topic.objects.filter(course=course_id)
            return queryset
        return Topic.objects.none()
    
""" class TopicGetFetchView(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    
    def get_queryset(self):
        course_id = self.request.query_params.get('course_id', None)

        if course_id is not None:
            queryset = Topic.objects.filter(course=course_id)
            return queryset
        return Topic.objects.none()
         """
    

class TopicListCreateView(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

    @csrf_exempt
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.is_valid():
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
class TestListCreateView(generics.ListCreateAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

    csrf_exempt
    def create(self, request, *args, **kwargs):
        received_data = request.data
        print(received_data)

        # Check if 'questions' key is present in received_data
        questions = received_data.get('questions')
        if not questions:
            return Response({'error': 'No questions provided'}, status=status.HTTP_400_BAD_REQUEST)

        
        # Assuming you have a course_id and topic_id available in the request data
        course = received_data.get('questions')[0].get('course')
        topic = received_data.get('questions')[0].get('topic')
        
        # Validate questions
        questions = received_data.get('questions', [])
        #errors = {}

    
        # Create Test instances for each question
        for index, question_data in enumerate(questions, start=0):
            question = question_data.get('question')
            print(question)
            option_a = question_data.get('option_a')
            print(option_a)
            option_b = question_data.get('option_b')
            print(option_b)
            option_c = question_data.get('option_c')
            print(option_c)
            option_d = question_data.get('option_d')
            print(option_d)
            answer = question_data.get('answer')
            print(answer)
            print("Question Data: ",question_data)
            # Transform the data to match the serializer expectations
            
            serializer = self.get_serializer(data=question_data)
            serializer.is_valid(raise_exception=True)
            course_instance = get_object_or_404(Course, id=course)
            topic_instance = get_object_or_404(Topic, id=topic)
            Test.objects.create(
                course=course_instance,
                topic=topic_instance,
                question=question,
                option_a=option_a,
                option_b=option_b,
                option_c=option_c,
                option_d=option_d,
                answer=answer,
            )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
            
class RegisterTeacher(APIView):
    
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            user_serializer = UserSerializer(data=request.data)
            if user_serializer.is_valid():
                user = user_serializer.save()
                TeacherProfile.objects.create(user=user)
                return Response(user_serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
class UpdateTopicView(APIView):
    
    def put(self, request, *args, **kwargs):
        # Assuming you have a TopicUpdate model with a foreign key to the Course model
        topic_id = self.request.query_params.get('topic_id')
        user_id = self.request.query_params.get('user_id')
        course_id = self.request.query_params.get('course_id')
        print("topic_id",topic_id)
        print("course_id",course_id)
        print("user_id",user_id)
        if topic_id:
            topic_update = get_object_or_404(Topic, id=topic_id)
            serializer = TopicSerializer(topic_update, data=request.data)
            if serializer.is_valid():
                serializer.save()
                user = get_object_or_404(CustomUser, id=user_id)
                topic = get_object_or_404(Topic, id = topic_id)
                course = get_object_or_404(Course, id = course_id)
                UpdateHistory.objects.create(
                    user=user,
                    role=1,  # User role
                    type='topicUpdated',
                    course=course,
                    topic=topic,
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Topic id not found'}, status=status.HTTP_404_NOT_FOUND)
                
class UpdateHistoryView(APIView):
    def get(self, request, *args, **kwargs):
        user_id = self.request.query_params.get('user_id')
        
        if user_id:
            try:
                # Get all courses enrolled by the user
                user_enrollments = Enrollment.objects.filter(user=user_id)
                
                # Get topics of those enrolled courses from UpdateHistory
                update_history_entries = UpdateHistory.objects.filter(
                    course__in=user_enrollments.values('course'),
                    type='topicUpdated',
                    status = 'active'
                )

                # Serialize the data
                serializer = UpdateHistorySerializer(update_history_entries, many=True)
                
                return Response(serializer.data)
            except Enrollment.DoesNotExist:
                return Response({"error": "User not found or not enrolled in any courses"}, status=status.HTTP_404_NOT_FOUND)
            
    def put(self, request, *args, **kwargs):
        history_id = self.request.query_params.get('history_id')
        #history_id = kwargs.get('pk')
        print(history_id)
        status_value = 'inactive'

        if not history_id or status_value not in ('active', 'inactive'):
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)

        update_history_entry = get_object_or_404(UpdateHistory, pk=history_id)

        # Update the status
        update_history_entry.status = status_value
        update_history_entry.save()

        return Response({"success": "Status updated successfully"}, status=status.HTTP_200_OK)

class TeacherProfileView(APIView):
    def get(self, request, *args, **kwargs):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            print("User Id: ",user_id)
            teacher_profile = TeacherProfile.objects.get(user=user_id)
            serializer = TeacherProfileSerializer(teacher_profile)
            print(serializer.data)
            return Response(serializer.data)
        return Response("user_id not found", status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            teacher_profile = TeacherProfile.objects.get(user=user_id)
            serializer = TeacherProfilePutSerializer(teacher_profile, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
class MyStudentsProfile(APIView):
    def get(self, request, *args, **kwargs):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            student_profile = StudentProfile.objects.filter(user=user_id).first()
            serializer = StudentProfileSerializer(student_profile)
            return Response(serializer.data)
        return Response("user_id not found",status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, *args, **kwargs):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            student_profile = StudentProfile.objects.filter(user=user_id).first()
            serializer = StudentProfileSerializer(student_profile, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
class StudyView(APIView):
    def get(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        topics = Topic.objects.filter(course=course)
        # Serialize course and topic data
        course_serializer = CourseSerializer(course)
        topic_serializer = TopicSerializer(topics, many=True)
        # Combine course and topic data in a dictionary
        data = {
            'course': course_serializer.data,
            'topics': topic_serializer.data,
        }
        return Response(data)


class GetCourse(APIView):
    def get(self, request, *args,**kwargs):
        course_id = self.request.query_params.get('course_id')
        
        if course_id:
            
            course = Course.objects.get(id = course_id)
            course_serializer = CourseSerializer(course)
            
            return Response(course_serializer.data)
        return Response({"course id not found"}, status = status.HTTP_404_NOT_FOUND)


class TopicDataView(APIView):
    def get(self, request, *args, **kwargs):
        topic_id = self.request.query_params.get('topic_id')
        print("Topic Data View: ", topic_id)
        if topic_id:
            print("Topic id: ",topic_id)
            try:
                topic_data = Topic.objects.get(id=topic_id)
                serializer = TopicSerializer(topic_data)
                print(topic_data)
                return Response(serializer.data)
            except Topic.DoesNotExist:
                return Response({"error": "Topic not found"}, status=status.HTTP_404_NOT_FOUND)

class ContactMessageView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer


""" class FileUploadView(APIView):
    
    def post(self, request, *args, **kwargs):
        file_data = request.data.get('file')
        sender = request.user.username  # Assuming you are using Django's built-in User model
        room = request.data.get('room')

        if not file_data:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Invoke the Celery task
        process_file.delay(file_data, sender, room)

        return Response({'message': 'File upload task queued'}, status=status.HTTP_202_ACCEPTED) """


