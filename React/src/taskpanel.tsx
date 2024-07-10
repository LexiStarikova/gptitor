import React, { useContext } from 'react';
import './taskpanel.css';
import { FeedbackContext } from './feedbackContext';
import { Task } from './models/task';

interface TaskPanelProps {
    isOpenS: boolean;
    close: () => void;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ isOpenS, close }) => {

    const { task, setTask } = useContext(FeedbackContext);

    const handleTaskClick = (taskId: number) => {
        fetch(`http://10.100.30.244:8005/tasks/${taskId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTask(new Task(data.task_id, data.task_name, data.category, data.description));
            })
            .catch(error => {
                console.error('Error fetching task:', error);
            });
    };

    return (
        <div className={`panel${isOpenS ? 'open' : ''}`}>
            <div className='panelcontainer'>
                <div className='taskcontainer'>
                    <div className='Tasks'>
                        <div className='tasktitle'>
                            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.2219 14.4888L9.51081 21.5999L18.7553 11.6443L13.7775 8.7999L14.4886 2.3999L5.24414 12.3555L10.2219 14.4888Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <h6>Suggested</h6>
                        </div>
                        <ul>
                            <li onClick={() => handleTaskClick(1)}><p className='listbox'>Task 1</p></li>
                            <li onClick={() => handleTaskClick(2)}><p className='listbox'>Task 2</p></li>
                            <li onClick={() => handleTaskClick(3)}><p className='listbox'>Task 3</p></li>
                        </ul>
                    </div>
                    <div className='Categories'>
                        <div className='CategoriesTitle'>
                            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.2801 1.3418L14.9844 5.93633L19.59 7.63647L14.9844 9.3366L13.2801 13.9311L11.5759 9.3366L6.97018 7.63647L11.5759 5.93633L13.2801 1.3418Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
                                <path d="M5.3927 11.8329L6.88145 14.0196L9.07349 15.5048L6.88145 16.99L5.3927 19.1767L3.90395 16.99L1.71191 15.5048L3.90395 14.0196L5.3927 11.8329Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                            <h6>Topics</h6>
                        </div>
                        <div>
                            <ul>
                                <li onClick={() => handleTaskClick(1)}><p className='listboxCat'>Math</p></li>
                                <li onClick={() => handleTaskClick(2)}><p className='listboxCat'>Physics</p></li>
                                <li onClick={() => handleTaskClick(3)}><p className='listboxCat'>Computer</p></li>
                                <li onClick={() => handleTaskClick(4)}><p className='listboxCat'>Entertainment</p></li>
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li>
                                    {/* <svg className='selectedtask' width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.44211 4.17079L10.3246 8.28494L6.21044 12.1674" stroke="white" stroke-width="1.5"/>
                                    </svg> */}
                                    <p></p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='taskDes' /*onClick={close}*/>
                    <div className='Titles'>
                        <div className='taskName'>
                            <h6 className='Taskt'>Task:</h6>
                            <h6 className='Taskn'>{task.task_name}</h6>
                        </div>
                        <div className='catName'>
                            <h6 className='Catt'>Category:</h6>
                            <h6 className='Catn'>{task.category}</h6>
                        </div>
                    </div>
                    <div className='Divider'></div>
                    <div className='Desc'>
                        <h6 className='DescT'>Desciption</h6>
                        <p className='Descript'>{task.description}</p>
                    </div>
                    <p className='solvebutton' onClick={close}>Solve Task</p>
                </div>
            </div>
        </div>

    );
};

export default TaskPanel;

