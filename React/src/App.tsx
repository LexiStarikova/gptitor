import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './sidebar.tsx';
import NavBar from './header.tsx';
import StudyMode from './studymode.tsx';
import Profile from './profile.tsx';
import { useState } from 'react';

interface Message {
  id: number;
  message_class: string;
  text: string;
  feedback_id: number;
}

interface MessageSimplifyed {
  id: number,
  text: string
}

const App: React.FC = () => {

  const [convId, setConvId] = useState(1);
  const [queries, setQueries] = useState<{ display_id: number; stored_id: number; text: string }[]>([]);
  const [nextId, setNextId] = useState(1);
  const [responses, setResponses] = useState<MessageSimplifyed[]>([]);
  const [requests, setRequests] = useState<MessageSimplifyed[]>([]);


  const UpdateQueries = async () => {

    const response = await fetch('http://10.100.30.244:8000/conversations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    const addQueries = data.map((item: any) => {
      setQueries([]);
      setQueries(prevQueries => [
        ...prevQueries,
        { display_id: item.conversation_id, stored_id: item.conversation_id, text: `Query ${nextId}` }
      ]);
      setNextId(nextId + 1);
    });    
    };

const CreateConversation = async () => {
  const response = await fetch('http://10.100.30.244:8000/conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      llm_id: 0,
    }),
  });
  const data = await response.json();
  console.log(`New conversation_id: ${data.conversation_id}`); // ID in DB

  const newQuery = { display_id: nextId, stored_id: data.conversation_id, text: `Query ${nextId}` };
  setQueries(prevQueries => [...prevQueries, newQuery]);
  setNextId(nextId + 1);
};

const openConversation = async (stored_id: number) => {
  console.log('Conversation is opening...');
  const response = await fetch(`http://10.100.30.244:8000/conversations/${stored_id}/messages`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const data = await response.json();
  setConvId(stored_id);
  console.log(`Number of messages: ${data.length}`);

  const parsedMessages: Message[] = data.map((item: any) => ({
    id: item.message_id,
    message_class: item.message_class,
    text: item.content,
    feedback_id: item.feedback_id,
  }));

  const responses = parsedMessages.filter(message => message.message_class === 'Response');
  const requests = parsedMessages.filter(message => message.message_class === 'Request');

  const extractIdAndText = (messages: Message[]) => {
    return messages.map(({ id, text }) => ({ id, text }));
  };

  const extractedRequests = extractIdAndText(requests);
  const extractedResponses = extractIdAndText(responses);

  setResponses(extractedResponses);
  setRequests(extractedRequests);
};

const deleteConversation = async (display_id: number, stored_id: number) => {
  setQueries(queries.filter(query => query.display_id !== display_id));
  const response = await fetch(`http://10.100.30.244:8000/conversations/${stored_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  console.log(response.json());
};

return (
  <Router basename='/gptitor'>
    <NavBar></NavBar>
    <div className='sidebarr'>
      <Sidebar
        UpdateQueries={UpdateQueries}
        CreateConversation={CreateConversation}
        openConversation={openConversation}
        deleteConversation={deleteConversation}
        requests={requests}
        responses={responses}
        queries={queries}
      />
    </div>
      <Routes>
          <Route path="/" element={<Navigate to="/chatpage" />} />
            <Route path='/chatpage' element={<StudyMode requests={requests} setRequests={setRequests} responses={responses} setResponses={setResponses} conversation_id={convId} />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
      </Routes>
  </Router>
)
}

export default App;
