// Chat.js

import React, { useState, useEffect } from 'react';
import WebSocketInstance from './WebSocketInstance';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [typingMessage, setTypingMessage] = useState('');

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      setChatLog([...chatLog, newMessage]);
    };

    const handleTypingMessage = (typingMessage) => {
      setTypingMessage(typingMessage);
    };

    WebSocketInstance.connect(handleNewMessage, handleTypingMessage);

    return () => {
      WebSocketInstance.disconnect();
    };
  }, [chatLog]);

  const sendMessage = () => {
    WebSocketInstance.send(message);
    setMessage('');
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    WebSocketInstance.sendTypingMessage(e.target.value);
  };

  return (
    <div className='App'>
      <div className='jumbotron'>
        {chatLog.map((msg, index) => (
          <div className='box' key={index}>{msg.message}</div>
        ))}
      </div>
      <div>
        <div>Typing: {typingMessage}</div>
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
