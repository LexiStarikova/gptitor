// NameContext.js
import { createContext } from 'react';
import { Score } from './score';

export const FeedbackContext = createContext<{
    feedback: string;
    setFeedback: React.Dispatch<React.SetStateAction<string>>;
    criteria: Score;
    setCriteria: React.Dispatch<React.SetStateAction<Score>>;
}>({
    feedback: "",
    setFeedback: () => {},
    criteria: new Score(0.0, 0.0, 0.0, 0.0),
    setCriteria: () => {}
});