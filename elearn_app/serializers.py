from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}
        
    def validate(self, data):
        username = data.get('username')
        email = data.get('email')

        # Check if a user with the same username or email already exists
        if CustomUser.objects.filter(username=username).exists() or CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("User with this username or email already exists.")
        return data
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
    
class UserFetchSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email','role']  # Add other fields as neededv
    
class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Admin
        fields = '__all__'

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class EnrollmentFetchSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.course_name')
    title = serializers.CharField(source='course.title')
    image = serializers.ImageField(source='course.image')
    description = serializers.CharField(source='course.description')
    class Meta:
        model = Enrollment
        fields = '__all__'

class EnrollmentGetFetchSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.course_name')
    title = serializers.CharField(source='course.title')
    image = serializers.ImageField(source='course.image')
    description = serializers.CharField(source='course.description')
    username = serializers.CharField(source='user.username')
    name = serializers.CharField(source='user.name')

    class Meta:
        model = Enrollment
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'



class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['course', 'topic', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'answer']

class TeacherProfilePutSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = TeacherProfile
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user', None)
        user = UserSerializer(data=user_data)
        if user.is_valid():
            user_instance = user.save()
            teacher_profile = TeacherProfile.objects.create(user=user_instance, **validated_data)
            return teacher_profile
        else:
            raise serializers.ValidationError(user.errors)
        
class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = ['status', 'info', 'image']

class TeacherUserSerializer(serializers.ModelSerializer):
    status = serializers.CharField(source='teacherprofile.status')
    info = serializers.CharField(source='teacherprofile.info')
    image = serializers.ImageField(source='teacherprofile.image')

    class Meta:
        model = CustomUser
        fields = ['status','info','image','name','username','email',]

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['status', 'info', 'image']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message']

class UpdateHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UpdateHistory
        fields = '__all__'
