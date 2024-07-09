
import './feedbackPanel.css';
import { useState, useEffect, useContext } from 'react';
import TaskPanel from './taskpanel';
import { FeedbackContext } from './feedbackContext';
import { Metrics } from './models/metrics';
import FeedbackWindow from './feedbackWindow';
import TaskDesc from './taskdescription';
import NotStudyMode from './notstudymode';
import { Task } from './models/task';

const FeedbackPanel = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isFeedbackOpen, setFeedbackOpen] = useState(true);
    const { feedback, setFeedback } = useContext(FeedbackContext);
    const { criteria, setCriteria } = useContext(FeedbackContext);
    const { task, setTask } = useContext(FeedbackContext);
    const [initialFetch, setInitialFetch] = useState<boolean>(false);
    const [showDescription, setShowDescription] = useState(false);
    const [isRounded, setIsRounded] = useState(true);
    const [isRoundedF, setIsRoundedF] = useState(true);
    const [criterionValue, setCriterionValue] = useState(criteria.criterion_1);
    const [progressWidth, setProgressWidth] = useState(0);
    const [isStudyMode, setIsStudyMode] = useState(true);


    useEffect(() => {
        if (!initialFetch) {
            fetch(`http://10.100.30.244:8000/tasks/1`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setTask({
                        task_id: data.task_id,
                        task_name: data.task_name,
                        category: data.category,
                        description: data.description,
                    });
                    setInitialFetch(true);
                })
                .catch(error => {
                    console.error('Error fetching task:', error);
                });
        }
    }, [initialFetch, task.task_id]);

    const toggleStudyMode = () => {
        setIsStudyMode(!isStudyMode);
    };
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const resetFeedback = () => {
        setFeedback('');
    };

    const resetScore = () => {
        setCriteria(new Metrics(0.0, 0.0, 0.0, 0.0));
    };

    const toggleDescription = () => {
        setShowDescription(!showDescription);
        // setFeedbackOpen(!isFeedbackOpen);
    };

    const toggleFeedback = () => {
        setFeedbackOpen(!isFeedbackOpen);
    };

    useEffect(() => {
        resetFeedback();
        resetScore();
    }, [setFeedback, setCriteria, setTask]);

    const returnOverallScore = () => {
        let score = ((criteria.criterion_1
            + criteria.criterion_2
            + criteria.criterion_3
            + criteria.criterion_4) / 20 * 5)
        if (score % 1 === 0) return score.toFixed(0)
        else return score.toFixed(1)
    }

    const returnFloatOrNum = (criterion: number) => {
        if (criterion % 1 === 0) return criterion.toFixed(0)
        else return criterion.toFixed(1)
    }

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


                    <TaskPanel isOpenS={isSidebarOpen} close={toggleSidebar} />
                    {isStudyMode ? (
                        <FeedbackWindow isOpenS={isSidebarOpen} isOpenF={isFeedbackOpen} isOpenD={showDescription} closeF={toggleDescription} />
                    ) : (
                        <NotStudyMode isOpenS={isSidebarOpen} isOpenF={isFeedbackOpen} isOpenD={showDescription} closeF={toggleDescription} />
                    )}
                    <TaskDesc isOpenS={isSidebarOpen} isOpenD={showDescription} closeD={toggleDescription} />
                </div>
            </div>
        </div>
    );
};

export default FeedbackPanel;
