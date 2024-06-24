import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SideBar from './sidebar.tsx';
import NavBar from './header.tsx';
import StudyMode from './studymode.tsx';
import Profile from './profile.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <NavBar></NavBar>
      <SideBar></SideBar>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/chatpage" />} />
          <Route path='/chatpage' element={<StudyMode />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
        </Routes>
      </main>
    </Router>
  )
}

export default App;
