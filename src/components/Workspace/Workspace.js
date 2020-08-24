import React, { useState, useEffect } from 'react';
import './Workspace.css';
import { Route, useLocation } from 'react-router-dom'
import Chat from '../Chat/Chat';
import MessageHandler from '../MessageHandler/MessageHandler';
import { CurrentUserContext, currentUser } from '../../contexts/CurrentUserContext';
import api from '../../utils/api';

function Workspace() {
  let { pathname } = useLocation();

  const [workChat, setWorkChat] = useState(null)
  const [floodChat, setFloodChat] = useState(null)
  const [messageToEdit, setMessageToEdit] = useState({
    messageId: '',
    message: ''
  })
  const [scrollDown, setScrollDown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  // Редактирование сообщений
  const onEditMessage = (messageId, chat) => {
    const message = chat.filter((message => message.messageId === messageId))[0].message;
    setMessageToEdit({ ...messageToEdit, message: message, messageId: messageId });
  }

  const updateMessage = (text, chat) => {
    const messageToUpdate = chat.filter(messageItem => messageItem.messageId === messageToEdit.messageId)[0];
    return {
      ...messageToUpdate, message: text
    }
  }

  const updateChat = (text, chat) => {
    return chat.map((messageItem) => {
      if (messageItem.messageId === messageToEdit.messageId) {
        return {
          ...messageItem, message: text
        }
      }
      return messageItem
    });
  }

  const editMessageHandler = (text, chat, chatKeyword, setChatFunction) => {
    const newMessage = updateMessage(text, chat)
    api.changeMessage(newMessage, chatKeyword)
      .then(() => {
        const newChat = updateChat(text, chat)
        setChatFunction(newChat);
      })
      .catch(err => console.error(err))
  }

  const onEditMessageSubmit = (text) => {
    if (pathname === '/floodchat') {
      editMessageHandler(text, floodChat, 'flood', setFloodChat)
    } else {
      editMessageHandler(text, workChat, 'work', setWorkChat)
    }
    setMessageToEdit({ messageToEdit, message: '', messageId: '' });
  }

  // Управление лайками
  const handleLike = (messageId, chat) => {
    const message = chat.filter(message => message.messageId === messageId)[0];
    if (!message.likes) {
      message.likes = []
    }
    const isLiked = message.likes.some(item => item.id === currentUser.id);
    if (!isLiked) {
      message.likes.push(currentUser);
    } else {
      for (let i = 0; i < message.likes.length; i++) {
        message.likes[i].id === currentUser.id && message.likes.splice(i, 1)
      }
    }
    return message
  }

  const createNewChat = (message, chat) => {
    return chat.map(messageItem => {
      if (messageItem.messageId === message.messageId) {
        return message;
      }
      return messageItem;
    })
  }

  const handleLikeClick = (messageId, chat, chatKeyword, setChatFunction) => {
    const newMessage = handleLike(messageId, chat);
    api.changeMessage(newMessage, chatKeyword)
      .then(() => {
        const newChat = createNewChat(newMessage, chat);
        setChatFunction(newChat);
      })
      .catch(err => console.error(err))
  }

  // Удаление сообщений
  const deleteMessage = (messageId, chat) => {
    const newChat = chat.slice();
    for (let i = 0; i < newChat.length; i++) {
      if (newChat[i].messageId === messageId) {
        newChat.splice(i, 1);
      }
    }
    return newChat
  }

  const handleDeleteMessage = (messageId, chatKeyword, chat, setChatFunction) => {
    api.deleteMessage(messageId, chatKeyword)
      .then(() => {
        const newChat = deleteMessage(messageId, chat);
        setChatFunction(newChat);
      })
      .catch(err => console.error(err))
  }

  // Создание сообщений
  const createMessage = (text, messageId) => {
    const date = new Date();
    const timeStamp = date.getTime() / 1000;
    return {
      messageId: messageId,
      author: currentUser,
      likes: [],
      message: text,
      ts: timeStamp
    }
  }

  const handleAddMessage = (text, messageId, chatKeyword, chat, setChatFunction) => {
    const message = createMessage(text, messageId);
    api.addMessage(message, chatKeyword)
      .then(() => {
        setChatFunction([...chat, message])
      })
      .catch(err => console.error(err))
  }

  const onAddMessage = (text) => {
    const messageId = generateId();
    if (pathname === '/floodchat') {
      handleAddMessage(text, messageId, 'flood', floodChat, setFloodChat);
    } else {
      handleAddMessage(text, messageId, 'work', workChat, setWorkChat)
    }
    setScrollDown(!scrollDown);
  }

  const createInitialChat = (info, setChatFunction) => {
    const chat = Object.values(info);
    chat.sort((a, b) => {
      return (+a.ts) - (+b.ts)
    });
    setChatFunction(chat)
  }

  useEffect(() => {
    const getInitialChat = (chatKeyword, setChatFunction) => {
      api
        .getChat(chatKeyword)
        .then(info => {
          setIsLoading(false);
          createInitialChat(info, setChatFunction);
          setTimeout(() => setScrollDown(!scrollDown), 0)
        })
        .catch(err => console.error(err));
    }
    getInitialChat('work', setWorkChat);
    getInitialChat('flood', setFloodChat);
  }, [])

  return (
    <div className="workspace">
      <Route path="/" exact>
        <CurrentUserContext.Provider value={currentUser}>
          <Chat
            messages={workChat}
            title={'Рабочий чат'}
            onEditClick={(messageId) => onEditMessage(messageId, workChat)}
            onDeleteClick={(messageId) => handleDeleteMessage(messageId, 'work', workChat, setWorkChat)}
            onLikeClick={(messageId) => handleLikeClick(messageId, workChat, 'work', setWorkChat)}
            scrollDown={scrollDown}
            isLoading={isLoading}
          />
        </CurrentUserContext.Provider>
      </Route>
      <Route path="/floodchat">
        <CurrentUserContext.Provider value={currentUser}>
          <Chat
            messages={floodChat}
            title={'Флудилка'}
            onEditClick={(messageId) => onEditMessage(messageId, floodChat)}
            onDeleteClick={(messageId) => handleDeleteMessage(messageId, 'flood', floodChat, setFloodChat)}
            onLikeClick={(messageId) => handleLikeClick(messageId, floodChat, 'flood', setFloodChat)}
            scrollDown={scrollDown}
            chat={isLoading}
          />
        </CurrentUserContext.Provider>
      </Route>
      <MessageHandler
        onAddMessage={onAddMessage}
        messageToEdit={messageToEdit.message}
        onEditMessage={message => onEditMessageSubmit(message)} />
    </div>
  );
}

export default Workspace;