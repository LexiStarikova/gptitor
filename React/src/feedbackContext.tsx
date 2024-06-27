// NameContext.js
import { createContext } from 'react';

export const FeedbackContext = createContext<{
    feedback: string;
    setFeedback: React.Dispatch<React.SetStateAction<string>>;
}>({
    feedback: "",
    setFeedback: () => {},
});
