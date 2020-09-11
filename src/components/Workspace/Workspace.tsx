import React, { useState, useEffect } from 'react';
import './Workspace.css';
import { Route, useLocation } from 'react-router-dom'
import Chat from '../Chat/Chat';
import MessageHandler from '../MessageHandler/MessageHandler';
import { CurrentUserContext, currentUser } from '../../contexts/CurrentUserContext';
import api from '../../utils/api';
import { IAuthor, IMessageItem, IInitialChat } from '../../utils/interfaces'

const Workspace: React.FC = () => {
  let { pathname } = useLocation();

  const [workChat, setWorkChat] = useState([])
  const [floodChat, setFloodChat] = useState([])
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
  const onEditMessage = (messageId: string, chat: IMessageItem[]) => {
    const message = chat.filter((message => message.messageId === messageId))[0].message;
    setMessageToEdit({ ...messageToEdit, message: message, messageId: messageId });
  }

  const updateMessage = (text: string, chat: IMessageItem[]) => {
    const messageToUpdate = chat.filter(messageItem => messageItem.messageId === messageToEdit.messageId)[0];
    return {
      ...messageToUpdate, message: text
    }
  }

  const updateChat = (text: string, chat: IMessageItem[]) => {
    return chat.map((messageItem) => {
      if (messageItem.messageId === messageToEdit.messageId) {
        return {
          ...messageItem, message: text
        }
      }
      return messageItem
    });
  }

  // посмотреть откуда ниже в чате нулл
  const editMessageHandler = (text: string, chat: IMessageItem[], chatKeyword: string, setChatFunction: any) => {
    const newMessage = updateMessage(text, chat)
    api.changeMessage(newMessage, chatKeyword)
      .then(() => {
        const newChat = updateChat(text, chat)
        setChatFunction(newChat);
      })
      .catch(err => console.error(err))
  }

  const onEditMessageSubmit = (text: string) => {
    if (pathname === '/floodchat') {
      editMessageHandler(text, floodChat, 'flood', setFloodChat)
    } else {
      editMessageHandler(text, workChat, 'work', setWorkChat)
    }
    setMessageToEdit({ ...messageToEdit, message: '', messageId: '' });
  }

  // Управление лайками
  const handleLike = (messageId: string, chat: IMessageItem[]) => {
    const message = chat.filter(message => message.messageId === messageId)[0];
    if (!message.likes) {
      message.likes = []
    }
    const isLiked = message.likes.some((item: IAuthor) => item.id === currentUser.id);
    if (!isLiked) {
      message.likes.push(currentUser);
    } else {
      for (let i = 0; i < message.likes.length; i++) {
        message.likes[i].id === currentUser.id && message.likes.splice(i, 1)
      }
    }
    return message
  }

  const createNewChat = (message: IMessageItem, chat: IMessageItem[]) => {
    return chat.map(messageItem => {
      if (messageItem.messageId === message.messageId) {
        return message;
      }
      return messageItem;
    })
  }

  const handleLikeClick = (messageId: string, chat: IMessageItem[], chatKeyword: string, setChatFunction: any) => {
    const newMessage = handleLike(messageId, chat);
    api.changeMessage(newMessage, chatKeyword)
      .then(() => {
        const newChat = createNewChat(newMessage, chat);
        setChatFunction(newChat);
      })
      .catch(err => console.error(err))
  }

  // Удаление сообщений
  const deleteMessage = (messageId: string, chat: IMessageItem[]) => {
    const newChat = chat.slice();
    for (let i = 0; i < newChat.length; i++) {
      if (newChat[i].messageId === messageId) {
        newChat.splice(i, 1);
      }
    }
    return newChat
  }

  const handleDeleteMessage = (messageId: string, chatKeyword: string, chat: IMessageItem[], setChatFunction: any) => {
    api.deleteMessage(messageId, chatKeyword)
      .then(() => {
        const newChat = deleteMessage(messageId, chat);
        setChatFunction(newChat);
      })
      .catch(err => console.error(err))
  }

  // Создание сообщений
  const createMessage = (text: string, messageId: string) => {
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

  const handleAddMessage = (text: string, messageId: string, chatKeyword: string, chat: IMessageItem[], setChatFunction: any) => {
    const message = createMessage(text, messageId);
    api.addMessage(message, chatKeyword)
      .then(() => {
        setChatFunction([...chat, message])
      })
      .catch(err => console.error(err))
  }

  const onAddMessage = (text: string) => {
    const messageId = generateId();
    if (pathname === '/floodchat') {
      handleAddMessage(text, messageId, 'flood', floodChat, setFloodChat);
    } else {
      handleAddMessage(text, messageId, 'work', workChat, setWorkChat)
    }
    setScrollDown(!scrollDown);
  }

  const createInitialChat = (info: IInitialChat, setChatFunction: any) => {
    const chat = Object.values(info);
    chat.sort((a, b) => {
      return (+a.ts) - (+b.ts)
    });
    setChatFunction(chat)
  }

  useEffect(() => {
    const getInitialChat = (chatKeyword: string, setChatFunction: any) => {
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
            isLoading={isLoading}
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