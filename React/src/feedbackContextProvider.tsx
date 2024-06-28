// NameContextProvider.js
import { useState } from 'react';
import { FeedbackContext } from './feedbackContext';
import { Score } from './models/score';
import { Task } from './models/task';

// @ts-ignore
const FeedbackContextProvider = ({ children }) => {
  
  const [feedback, setFeedback] = useState('');
  const [criteria, setCriteria ] = useState(new Score(0.0, 0.0, 0.0, 0.0))
  const [task, setTask] = useState(new Task(2, "", "", ""));
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
