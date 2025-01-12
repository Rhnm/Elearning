from django.db import models

# Create your models here.

from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    # Add other fields as needed

    def __str__(self):
        return self.title


class Content(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content_type = models.CharField(choices=[('pdf', 'PDF'), ('jpeg', 'JPEG'), ('mp4', 'MP4'), ('mp3', 'MP3')], max_length=10)
    file = models.FileField(upload_to='content/')
    # Add other fields as needed

    def __str__(self):
        return self.title
