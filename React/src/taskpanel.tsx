import React, { useState, useEffect } from 'react';
import './taskpanel.css';
import { Task } from './models/task';
import API_URL from './config';
import { useTaskContext } from './taskContext';

interface TaskPanelProps {
    isOpenS: boolean;
    close: () => void;
}

interface Category {
    category_id: number;
    category_name: string;
    category_description: string;
}


const TaskPanel: React.FC<TaskPanelProps> = ({ isOpenS, close }) => {

    const { selectedCategory, setSelectedCategory, selectedTask, setSelectedTask } = useTaskContext();
    const [categories, setCategories] = useState<Category[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);

    // Get array of all categories and put them into 'categories'
    useEffect(() => {
        fetch(`${API_URL}/categories`)
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    // Get array of tasks by selected category and put them into 'tasks'
    useEffect(() => {
        if (selectedCategory === 'All') {
            fetch(`${API_URL}/tasks`)
                .then(response => response.json())
                .then(data => setTasks(data))
                .catch(error => console.error('Error fetching tasks:', error));
        } else if (selectedCategory) {
            let id = 0;
            categories.some((category) => {
                if (category.category_name == selectedCategory) {
                    id = category.category_id
                    return
                }
            })

            console.log(id);

            fetch(`${API_URL}/categories/${id}`)
                .then(response => response.json())
                .then(data => setTasks(data))
                .catch(error => console.error('Error fetching tasks:', error));
            console.log(tasks);
            setSelectedTask(null)
            setSelectedTutorial(null)
        }
    }, [selectedCategory]);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const handleTaskChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const taskId = Number(event.target.value);
        if (taskId) {
            fetch(`${API_URL}/tasks/${taskId}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setSelectedTask(new Task(data.task_id, data.task_name, data.task_category, data.task_description));
                })
                .catch(error => console.error('Error fetching task:', error));
            setSelectedTutorial(null);
        }
    };

    console.log("Website loaded")
    console.log("Selected category: "+selectedCategory)
    console.log("Selected task: "+selectedTask?.task_id)

    const handleTutorialClick = (tutorial: string) => {
        setSelectedTutorial(tutorial);
        setSelectedCategory('All');
        setSelectedTask(null);

        console.log(selectedTutorial);
        console.log(selectedCategory);
        console.log(selectedTask?.task_id);
    };

    const renderTaskDescription = () => {
        if (selectedTutorial) {
            return (
                <div className='tutorial-content'>
                    {selectedTutorial}
                </div>
            );
        } else if (selectedCategory && selectedTask && selectedTask.task_id > 0) {
            return (
                <>
                    <div className='ndiv'>
                        <div className='Titles'>
                            <div className='taskName'>
                                <h6 className='Taskt'>Task:</h6>
                                <h6 className='Taskn'>{selectedTask.task_name}</h6>
                            </div>
                            <div className='catName'>
                                <h6 className='Catt'>Category:</h6>
                                <h6 className='Catn'>{selectedTask.category}</h6>
                            </div>
                        </div>
                        <div className='Divider'></div>
                        <div className='Desc'>
                            <h6 className='DescT'>Description</h6>
                            <p className='Descript'>{selectedTask.description}</p>
                        </div>
                    </div>
                    <p className='solvebutton' onClick={close}>Solve Task</p>
                </>
            );
        } else if (selectedCategory && !selectedTask) {
            return <h5 className='select-content'>Please, select a task.</h5>;
        } else {
            return <h5 className='select-content'>Please, select a category or a task.</h5>;
        }
    };

    return (
        <div className={`panel${isOpenS ? 'open' : ''}`}>
            <div className='panelcontainer'>
                <div className='taskcontainer'>
                    {/* Left menu */}
                    <div className="taskcontainer-upper">
                        <div className="dropdown-container">
                            <h4>Category</h4>
                            <label htmlFor="category-selector">Select Category:</label>
                            <select id="category-selector" value={selectedCategory} onChange={handleCategoryChange}>
                                <option value="All">All</option>
                                {categories.map(category => (
                                    <option key={category.category_id} value={category.category_name}>{category.category_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="dropdown-container">
                            <h4>Tasks</h4>
                            <label htmlFor="task-selector">Select Task:</label>
                            <select id="task-selector" value={selectedTask?.task_id || ''} onChange={handleTaskChange} disabled={!selectedCategory}>
                                <option value='' disabled={!!selectedTask}>--Select Task--</option>
                                {tasks.map(task => (
                                    <option key={task.task_id} value={task.task_id}>Task {task.task_id}: {task.task_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="taskcontainer-bottom">
                        <h4>Tutorial Links</h4>
                        <ul>
                            <li><a onClick={() => handleTutorialClick('Tutorial 1 content')}>Tutorial 1</a></li>
                            <li><a onClick={() => handleTutorialClick('Tutorial 2 content')}>Tutorial 2</a></li>
                            <li><a onClick={() => handleTutorialClick('Tutorial 3 content')}>Tutorial 3</a></li>
                        </ul>
                    </div>
                </div>
                {/* Text container */}
                <div className='taskDes'>
                    {renderTaskDescription()}
                </div>
            </div>
        </div>

    );
};

export default TaskPanel;