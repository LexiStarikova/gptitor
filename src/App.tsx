import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SideBar from './sidebar.tsx';
import NavBar from './header.tsx';
import {ConversationPanel} from './conversationPanel.tsx';
import FeedbackPanel from './feedbackPanel.tsx';
import StudyMode from './studymode.tsx';
import Profile from './profile.tsx';

function App() {
  return (
    <div>
      <Router basename="/GPTitor">
      <NavBar></NavBar>
      <div>
        <SideBar></SideBar>
      </div>
      <div className='chatpage'>
        <ConversationPanel></ConversationPanel>
        <FeedbackPanel></FeedbackPanel>
      </div>
      <main>
        <Routes>
          <Route path=" / " element={<Navigate to="/chatpage" />} />
          <Route path='/chatpage' element={<StudyMode />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
        </Routes>
      </main>
    </Router>
    </div>
  )
}

export default App;
