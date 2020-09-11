import React from 'react';
import './Navigation.css';
import { NavLink } from 'react-router-dom'

const Navigation:React.FC = () => {
  return (
    <nav className="navigation">
      <h2 className="navigation__title">Чаты</h2>
      <ul className="navigation__list">
        <li className="navigation__item">
          <NavLink to="/" exact className="navigation__link" activeClassName="navigation__link_active">Рабочие вопросы</NavLink>
        </li>
        <li className="navigation__item">
          <NavLink to="/floodchat" className="navigation__link" activeClassName="navigation__link_active">Флудилка</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;