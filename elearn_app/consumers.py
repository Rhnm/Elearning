import json
from channels.generic.websocket import AsyncWebsocketConsumer

from .tasks import *

class ChatConsumer(AsyncWebsocketConsumer):
    connected_users = set()
    room_name = None 

    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add(
            'chat_group',
            self.channel_name
        )

    async def disconnect(self, close_code):
        # Get the sender from the connected users set and remove it
        sender = self.get_sender_from_channel_name(self.channel_name)
        if sender:
            self.connected_users.discard(sender)
            await self.send_connected_users()

        await self.channel_layer.group_discard(
            'chat_group',
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender = text_data_json.get('sender', 'default_sender')  # Get sender or use a default value
        room = text_data_json.get('room', 'default_room')

        """ if 'file_data' in text_data_json:
            # If the message contains file_data, handle file upload
            file_data = text_data_json['file_data']
            process_file.delay(file_data, sender, room)
        else:
            # Handle regular text messages
            await self.send_group(message, sender, room) """

        if not self.room_name:
            # If room_name is not set, set it to the received room
            self.room_name = room
        
        self.connected_users.add(sender)
        await self.send_connected_users()
        #message = json.loads(text_data)
        print(f"Received message from {sender}: {message}")
        print(f"Room Name: {room}")

        # Send the message to the group
        # await self.send(text_data=json.dumps({
        #     'message': message
        # }))
        #await self.send(text_data=json.dumps({"message": message}))
         # Broadcast the message to all clients in the same WebSocket group
        await self.send_group(message, sender,room)  

    async def send_group(self, message, sender,room):
        # Send message to WebSocket group
        await self.channel_layer.group_add(
            #'chat_group',  # Group name
            f'chat_group_{room}',
            self.channel_name
        )

        await self.channel_layer.group_send(
            #'chat_group',
            f'chat_group_{room}',
            {
                'type': 'chat.message',
                'message': message,
                'sender': sender,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender = event.get('sender', 'default_sender')  # Get sender or use a default value

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
        }))

    async def send_connected_users(self):
        connected_users_list = list(self.connected_users)
        await self.send(text_data=json.dumps({
            'connected_users': connected_users_list,
        }))

    @staticmethod
    def get_sender_from_channel_name(channel_name):
        # Extract the sender from the channel name (customize as needed)
        # Assuming channel names are in the format 'chat_<sender>'
        parts = channel_name.split('_')
        if len(parts) == 2 and parts[0] == 'chat':
            return parts[1]
        return None
    