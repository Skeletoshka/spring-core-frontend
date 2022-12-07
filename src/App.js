import Auth from './pages/Auth';
import Registry from './pages/Registry'
import LK from './pages/LK';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import React, { Component } from 'react';
import Header from './components/Header';

class App extends Component {
  render() {
      document.body.style = 'background: #61dafb;';
    return (
        <div id='main'>
          <Header/>
          <div className='body-div'>
            <BrowserRouter>
              <Routes>
                  <Route path='/' element={<Auth />} />
                  <Route path='/registry' element={<Registry />} />
                  <Route path='/lk' element={<LK />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
    )
  }
}

export default App;
