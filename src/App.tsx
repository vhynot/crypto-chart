import React from 'react';
import './assets/stylesheets/style.css'
import Chart from './components/Chart'

const App: React.FC = () => {
  return (
    <>
      <div className="navbar">Currency Chart</div>
      <Chart />
    </>
  );
}

export default App;
