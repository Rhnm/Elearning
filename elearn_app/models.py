from datetime import timezone
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser,AbstractBaseUser,BaseUserManager
from rest_framework.authtoken.models import Token
from django.core.validators import MinLengthValidator



# Create your models here.

from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, username, password, **extra_fields)
    
class CustomUser(AbstractBaseUser):
    ADMIN = 0
    TEACHER = 1
    STUDENT = 2
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (TEACHER, 'Teacher'),
        (STUDENT, 'Student'),
    ]
    last_login = models.DateTimeField(null=True,blank=True)
    name = models.CharField(max_length=50, default='')
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255) 
    role = models.IntegerField(choices=ROLE_CHOICES, default=STUDENT)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email','password']

    @property
    def is_staff(self):
        return self.role == self.ADMIN

    @property
    def is_superuser(self):
        return self.role == self.ADMIN
    
    def update_last_login(self):
        self.last_login = timezone.now()
        self.save()


class Admin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    # Add any additional admin-specific fields here
    def update_last_login(self):
        self.last_login = timezone.now()
        self.save()
        
    def __str__(self):
        return self.user.username
    
class TeacherProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,null=True, blank=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    info = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='teacher_profiles/', blank=True, null=True)

    def update_last_login(self):
        self.last_login = timezone.now()
        self.save()
    def __str__(self):
        return self.user.username
    
class StudentProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,null=True, blank=True)
    # Add additional fields for student profile (status, info, image, etc.)
    status = models.CharField(max_length=255, blank=True, null=True)
    info = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='student_profiles/', blank=True, null=True)

    def __str__(self):
        return self.user.username

class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)






class Course(models.Model):
    course_name = models.CharField(max_length=100, default = '')
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='courses/', default='path/to/default/image.jpg')
    description = models.TextField()
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default='10')

    def __str__(self):
        return self.course_name
    

    
class Topic(models.Model):
    TOPIC_TYPES = [
        ('Reading', 'Reading'),
        ('Test', 'Test'),
        ('Video', 'Video'),
        ('Audio', 'Audio'),
    ]

    topic_type = models.CharField(max_length=20, choices=TOPIC_TYPES)
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=100)
    text_content = models.TextField()
    file = models.FileField(upload_to='topics/', blank=True, null=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    
class Test(models.Model):
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    topic = models.ForeignKey('Topic', on_delete=models.CASCADE)
    question = models.TextField()
    option_a = models.CharField(max_length=255, validators=[MinLengthValidator(1)])
    option_b = models.CharField(max_length=255, validators=[MinLengthValidator(1)])
    option_c = models.CharField(max_length=255, validators=[MinLengthValidator(1)])
    option_d = models.CharField(max_length=255, validators=[MinLengthValidator(1)])
    answer = models.CharField(max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')])

    def __str__(self):
        return f"{self.course} - {self.topic} - {self.question[:20]}"
    
class Teacher(models.Model):
    name = models.CharField(max_length=255)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.username

class Enrollment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)

class CustomToken(models.Model):
    key = models.CharField(max_length=40, primary_key=True)
    user = models.OneToOneField(CustomUser, related_name='custom_token', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

class Content(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content_type = models.CharField(choices=[('pdf', 'PDF'), ('jpeg', 'JPEG'), ('mp4', 'MP4'), ('mp3', 'MP3')], max_length=10)
    file = models.FileField(upload_to='content/')
    # Add other fields as needed

    def __str__(self):
        return self.title


# class User(models.Model):
#     name = models.CharField(max_length=50, default='')
#     username = models.CharField(max_length=50, unique=True)
#     email = models.EmailField(unique=True)
#     password = models.CharField(max_length=255) 

#     def __str__(self):
#         return self.name
    
class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()

    def __str__(self):
        return self.name


class UpdateHistory(models.Model):
    ROLE_CHOICES = [(1, 'User'), (2, 'Student')]

    user = models.ForeignKey(CustomUser, related_name='update_history', on_delete=models.CASCADE)
    role = models.IntegerField(choices=ROLE_CHOICES)
    type = models.CharField(max_length=20)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20,default='active')

    def __str__(self):
        return f"{self.get_role_display()} - {self.type}"

