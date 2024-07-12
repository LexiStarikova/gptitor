import { useState } from 'react';
import { SendContext } from './sendContext';

// @ts-ignore
const SendContextProvider = ({ children }) => {
  
  const [isSended, setIsSended] = useState(true);
  return (
    <SendContext.Provider value={{ isSended, setIsSended
     }}>
      {children}
    </SendContext.Provider>
  );
  
};

export default SendContextProvider;