import Auth from './pages/Auth';
import LK from './pages/LK';
import {Route, Routes, BrowserRouter, useNavigate} from 'react-router-dom';
import React, { Component } from 'react';
import Header from './components/Header';
import AccessRole from './pages/AccessRole';
import Proguser from './pages/Proguser';
import ControlObject from './pages/ControlObject';
import StudyProgram from './pages/StudyProgram';
import Direction from './pages/Direction';
import People from "./pages/People";
import Activity from "./pages/Activity";
import News from "./pages/News";
import NewsPublic from "./pages/public/News";
import PageNotFound from "./pages/public/PageNotFound";
import HomePage from "./pages/public/HomePage";
import StudyProgramPublic from "./pages/public/StudyProgram";
import ActivityPublic from "./pages/public/Activity";
import Schedule from "./pages/Schedule";
import WorkGroup from "./pages/WorkGroup";
import PeopleWorkGroup from "./pages/PeopleWorkGroup";
import Request from "./pages/Request";
import {Menu, MenuProps} from "antd";
import Appendix from "./pages/Appendix";

class App extends Component {
  render() {
      document.body.style = 'background: #61dafb;';
    return (
        <div id='main'>
            <BrowserRouter>
                <Header/>
                <div className='body-div'>
              <Routes>
                  <Route path='/' element={<HomePage />} />
                  <Route path='/auth' element={<Auth />} />
                  <Route path='/lk' element={<LK />} />
                  <Route path='/roles' element={<AccessRole/>}/>
                  <Route path='/lk/proguser' element={<Proguser/>}/>
                  <Route path='/lk/controlobject' element={<ControlObject/>}/>
                  <Route path='/lk/studyprogram' element={<StudyProgram/>}/>
                  <Route path='/lk/direction' element={<Direction/>}/>
                  <Route path='/lk/people' element={<People/>}/>
                  <Route path='/lk/activity' element={<Activity/>}/>
                  <Route path='/lk/news' element={<News/>}/>
                  <Route path='/lk/schedule' element={<Schedule/>}/>
                  <Route path='/lk/workgroup' element={<WorkGroup/>}/>
                  <Route path='/lk/workgroup/:id' element={<PeopleWorkGroup/>}/>
                  <Route path='/lk/request' element={<Request/>}/>
                  <Route path='/lk/file' element={<Appendix/>}/>
                  <Route path='/news' element={<NewsPublic/>}/>
                  <Route path='/studyprogram' element={<StudyProgramPublic/>}/>
                  <Route path='/activity' element={<ActivityPublic/>}/>
                  <Route path="*" element={<PageNotFound/>} />
              </Routes>
                </div>
            </BrowserRouter>
        </div>
    )
  }
}

export default App;
