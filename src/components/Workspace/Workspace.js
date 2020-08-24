import React, { useState, useEffect } from 'react';
import './Workspace.css';
import { Route, useLocation } from 'react-router-dom'
import Chat from '../Chat/Chat';
import MessageHandler from '../MessageHandler/MessageHandler';
import { CurrentUserContext, currentUser } from '../../contexts/CurrentUserContext';
import { initialWorkChat, initialFloodChat } from '../../utils/chats'
import api from '../../utils/api'

let workMessageId = 132; // эмуляция создания уникальных id
let floodMessageId = 232;

function Workspace() {
  let { pathname } = useLocation();

  const [workMessageId, setWorkMessageId] = useState(135);

  const [workChat, setWorkChat] = useState(null)

  const [floodChat, setFloodChat] = useState(null)

  const [messageToEdit, setMessageToEdit] = useState({
    messageId: '',
    message: ''
  })

  const [scrollDown, setScrollDown] = useState(false);

  // редактирование сообщений
  const onEditWorkChat = (messageId) => {
    onEditMessage(messageId, workChat)
  }

  const onEditFloodChat = (messageId) => {
    onEditMessage(messageId, floodChat)
  }

  const onEditMessage = (messageId, chat) => {
    const message = chat.filter((message => message.messageId === messageId))[0].message;
    setMessageToEdit({ ...messageToEdit, message: message, messageId: messageId });
  }

  const createUpdatedMessage = (text, chat) => {
    return chat.map((messageItem) => {
      if (messageItem.messageId === messageToEdit.messageId) {
        return {
          ...messageItem, message: text
        }
      }
      return messageItem
    });
  }

  const onEditMessageSubmit = (text) => {
    if (pathname === '/floodchat') {
      const newFloodChat = createUpdatedMessage(text, floodChat)
      setFloodChat(newFloodChat);
    } else {
      const newWorkChat = createUpdatedMessage(text, workChat)
      setWorkChat(newWorkChat);
    }
    setMessageToEdit({ messageToEdit, message: '', messageId: '' });
  }

  // управление лайками
  const handleLike = (messageId, likes, chat) => {
    const isLiked = likes.some(item => item.id === currentUser.id);
    let newChat = null;
    if (!isLiked) {
      newChat = chat.map(messageItem => {
        if (messageItem.messageId === messageId) {
          const newLikes = [...messageItem.likes];
          newLikes.push(currentUser);
          return { ...messageItem, likes: newLikes }
        } return messageItem;
      })
    } else {
      newChat = chat.map(messageItem => {
        if (messageItem.messageId === messageId) {
          const newLikes = [...messageItem.likes];
          for (let i = 0; i < newLikes.length; i++) {
            newLikes[i].id === currentUser.id && newLikes.splice(i, 1)
          }
          return { ...messageItem, likes: newLikes }
        } return messageItem;
      })
    }
    return newChat
  }

  const handleWorkLikeClick = (messageId, likes) => {
    const newChat = handleLike(messageId, likes, workChat)
    // localStorage.setItem('messages', JSON.stringify(messages))
    // JSON.parse(localStorage.getItem('messages'));
    setWorkChat(newChat);
  }

  const handleFloodLikeClick = (messageId, likes) => {
    const newChat = handleLike(messageId, likes, floodChat)
    setFloodChat(newChat);
  }

  // удаление сообщений
  const deleteMessage = (messageId, chat) => {
    const newChat = chat.slice();
    for (let i = 0; i < newChat.length; i++) {
      if (newChat[i].messageId === messageId) {
        newChat.splice(i, 1);
      }
    }
    return newChat
  }

  const onDeleteWorkMessage = (messageId) => {
    const newWorkChat = deleteMessage(messageId, workChat);
    setWorkChat(newWorkChat);
  }

  const onDeleteFloodMessage = (messageId) => {
    const newFloodChat = deleteMessage(messageId, floodChat);
    setFloodChat(newFloodChat);
  }

  // создание сообщений
  const createMessage = (text, messageId) => {
    return {
      messageId: messageId,
      author: currentUser,
      likes: [],
      message: text,
    }
  }

  const onAddMessage = (text) => {
    if (pathname === '/floodchat') {
      floodMessageId += 1;
      const message = createMessage(text, floodMessageId)
      // setFloodChat([...floodChat, message])
    } else {
      // workMessageId += 1;
      setWorkMessageId(workMessageId + 1);
      const message = createMessage(text, workMessageId);
      console.log(message);
      api.addWorkMessage(message)
      .then((newChat) => {

      console.log(Object.values(newChat))
      console.log(newChat);
      })
      .catch(err => console.error(err))
      setWorkChat([...workChat, message])
    }
    setScrollDown(!scrollDown);
  }

  useEffect(() => {
    api
      .getWorkChat()
      .then(info => {
        const chat = Object.values(info);
        setWorkChat(chat)
      })
      .catch(err => console.error(err));

    api
      .getFloodChat()
      .then(info => setFloodChat(info))
      .catch(err => console.error(err));
  }, [])

  return (
    <div className="workspace">
      <Route path="/" exact>
        <CurrentUserContext.Provider value={currentUser}>
          <Chat
            messages={workChat}
            title={'Рабочий чат'}
            onEditClick={onEditWorkChat}
            onDeleteClick={onDeleteWorkMessage}
            onLikeClick={handleWorkLikeClick}
            scrollDown={scrollDown}
          />
        </CurrentUserContext.Provider>
      </Route>
      <Route path="/floodchat">
        <CurrentUserContext.Provider value={currentUser}>
          <Chat
            messages={floodChat}
            title={'Флудилка'}
            onEditClick={onEditFloodChat}
            onDeleteClick={onDeleteFloodMessage}
            onLikeClick={handleFloodLikeClick}
            scrollDown={scrollDown}
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