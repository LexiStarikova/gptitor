import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import FeedbackContextProvider from './feedbackContextProvider';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FeedbackContextProvider>
      <App />
    </FeedbackContextProvider>
  </React.StrictMode>,
)
