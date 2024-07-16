// TaskContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Task } from './models/task';

interface TaskContextProps {
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
    selectedTask: Task | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedTask, setSelectedTask] = useState<Task | null>(new Task(0, '', '', ''));

    return (
        <TaskContext.Provider value={{ selectedCategory, setSelectedCategory, selectedTask, setSelectedTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = (): TaskContextProps => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};