import './App.css';
import SideBar from './sidebar.tsx';
import NavBar from './header.tsx';
import {ConversationPanel} from './conversationPanel.tsx';
import FeedbackPanel from './feedbackPanel.tsx';

function App() {
  return (
    <div>
      <NavBar></NavBar>
      <div>
        <SideBar></SideBar>
      </div>
      <div className='chatpage'>
        <ConversationPanel></ConversationPanel>
        <FeedbackPanel></FeedbackPanel>
      </div>

    </div>
  )
}

export default App;