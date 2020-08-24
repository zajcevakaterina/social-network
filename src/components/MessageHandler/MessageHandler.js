import React, { useState, useEffect } from 'react';
import './MessageHandler.css';
import PropTypes from 'prop-types';

function MessageHandler({ onAddMessage, messageToEdit, onEditMessage }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageToEdit) {
      onEditMessage(message)
    } else {
      onAddMessage(message);
      setMessage('');
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  useEffect(() => {
    setMessage(messageToEdit)
  }, [messageToEdit])

  return (
    <form className="message-handler" onSubmit={handleSubmit}>
      <textarea
        className="message-handler__textarea"
        rows="4"
        type="text"
        name="message"
        placeholder="Введите сообщение..."
        onChange={handleChange}
        value={message}>
      </textarea>
      <button type="submit" className="message-handler__button" disabled={!message ? true : false}>Отправить</button>
    </form>
  );
}

MessageHandler.propTypes = {
  onAddMessage: PropTypes.func,
  messageToEdit: PropTypes.string,
  onEditMessage: PropTypes.func,
}

export default MessageHandler;