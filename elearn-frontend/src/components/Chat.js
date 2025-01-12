import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import { useAuth } from './AuthContext'; // Import useAuth

const Chat = ({ roomId, isChatVisible, toggleChatVisibility  }) => {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [clientActivity, setClientActivity] = useState({}); // Track client activity
  const [roomName, setRoomName] = useState(''); // Add state for room name
  const [userData, setUserData] = useState(null);
  //const [isChatVisible, setIsChatVisible] = useState(true);
  const { isLoggedIn, userRole, userId, authToken,username } = useAuth();
  /* const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  }; */

  useEffect(() => {

    // Set a default room name (you can set it based on user input or any other logic)
    
    const defaultRoomName = roomId ? roomId.replace(/\s+/g, '-') : 'default_room';
    setRoomName(defaultRoomName);
    
    // Generate a unique identifier for the client
    const clientId = generateClientId();
    
    setClientId(clientId);



    // Establish WebSocket connection
    const socket = new WebSocket('ws://3.108.151.50:8000/ws/chat/');

    socket.onopen = () => {
      console.log('WebSocket connected');
      setWs(socket);
    };

    socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    if (data.connected_users) {
        setConnectedUsers(data.connected_users);
    }
    setChatMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    // Periodically check for connected users
    // const intervalId = setInterval(() => {
    //     if (ws && ws.readyState === WebSocket.OPEN) {
    //       ws.send(JSON.stringify({ check_connected_users: true }));
    //     }
    //   }, 5000); // Adjust the interval as needed
  
    //setWs(socket);

    return () => {
      socket.close();
    };
  }, [roomId,clientId]);

  const sendMessage = async () => {
    if (ws) {
      if (message.trim() !== '') {
        ws.send(JSON.stringify({ message, sender: clientId, room: roomName }));
        setMessage('');
      }
      if (fileInputRef.current && fileInputRef.current.files.length > 0) {
        const file = fileInputRef.current.files[0];
  
        const formData = new FormData();
        formData.append('file', file);
  
        try {
          // Use Axios to send the file to the Django backend
          const response = await axios.post(`http://3.108.151.50/api/upload/${roomName}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (response.data && response.data.file_url) {
          const clickableLink = `<a href="http://3.108.151.50${response.data.file_url}" target="_blank">Download Here</a>`;
          // Send a message indicating the file upload
          ws.send(JSON.stringify({ message: `File uploaded: ${clickableLink}`, sender: clientId, room: roomName }));
          }else {
            console.error('Unexpected response structure:', response);
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
  };

  const generateClientId = () => {
    return username;
  };

  return (
    
   
    <div className={`chat-panel ${isChatVisible ? 'chat-visible' : 'chat-hidden'}`} style={{ position: 'fixed', bottom: 0, right: 0,maxWidth: "450px" }}>

    <div className="container">
        <div className="row">
        <div className="col">
                <div className="d-flex justify-content-end">
            

                <div className="card" id="chat1" style={{ borderRadius: "15px" }}>
                    <div
                        className="card-header d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0"
                        style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}>
                        <i className="fas fa-angle-left"></i>
                        <p className="mb-0 fw-bold">{roomId}</p>
                        <i className="fas fa-times"></i>
                    </div>
                    <div className="card-body">
                        <div className="d-flex flex-row justify-content-start mb-4">
                            <div className='chat-messages'>
                                {chatMessages.map((msg, index) => (
                                    <div key={index} className={`message ${msg.sender === clientId ? 'sent' : 'received'}`}>
                                        <span>{msg.sender}</span>
                                        <div dangerouslySetInnerHTML={{ __html: msg.message }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="form-outline">
                            <div className='message-input'>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <div className='mb-4'></div>
                                <input type="file" ref={fileInputRef} />
                                <button onClick={sendMessage}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                
                
            </div>
        </div>
    </div>

</div>
      
    
    
  );
};

export default Chat;
