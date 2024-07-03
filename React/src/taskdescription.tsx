import './taskdescription.css';
interface TaskDescProps {
    isOpenD: boolean;
    closeD: () => void;
}
const TaskDesc: React.FC<TaskDescProps> = ({ isOpenD, closeD }) => {
    return (
        <div>
            <div className={`DescCont ${isOpenD ? 'openD' : ''}`}>
                <div className='TaskDline'>
                    <div className='close' onClick={closeD}>
                        <h6 className='CloseTask'>CLOSE</h6>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='Xclose'>
                            <path d="M17 7L7 17M17 17L7 7" stroke="#0060AE" stroke-width="2.5" stroke-linecap="round" />
                        </svg>
                    </div>
                    <div className='unlineD'></div>
                </div>
                <div className='TaskD'>
                    <div className='Titles'>
                        <div className='taskName'>
                            <h6 className='Taskt'>Task:</h6>
                            <h6 className='Taskn'>Garfield</h6>
                        </div>
                        <div className='catName'>
                            <h6 className='Catt'>Category:</h6>
                            <h6 className='Catn'>Entertainment</h6>
                        </div>
                    </div>
                    <div className='Divider'></div>
                    <div className='DescD'>
                        <h6 className='DescT'>Desciption</h6>
                        <p className='Descript'>Let Garfield be your favorite cat, in order to please your cat you’ll try to give it the best care. You should write the right prompt to get relevant details of how to take care of Garfield. If you fail Garfield will get mad</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDesc;