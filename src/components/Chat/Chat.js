import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import Message from '../Message/Message';
import Preloader from '../Preloader/Preloader'
import './Chat.css';

function Chat({ messages, title, onEditClick, onDeleteClick, onLikeClick, scrollDown, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
  }

  function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    console.log('вызвался скролл')
    scrollToBottom()
  }, [scrollDown]);

  return (
    <div className="chat">
      <h2 className="chat__title">{title}</h2>
      <div className="chat__content">

        {isLoading ?
          <div className="chat__preloader">
            <Preloader />
          </div>
          :
          messages && messages.map((message) => {
            return (
              <Message
                key={message.messageId || generateId()}
                messageId={message.messageId}
                authorName={message.author && message.author.name || 'Неавторизованный пользователь, который пока еще может так делать :)'}
                authorId={message.author && message.author.id || 256}
                avatar={message.author && message.author.avatar || 'https://cdns.iconmonstr.com/wp-content/assets/preview/2012/240/iconmonstr-user-1.png'}
                text={message.message || 'Сообщение скрыто'}
                likes={message.likes || 0}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                onLikeClick={onLikeClick}
              />
            )
          })}
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}

Chat.propTypes = {
  messages: PropTypes.array,
  title: PropTypes.string,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onLikeClick: PropTypes.func,
  scrollDown: PropTypes.bool
}

export default Chat;