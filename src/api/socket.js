import {getToken} from '../utils/token';
import { mapActions, mapMutations } from 'vuex';
import io from 'socket.io-client';
let socket;

function connect() {
  socket = io('http://event-manager.burningbuttons.com/');
  socket.on('connect', () => {
    console.log(socket.connected);
    console.log(socket.id);
    const token = `Bearer ${getToken()}`;
    socket.emit('authentication', { token });
  });
  socket.on('message', (data) => {
    console.log(data);
  });
}

function joinChat(chatId) {
  socket.emit('join_chat', chatId);
}

function sendMessage(data = {message, chatId}) {
  socket.emit('message', data);
}

export {connect, joinChat, sendMessage}