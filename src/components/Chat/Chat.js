import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import Message from '../Message/Message';
import './Chat.css';

function Chat({ messages, title, onEditClick, onDeleteClick, onLikeClick, scrollDown }) {
  console.log(messages)
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [scrollDown]);

  return (
    <div className="chat">
      <h2 className="chat__title">{title}</h2>
      <div className="chat__content">
        {messages && messages.map((message) => {
          return (
            <Message
              key={message.messageId}
              messageId={message.messageId}
              author={message.author}
              avatar={message.author.avatar}
              text={message.message}
              likes={message.likes}
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