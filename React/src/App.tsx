import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useContext, useEffect, useRef } from 'react';
import { FeedbackContext } from './feedbackContext';
import Sidebar from './sidebar';
import NavBar from './header';
import StudyMode from './studymode';
import Profile from './profile';
import { Metrics } from './models/metrics';
import API_URL from './config';
import SendContextProvider from './sendContextProvider';

interface Message {
  id: number;
  message_class: string;
  text: string;
  feedback_id: number;
}

interface MessageSimplifyed {
  id: number,
  text: string,
}

const App: React.FC = () => {

  const { setFeedback, criteria, setCriteria } = useContext(FeedbackContext);
  const [convId, setConvId] = useState(1);
  const [queries, setQueries] = useState<{ display_id: number; stored_id: number; text: string; date: Date }[]>([]);
  const [nextId, setNextId] = useState(1);
  const [responses, setResponses] = useState<MessageSimplifyed[]>([]);
  const [requests, setRequests] = useState<MessageSimplifyed[]>([]);
  const hasMounted = useRef(false);
  const [selectedLLM, setSelectedLLM] = useState<number | null>(null);

  const addHoursToDate = (date: Date, hours: number): Date => {
    const newDate = new Date(date.getTime());
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
  };

  useEffect(() => {
    if (queries.length === 0) {
      setRequests([]);
      setResponses([]);
    }
  }, [queries]);

  const addQueries = (data: any[]) => {
    setQueries(
      data.map(item => ({
        display_id: item.conversation_id,
        stored_id: item.conversation_id,
        text: `Query ${item.conversation_id}`,
        date: addHoursToDate(new Date(item.created_at.replace(" ", "T")), 3),
        llm_id: item.llm_id,
      })));

    const highestId = Math.max(...data.map(item => item.conversation_id));
    setNextId(highestId + 1);
  };

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    const fetchDialogs = async () => {
      setQueries([]);
      setNextId(1);
      try {
        const response = await fetch(`${API_URL}/conversations`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        if (data.length === 0) {
          CreateConversation();
        }
        else {
          addQueries(data);
        }
      } catch (error) {
        console.error('There was a mistake with data uploading: ', error);
      }
    };
    fetchDialogs();
  }, []);

  const CreateConversation = async () => {
    if (selectedLLM === null) {
      setSelectedLLM(1);
    }
    const response = await fetch(`${API_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        llm_id: selectedLLM,
      }),
    });

    const data = await response.json();
    console.log(`New conversation_id: ${data.conversation_id}`); // ID in DB

    const newQuery = {
      display_id: nextId,
      stored_id: data.conversation_id,
      text: `Query ${nextId}`,
      date: new Date(data.created_at.replace(' ', 'T')),
      llm_id: selectedLLM,

    };

    setQueries(prevQueries => [...prevQueries, newQuery]);
    setNextId(nextId + 1);
    console.log(newQuery.date);
    console.log(selectedLLM)
  };

  const openConversation = async (stored_id: number) => {
    console.log('Conversation is opening...');
    const response = await fetch(`${API_URL}/conversations/${stored_id}/messages`, {
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
      const response_2 = await fetch(`${API_URL}/feedback/${lastRequest}`, {
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
      setCriteria(new Metrics(0, 0, 0, 0));
    }
  };

  useEffect(() => {
    console.log("Criteria updated:", criteria);
  }, [criteria]);


  const deleteConversation = async (display_id: number, stored_id: number) => {
    setQueries(queries.filter(query => query.display_id !== display_id));
    const response = await fetch(`${API_URL}/conversations/${stored_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log(response.json());
  };

  return (
    <SendContextProvider>
      <Router basename='/gptitor'>
        <NavBar />
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
          <Route path='/chatpage' element={<StudyMode
            queries={queries}
            createConversation={CreateConversation}
            requests={requests}
            setRequests={setRequests}
            responses={responses}
            setResponses={setResponses}
            conversation_id={convId}
            selectedLLM={selectedLLM}
            setSelectedLLM={setSelectedLLM}
          />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Router>
    </SendContextProvider>
  );
}

export default App;
