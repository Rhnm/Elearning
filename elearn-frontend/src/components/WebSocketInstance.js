// WebSocketInstance.js

class WebSocketInstance {
  constructor() {
    this.socket = null;
    this.callbacks = {
      message: [],
      typing: [],
    };
  }

  connect(messageCallback, typingCallback) {
    this.socket = new WebSocket('ws://3.108.151.50/ws/chat/');

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        this.callbacks.message.forEach((callback) => callback(data));
      } else if (data.type === 'typing') {
        this.callbacks.typing.forEach((callback) => callback(data));
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket closed');
      this.socket = null;
    };

    if (messageCallback) {
      this.callbacks.message.push(messageCallback);
    }

    if (typingCallback) {
      this.callbacks.typing.push(typingCallback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  send(message) {
    if (this.socket) {
      this.socket.send(JSON.stringify({ type: 'message', message }));
    }
  }

  sendTypingMessage(typingMessage) {
    if (this.socket) {
      this.socket.send(JSON.stringify({ type: 'typing', message: typingMessage }));
    }
  }
}

const instance = new WebSocketInstance();
export default instance;
