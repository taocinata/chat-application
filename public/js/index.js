import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../src/components/app';

const rootNode = document.getElementById('root');

ReactDOM.render(<App socket={io()} />, rootNode);
