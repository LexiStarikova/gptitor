// NameContextProvider.js
import { useState } from 'react';
import { FeedbackContext } from './feedbackContext';
import { Metrics } from './models/metrics';
import { Task } from './models/task';

// @ts-ignore
const FeedbackContextProvider = ({ children }) => {
  
  const [feedback, setFeedback] = useState('');
  const [criteria, setCriteria ] = useState(new Metrics(0.0, 0.0, 0.0, 0.0))
  const [task, setTask] = useState(new Task(1, "", "", ""));
  return (
    <FeedbackContext.Provider value={{ feedback, setFeedback, 
                                       criteria, setCriteria, 
                                       task, setTask
     }}>
      {children}
    </FeedbackContext.Provider>
  );
  
};

export default FeedbackContextProvider;
