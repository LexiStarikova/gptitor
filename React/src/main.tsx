import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import FeedbackContextProvider from './feedbackContextProvider';
import { TaskProvider } from './taskContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TaskProvider>
      <FeedbackContextProvider>
        <App />
      </FeedbackContextProvider>
    </TaskProvider>
  </React.StrictMode>,
)
