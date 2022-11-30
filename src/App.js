import Auth from './pages/Auth';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import React, { Component } from 'react';

class App extends Component {
  render() {
      document.body.style = 'background: #61dafb;';
    return (
        <div id='main'>
        <BrowserRouter>
          <Routes>
              <Route path='/' element={<Auth />} />
          </Routes>
        </BrowserRouter>
        </div>
    )
  }
}

export default App;
