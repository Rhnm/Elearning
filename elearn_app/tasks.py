from celery import shared_task

@shared_task
def process_file(file_data, sender, room):
    # Your file processing logic goes here
    # Example: Save the file, extract information, etc.
    print(f"Received file from {sender} in room {room}")