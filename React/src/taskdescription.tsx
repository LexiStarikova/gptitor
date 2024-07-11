import './taskdescription.css';
import React, { useContext } from 'react';
import './taskpanel.css';
import { FeedbackContext } from './feedbackContext';
import { Task } from './models/task';
import API_URL from './config';

interface TaskDescProps {
    isOpenD: boolean;
    isOpenS: boolean;
    closeD: () => void;
}
const TaskDesc: React.FC<TaskDescProps> = ({ isOpenS, isOpenD, closeD }) => {
    const { task, setTask } = useContext(FeedbackContext);

    const handleTaskClick = (taskId: number) => {
        fetch(`${API_URL}/tasks/${taskId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTask(new Task(data.task_id, data.task_name, data.task_category, data.task_description));
            })
            .catch(error => {
                console.error('Error fetching task:', error);
            });
    };
    return (
        <div className={`DescCont${isOpenD&&!isOpenS ? '' : 'hd'}`}>
                <div className='TaskDline'>
                    <div className='close' onClick={closeD}>
                        <h6 className='CloseTask'>CLOSE</h6>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='Xclose'>
                            <path d="M17 7L7 17M17 17L7 7" stroke="#0060AE" stroke-width="2.5" stroke-linecap="round" />
                        </svg>
                    </div>
                    <div className='unlineD'></div>
                </div>
                <div className='Titlesdes'>
                        <div className='taskName'>
                            <h6 className='Taskt'>Task:</h6>
                            <h6 className='Taskn'>{task.task_name}</h6>
                        </div>
                        <div className='catName'>
                            <h6 className='Catt'>Category:</h6>
                            <h6 className='Catn'>{task.category}</h6>
                        </div>
                    </div>
                <div className='TaskD'>
                    
                    <div className='Dividers'></div>
                    <div className='DescD'>
                        <h6 className='DescT'>Desciption</h6>
                        <p className='Descript'>{task.description}</p>
                    </div>
                </div>
        </div>
    );
};

export default TaskDesc;