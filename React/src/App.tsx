import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { useState, useContext, useEffect } from 'react';
import { FeedbackContext } from './feedbackContext';
import FeedbackContextProvider from './feedbackContextProvider';
import Sidebar from './sidebar';
import NavBar from './header';
import StudyMode from './studymode';
import Profile from './profile';
import { Metrics } from './models/metrics';


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

const AppContent: React.FC = () => {

  const { feedback, setFeedback, criteria, setCriteria, task, setTask } = useContext(FeedbackContext);
  const [convId, setConvId] = useState(1);
  const [queries, setQueries] = useState<{ display_id: number; stored_id: number; text: string }[]>([]);
  const [nextId, setNextId] = useState(1);
  const [responses, setResponses] = useState<MessageSimplifyed[]>([]);
  const [requests, setRequests] = useState<MessageSimplifyed[]>([]);


  const addQueries = (data: any[]) => {
    setQueries(
      data.map(item => ({
        display_id: item.conversation_id,
        stored_id: item.conversation_id,
        text: `Query ${item.conversation_id}`,
  })));

      const highestId = Math.max(...data.map(item => item.conversation_id));
      setNextId(highestId + 1);
    };

  useEffect(() => {
    const fetchDialogs = async () => {
      setQueries([]);
      setNextId(1);
      try {
        const response = await fetch('http://10.100.30.244:8000/conversations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        addQueries(data);
      } catch (error) {
        console.error('There was a mistake with data uploading: ', error);
      }
    };
    fetchDialogs();
  }, []); 

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

  if (extractedResponses.length > 0) {
      const lastRequest = extractedRequests[extractedRequests.length - 1].id;
      const response_2 = await fetch(`http://10.100.30.244:8000/feedback/${lastRequest}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data_2 = await response_2.json();

      setFeedback(data_2.comment);
      setCriteria(new Metrics(data_2.metrics.criterion_1,
        data_2.metrics.criterion_2,
        data_2.metrics.criterion_3,
        data_2.metrics.criterion_4));
    } else {
      setFeedback('');
      setCriteria(new Metrics(0,0,0,0));
    }
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

const App: React.FC = () => {
  return (
    <FeedbackContextProvider>
      <AppContent />
    </FeedbackContextProvider>
  );
};

export default App;
