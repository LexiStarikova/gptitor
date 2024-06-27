// NameContextProvider.js
import React, { useState } from 'react';
import { FeedbackContext } from './feedbackContext';

// @ts-ignore
const FeedbackContextProvider = ({ children }) => {
  const [feedback, setFeedback] = useState('');

  return (
    <FeedbackContext.Provider value={{ feedback, setFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContextProvider;
