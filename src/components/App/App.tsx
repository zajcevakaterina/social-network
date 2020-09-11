import React from 'react';
import Sidebar from '../Sidebar/Sidebar'
import Workspace from '../Workspace/Workspace';

const App:React.FC = () => {
  return (
    <div className="app">
      <Sidebar/>
      <Workspace/>
    </div>
  );
}

export default App;
