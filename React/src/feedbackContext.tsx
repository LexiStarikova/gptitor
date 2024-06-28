// NameContext.js
import { createContext } from 'react';
import { Score } from './models/score';
import { Task } from './models/task';

export const FeedbackContext = createContext<{
    feedback: string;
    setFeedback: React.Dispatch<React.SetStateAction<string>>;
    criteria: Score;
    setCriteria: React.Dispatch<React.SetStateAction<Score>>;
    task: Task;
    setTask: React.Dispatch<React.SetStateAction<Task>>;
}>({
    feedback: "",
    setFeedback: () => {},
    criteria: new Score(0.0, 0.0, 0.0, 0.0),
    setCriteria: () => {},
    task: new Task(2, "", "", ""),
    setTask: () => {}
});