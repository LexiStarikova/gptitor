
import './feedbackPanel.css';
import { useState, useEffect, useContext } from 'react';
import TaskPanel from './taskpanel';
import { FeedbackContext } from './feedbackContext';
import { Metrics } from './models/metrics';
import FeedbackWindow from './feedbackWindow';
import TaskDesc from './taskdescription';
import NotStudyMode from './notstudymode';

interface TaskPanelProps {
    isOpenS: boolean;
    close: () => void;

    isOpenD: boolean;
    closeD: () => void;
}

// const FeedbackPanel = () => {
const FeedbackPanel: React.FC<TaskPanelProps> = ({ isOpenS, close, isOpenD, closeD }) => {

    // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isFeedbackOpen, setFeedbackOpen] = useState(true);
    const { setFeedback } = useContext(FeedbackContext);
    const { criteria, setCriteria } = useContext(FeedbackContext);
    const { setTask } = useContext(FeedbackContext);
    // const [showDescription, setShowDescription] = useState(false);
    const [isStudyMode, setIsStudyMode] = useState(true);



    const toggleStudyMode = () => {
        setIsStudyMode(!isStudyMode);
        if (isOpenS)
            close();
        if (isOpenD)
            closeD();
    };
    const toggleSidebar = () => {
        close();
    };

    const resetFeedback = () => {
        setFeedback('');
    };

    const resetScore = () => {
        setCriteria(new Metrics(0.0, "", 0.0, "", 0.0, "", 0.0, ""));
    };

    const toggleDescription = () => {
        closeD();
    };

    useEffect(() => {
        resetFeedback();
        resetScore();
    }, [setFeedback, setCriteria, setTask]);


    return (
        <div className='feedbackbigcontainter'>
            <div className='optioncontainer'>
                <div className='have_a_GOOD_DAY'>
                    {isStudyMode ? (
                        <div className='optionS' onClick={toggleSidebar}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='searchsicon'>
                                <path d="M16.9265 17.0401L20.3996 20.4001M11.3996 7.2001C13.3878 7.2001 14.9996 8.81187 14.9996 10.8001M19.2796 11.4401C19.2796 15.77 15.7695 19.2801 11.4396 19.2801C7.1097 19.2801 3.59961 15.77 3.59961 11.4401C3.59961 7.11018 7.1097 3.6001 11.4396 3.6001C15.7695 3.6001 19.2796 7.11018 19.2796 11.4401Z" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <p className='pbtn'>Search Tasks</p>
                        </div>
                    ) : (
                        <div className='optionF'>
                            <p className='pbtn'>Feedback</p>
                        </div>
                    )}
                    <div className='mode'>
                        <p>STUDY MODE</p>
                        <label className="switch">
                            <input type="checkbox" checked={isStudyMode} onChange={toggleStudyMode} />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
                <div className='rightpanel'>


                    <TaskPanel isOpenS={isOpenS} close={toggleSidebar} />
                    {isStudyMode ? (
                        <FeedbackWindow isOpenS={isOpenS} isOpenF={isFeedbackOpen} isOpenD={isOpenD} closeF={toggleDescription} />
                    ) : (
                        <NotStudyMode isOpenS={isOpenS} isOpenF={isFeedbackOpen} isOpenD={isOpenD} closeF={toggleDescription} />
                    )}
                    <TaskDesc isOpenS={isOpenS} isOpenD={isOpenD} closeD={toggleDescription} />
                </div>
            </div>
        </div>
    );
};

export default FeedbackPanel;
