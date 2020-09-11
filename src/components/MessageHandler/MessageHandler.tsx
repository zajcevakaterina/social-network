import React, { useState, useEffect } from 'react';
import './MessageHandler.css';
// import PropTypes from 'prop-types';

type MessageHandlerProps = {
  onAddMessage(text: string): void, 
  messageToEdit: string, 
  onEditMessage(message:string): void,
}

const MessageHandler:React.FC<MessageHandlerProps> = ({ onAddMessage, messageToEdit, onEditMessage }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageToEdit) {
      onEditMessage(message)
    } else {
      onAddMessage(message);
      setMessage('');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  useEffect(() => {
    setMessage(messageToEdit)
  }, [messageToEdit])

  return (
    <form className="message-handler" onSubmit={handleSubmit}>
      <textarea
        className="message-handler__textarea"
        rows={4}
        name="message"
        placeholder="Введите сообщение..."
        onChange={handleChange}
        value={message}>
      </textarea>
      <button type="submit" className="message-handler__button" disabled={!message.trim() ? true : false}>Отправить</button>
    </form>
  );
}

// MessageHandler.propTypes = {
//   onAddMessage: PropTypes.func,
//   messageToEdit: PropTypes.string,
//   onEditMessage: PropTypes.func,
// }

export default MessageHandler;