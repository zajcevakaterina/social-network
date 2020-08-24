import React from 'react';
import './Sidebar.css';
import Navigation from '../Navigation/Navigation'

function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 className="sidebar__title">Planktonics социальная сеть</h1>
      <Navigation/>
    </aside>
  );
}

export default Sidebar;
