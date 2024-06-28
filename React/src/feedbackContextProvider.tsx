// NameContextProvider.js
import { useState } from 'react';
import { FeedbackContext } from './feedbackContext';
import { Score } from './score';

// @ts-ignore
const FeedbackContextProvider = ({ children }) => {
  
  const [feedback, setFeedback] = useState('');
  const [criteria, setCriteria ] = useState(new Score(0.0, 0.0, 0.0, 0.0))
  return (
    <FeedbackContext.Provider value={{ feedback, setFeedback, criteria, setCriteria
     }}>
      {children}
    </FeedbackContext.Provider>
  );
  
};

export default FeedbackContextProvider;
