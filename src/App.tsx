import './App.css';
import Header from './header';
import Sidebar from './sidebar';
import { ConversationPanel } from './conversationPanel';
import { FeedbackPanel } from './feedbackPanel';

function App() {
  return(
    <div>
    <div id="page-side-bar">
      <Sidebar/>      
    </div>
    <div id="page-header">
      <Header/>
    </div>
    <div id="conversation-panel">
      <ConversationPanel/>
    </div>
    <div id="feedback-panel">
      <FeedbackPanel/>
    </div>
    </div>
  )
}

export default App;
