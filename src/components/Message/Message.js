import React, { useContext } from 'react';
import './Message.css';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import PropTypes from 'prop-types';

function Message({ author, avatar, text, likes, messageId, onEditClick, onDeleteClick, onLikeClick }) {

  const currentUser = useContext(CurrentUserContext)

  const handleEditClick = () => {
    onEditClick(messageId);
  }

  const isLiked = likes && likes.some(item => item.id === currentUser.id);
  const canEditAndDelete = author.id === currentUser.id;

  const handleDeleteClick = () => {
    onDeleteClick(messageId);
  }

  const handleLikeClick = () => {
    onLikeClick(messageId, likes);
  }

  return (
    <div className="message">
      <div className="message__avatar" style={{ backgroundImage: `url(${avatar})` }}></div>
      <div className="message__content">
        <div className="message__top-info">
          <p className="message__author">{author.name}</p>
          {likes !== false && <div className="message__handlers">
            {canEditAndDelete && <button className="message__button message__button_edit" onClick={handleEditClick}></button>}
            {canEditAndDelete && <button className="message__button message__button_delete" onClick={handleDeleteClick}></button>}
            <div className="message__likes">
              <button className={`message__button message__button_like ${isLiked ? 'message__button_like-active' : ''} `} onClick={handleLikeClick}></button>
              <span className="message__like-count">{likes && likes.length}</span>
            </div>
          </div>
          }
        </div>
        <p className="message__text">{text}</p>
      </div>
    </div>
  );
}


Message.propTypes = {
  author: PropTypes.object,
  avatar: PropTypes.string,
  text: PropTypes.string,
  likes: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.bool
  ]),
  messageId: PropTypes.string,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onLikeClick: PropTypes.func
}

export default Message;