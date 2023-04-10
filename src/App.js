import Auth from './pages/Auth';
import LK from './pages/LK';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import React, { Component } from 'react';
import Header from './components/Header';
import AccessRole from './pages/AccessRole';
import Proguser from './pages/Proguser';
import ControlObject from './pages/ControlObject';
import StudyProgram from './pages/StudyProgram';
import Direction from './pages/Direction';
import People from "./pages/People";

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
                  <Route path='/lk' element={<LK />} />
                  <Route path='/roles' element={<AccessRole/>}/>
                  <Route path='/lk/proguser' element={<Proguser/>}/>
                  <Route path='/lk/controlobject' element={<ControlObject/>}/>
                  <Route path='/lk/studyprogram' element={<StudyProgram/>}/>
                  <Route path='/lk/direction' element={<Direction/>}/>
                  <Route path='/lk/people' element={<People/>}/>
              </Routes>
            </BrowserRouter>
          </div>
        </div>
    )
  }
}

export default App;
