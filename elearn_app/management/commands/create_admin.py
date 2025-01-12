from django.core.management.base import BaseCommand
from elearn_app.models import CustomUser, Admin

class Command(BaseCommand):
    help = 'Create admin data for testing purposes'

    def handle(self, *args, **options):
        # Check if there are no admins in the database
        if not Admin.objects.exists():
            # Create an admin user
            admin_user = CustomUser.objects.create_user(
                email='admin@example.com',
                username='admin',
                password='adminpassword',
                role=CustomUser.ADMIN,
            )
            Admin.objects.create(user=admin_user)
            self.stdout.write(self.style.SUCCESS('Admin user created successfully'))
        else:
            self.stdout.write(self.style.SUCCESS('Admin data already exists'))