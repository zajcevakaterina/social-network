import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import Message from '../Message/Message';
import Preloader from '../Preloader/Preloader'
import './Chat.css';

function Chat({ messages, title, onEditClick, onDeleteClick, onLikeClick, scrollDown, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(scrollToBottom, [scrollDown]);

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

            if (message.author) {
              return (
                <Message
                  key={message.messageId}
                  messageId={message.messageId}
                  author={message.author}
                  avatar={message.author.avatar}
                  text={message.message}
                  likes={message.likes || 0}
                  onEditClick={onEditClick}
                  onDeleteClick={onDeleteClick}
                  onLikeClick={onLikeClick}
                />
              )
            } else {
              return <Message 
              author={{
                avatar: 'https://cdns.iconmonstr.com/wp-content/assets/preview/2012/240/iconmonstr-user-1.png',
                id: 250,
                name: 'Неизвестный автор'
              }}
              avatar='https://cdns.iconmonstr.com/wp-content/assets/preview/2012/240/iconmonstr-user-1.png' 
              text='Скрытое сообщение от неавторизованного пользователя'
              likes = {false} 
              messageId='undefined'/>
            }
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