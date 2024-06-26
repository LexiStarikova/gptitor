import React from 'react';
import './taskpanel.css';

interface TaskPanelProps {
    isOpen: boolean;
    close: () => void;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ isOpen, close }) => {
    return (
        <div className={`panel ${isOpen ? 'open' : ''}`}>
            <div className='panelcontainer'>
                <div className='blured' onClick={close}>
                </div>
                <div className='taskcontainer'>
                    <div className='Tasks'>
                        <div className='tasktitle'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.2219 14.4888L9.51081 21.5999L18.7553 11.6443L13.7775 8.7999L14.4886 2.3999L5.24414 12.3555L10.2219 14.4888Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <h6>Suggested</h6>
                        </div>
                        <ul>
                            <li><p className='listbox'>Task 1</p></li>
                            <li><p className='listbox'>Task 1</p></li>
                            <li><p className='listbox'>Task 1</p></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default TaskPanel;

