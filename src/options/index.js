import React from 'react';
import ReactDOM from 'react-dom';
import Options from './Options';

const root = ReactDOM.createRoot(document.getElementById('options'));
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById('options')
);
