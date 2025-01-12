from django.test import TestCase

from rest_framework.test import APIClient
from django.urls import reverse
from .models import CustomUser, Course, Topic, Enrollment, UpdateHistory, TeacherProfile, StudentProfile, Test, ContactMessage
from django.contrib.auth.models import User


# Create your tests here.
class EndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='testuser', email='teststudent@someone.com', password='testpassword', role=CustomUser.STUDENT)
        self.teacher = CustomUser.objects.create_user(username='testteacher', email='testteacher@someone.com', password='testpassword', role=CustomUser.TEACHER)
        TeacherProfile.objects.create(user=self.teacher)
        self.client.force_authenticate(user=self.user)
        self.course = Course.objects.create(title='Test Course', user=self.teacher)
        self.topic = Topic.objects.create(course=self.course, title='Test Topic')
        Enrollment.objects.create(user=self.user, course=self.course)
        self.test = Test.objects.create(course=self.course, topic=self.topic, question='Test Question', option_a='A', option_b='B', option_c='C', option_d='D', answer='A')


    def test_course_list(self):
        url = reverse('course-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)


    def test_course_detail(self):
        url = reverse('course-detail', args=[self.course.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'Test Course')

    def test_register(self):
        url = reverse('register')
        data = {
            'username': 'newuser',
            'password': 'newpassword',
            'email': 'newuser@example.com',
            'role': CustomUser.STUDENT
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['message'], 'Registration successful!')

    def test_login(self):
        url = reverse('login')
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['isLogin'])


    def test_add_topics(self):
        url = reverse('add_topics')
        data = {
            'title': 'New Topic',
            'course': self.course.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Topic.objects.count(), 2)

    def test_add_tests(self):
        url = reverse('add_tests')
        data = {
            'course': self.course.id,
            'topic': self.topic.id,
            'question': 'New Question',
            'option_a': 'A',
            'option_b': 'B',
            'option_c': 'C',
            'option_d': 'D',
            'answer': 'A'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Test.objects.count(), 2)

    def test_contact_message(self):
        url = reverse('contact-message')
        data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'message': 'Test Message'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactMessage.objects.count(), 1)

    
    
    def test_course_list(self):
        url = reverse('course-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_course_detail(self):
        url = reverse('course-detail', args=[self.course.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'Test Course')

    def test_register(self):
        url = reverse('register')
        data = {
            'username': 'newuser',
            'password': 'newpassword',
            'email': 'newuser@example.com',
            'role': CustomUser.STUDENT
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['message'], 'Registration successful!')

    def test_login(self):
        url = reverse('login')
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['isLogin'])

    def test_enroll_course(self):
        # Create a new user for testing
        test_user = CustomUser.objects.create_user(username='testuser2', password='testpassword',email='unique_student@someone.com', role=CustomUser.STUDENT)

        # Create a new course for testing
        test_course = Course.objects.create(title='Test Course', user=self.teacher)

        url = reverse('enroll_course')
        data = {
            'user': test_user.id,
            'course': test_course.id
        }
        
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Enrollment.objects.count(), 2)  



    def test_add_courses(self):
        url = reverse('add_courses')
        data = {
            'title': 'New Course',
            'description': 'Course description',
            'user': self.teacher.id
        }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Course.objects.count(), 2)

    def test_add_topics(self):
        url = reverse('add_topics')
        data = {
            'title': 'New Topic',
            'course': self.course.id,
            'topic_type': 'Reading',  
            'subtitle': 'Topic Subtitle',  
            'text_content': 'Topic Content'  
        }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Topic.objects.count(), 2)

    def test_add_tests(self):
        url = reverse('add_tests')
        data = {
            'questions': [
                {
                    'course': self.course.id,
                    'topic': self.topic.id,
                    'question': 'New Question',
                    'option_a': 'A',
                    'option_b': 'B',
                    'option_c': 'C',
                    'option_d': 'D',
                    'answer': 'A'
                }
            ]
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Test.objects.count(), 2)

    def test_contact_message(self):
        url = reverse('contact-message')
        data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'message': 'Test Message'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactMessage.objects.count(), 1)

class YourTestCase(TestCase):
    def setUp(self):
        
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='student@somebody.com',
            password='testpassword',
            role=2
        )

    def test_student_profile(self):
        # Log in the user
        self.client.force_login(self.user)

        # Make the request to the 'student-profile' endpoint
        url = reverse('student-profile')
        response = self.client.get(url)

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user'], self.user.id)

class YourTestCase(TestCase):
    def setUp(self):
        # Create a user with role 1 (assuming role 1 corresponds to the teacher role)
        self.teacher = CustomUser.objects.create_user(
            username='testteacher',
            email='teacher@somebody.com',
            password='testpassword',
            role=1
        )

    def test_teacher_profile(self):
        # Log in the teacher user
        self.client.force_login(self.teacher)

        # Make the request to the 'teacher-profile' endpoint
        url = reverse('teacher-profile')
        response = self.client.get(url)
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user'], self.teacher.id)

class YourTestCase(TestCase):
    def setUp(self):
        # Create a teacher user (role = 1 corresponds to the teacher role)
        self.teacher = CustomUser.objects.create_user(
            username='testteacher',
            email='unique_teacher@someone.com',
            password='testpassword',
            role=1
        )

        # Create a course
        self.course = Course.objects.create(
            title='Test Course',
            user=self.teacher
        )

        # Create a topic for the course
        self.topic = Topic.objects.create(
            topic_type='Reading',
            title='Test Topic',
            course=self.course
        )

        # Create an UpdateHistory object for the topic
        self.update_history = UpdateHistory.objects.create(
            user=self.teacher,
            role=1,
            type='topicUpdated',
            course=self.course,
            topic=self.topic
        )

        # Create an API client and log in the teacher user
        self.client = APIClient()
        self.client.force_login(self.teacher)

    def test_update_topic(self):
        url = reverse('update_topic')
        data = {
            'topic_type': 'Reading',
            'title': 'Updated Topic',
            'subtitle': 'SomeSubtitle',
            'text_content': 'SomeTextContent',
            'course': self.course.id  
        }

        # Passing IDs in the query parameters
        url += f'?course_id={self.course.id}&topic_id={self.topic.id}&user_id={self.teacher.id}'

        response = self.client.put(url, data)
        print("test update topic: ", response.data)

        self.assertEqual(response.status_code, 201)
        self.topic.refresh_from_db()
        self.assertEqual(self.topic.title, 'Updated Topic')
