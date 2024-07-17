// NameContext.js
import { createContext } from 'react';
import { Metrics } from './models/metrics';
import { Task } from './models/task';

export const FeedbackContext = createContext<{
    feedback: string;
    setFeedback: React.Dispatch<React.SetStateAction<string>>;
    criteria: Metrics;
    setCriteria: React.Dispatch<React.SetStateAction<Metrics>>;
    task: Task;
    setTask: React.Dispatch<React.SetStateAction<Task>>;
}>({
    feedback: "",
    setFeedback: () => {},
    criteria: new Metrics(0.0, "", 0.0, "", 0.0, "", 0.0, ""),
    setCriteria: () => {},
    task: new Task(0, "", "", ""),
    setTask: () => {}
});