import './taskdescription.css';
import './taskpanel.css';
import { useTaskContext } from './taskContext';

interface TaskDescProps {
    isOpenD: boolean;
    isOpenS: boolean;
    closeD: () => void;
}
const TaskDesc: React.FC<TaskDescProps> = ({ isOpenS, isOpenD, closeD }) => {

    const { selectedTask } = useTaskContext();
    
    return (
        <div className={`DescCont${isOpenD && !isOpenS ? '' : 'hd'}`}>
            <div className='TaskDline'>
                <div className='close' onClick={closeD}>
                    <h6 className='CloseTask'>CLOSE</h6>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='Xclose'>
                        <path d="M17 7L7 17M17 17L7 7" stroke="#0060AE" stroke-width="2.5" stroke-linecap="round" />
                    </svg>
                </div>
                <div className='unlineD'></div>
            </div>
            <div className='low'>
                <div className='sec'>
                    <div className='Titlesdes'>
                        <div className='taskName'>
                            <h6 className='Taskt'>Task:</h6>
                            <h6 className='Taskn'>{selectedTask ? selectedTask.task_name : 'Choose a task'}</h6>
                        </div>
                        <div className='catName'>
                            <h6 className='Catt'>Category:</h6>
                            <h6 className='Catn'>{selectedTask ? selectedTask.category : 'Choose a category'}</h6>
                        </div>
                    </div>
                    
                </div>
                <div className='Dividers'></div>
                <div className='TaskD'>

                    
                    <div className='DescD'>
                        <h6 className='DescT'>Desciption</h6>
                        <p className='Descript'>{selectedTask ? selectedTask.description: 'Choose a task'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDesc;