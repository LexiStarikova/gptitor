import './App.css';
import Header from './header';
import Sidebar from './sidebar';
import { ConversationPanel } from './conversationPanel';
import { FeedbackPanel } from './feedbackPanel';
import DataFetchingComponent from './DataFetchingComponent';

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
    <div id="data-fetching-panel">
        <DataFetchingComponent/> {/* Insert the DataFetchingComponent */}
    </div>
    </div>
  )
}

export default App;
