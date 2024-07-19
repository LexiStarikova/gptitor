import React, { useState, useEffect, useContext } from 'react';
import { FeedbackContext } from './feedbackContext';
import { Metrics } from './models/metrics';
import './taskpanel.css';
import { Task } from './models/task';
import API_URL from './config';
import { useTaskContext } from './taskContext';
import MarkdownRenderer from './markdownRenderer';

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
    const { setCriteria } = useContext(FeedbackContext);
    const { setFeedback } = useContext(FeedbackContext);
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

    const resetScore = () => {
        setCriteria(new Metrics(0.0, "", 0.0, "", 0.0, "", 0.0, ""));
    };
    const resetFeedback = () => {
        setFeedback('');
    };

    const handleSolveButtonChange = () => {
        resetScore()
        resetFeedback()
        close()
    }

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
    console.log("Selected category: " + selectedCategory)
    console.log("Selected task: " + selectedTask?.task_id)

    const handleTutorialClick = (tutorial: string) => {
        switch (tutorial) {
            case 'Tutorial_1':
                setSelectedTutorial("##### Be clear and specific. \n Specificity helps the AI understand exactly what you're asking for. \n\n **Example:** \n- Less Effective: \"Tell me about Python.\" \n- More Effective: \"Explain the basics of Python programming, including variables, data types, and loops.\" \n ##### Define the context. \n Providing context ensures the AI knows the background of your query. \n\n **Example**: \n- Less Effective: \"What is a loop?\" \n- More Effective: \"In the context of programming, what is a loop and how is it used in Python?\" \n ##### Use simple and direct language. \n Avoid complex wording or ambiguous terminology. \n\n **Example:** \n- Less Effective: \"Can you expound on the nuances of algorithmic structures?\" \n- More Effective: \"Can you explain what algorithms are and how they work?\" \n ##### Ask open-ended questions when needed. \n For more detailed responses, opt for open-ended questions. \n\n **Example:** \n- Less Effective: \"Is Python a good programming language?\" \n-  More Effective: \"Why is Python considered a good programming language for beginners and experts alike?\" \n ##### Break down complex queries. \n If the topic is complex, break it into smaller, manageable parts. \n\n **Example:** \n- Less Effective: \"Explain machine learning.\" \n- More Effective: \"Can you explain the basic concepts of machine learning? Start with what it is, how it works, and give an example.\""
                )
                break;
            case 'Tutorial_2':
                setSelectedTutorial("##### Provide examples. \n Providing examples helps the AI understand the format and type of response you expect. \n\n **Example:** \n- Less Effective: \"How do I write a good prompt?\" \n- More Effective: \"Can you give me an example of a well-crafted prompt for writing an essay introduction?\" \n ##### Specify the desired output format. \n Specify if you need the response in a particular format, such as a list, bullet points, or paragraphs. \n\n **Example:** \n- Less Effective: \"Tell me about agile methodologies.\" \n- More Effective: \"Can you explain agile methodologies in bullet points?\" \n ##### Iterate and refine the prompt. \n Start with a basic prompt and refine it based on the responses you get. \n\n **Example:** \n- Initial Prompt: \"Tell me about the solar system.\" \n- Refined Prompt: \"Describe the solar system, listing each planet and their unique characteristics.\" \n ##### Use constraints when needed. \n Constraining the response can help keep the answer concise and focused. \n\n **Example:** \n- Less Effective: \"Tell me about renewable energy.\" \n- More Effective: \"Describe three key advantages of renewable energy in no more than two sentences each.\"")
                break;
            case 'Tutorial_3':
                setSelectedTutorial("##### Example 1: Writing an Essay Introduction. \n Prompt: \"I am writing an essay on the importance of cybersecurity. Can you provide an engaging and informative introduction paragraph?\" \n ##### Example 2: Coding Explanation. \n Prompt: \"I am learning Python and I am confused about list comprehensions. Can you explain what they are and provide a simple example?\" \n ##### Example 3: Historical Event Summary. \n Prompt: \"Summarize the causes and consequences of the French Revolution in a short paragraph.\"")
                break;
            default:
                setSelectedTutorial(tutorial);
                break;
        }

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
                    <MarkdownRenderer text={selectedTutorial}/>
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
                    <p className='solvebutton' onClick={handleSolveButtonChange}>Solve Task</p>
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
                        <h4>Tutorials</h4>
                        <ul>
                            <li><a onClick={() => handleTutorialClick('Tutorial_1')}>Basic Principles</a></li>
                            <li><a onClick={() => handleTutorialClick('Tutorial_2')}>Advanced Techniques</a></li>
                            <li><a onClick={() => handleTutorialClick('Tutorial_3')}>Examples</a></li>
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