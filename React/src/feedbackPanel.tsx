
import './feedbackPanel.css';
import { useState, useEffect, useContext } from 'react';
import TaskPanel from './taskpanel';
import { FeedbackContext } from './feedbackContext';
import { Metrics } from './models/metrics';
import FeedbackWindow from './feedbackWindow';
import TaskDesc from './taskdescription';
import { Task } from './models/task';

const FeedbackPanel = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { feedback, setFeedback } = useContext(FeedbackContext);
    const { criteria, setCriteria } = useContext(FeedbackContext);
    const { task, setTask } = useContext(FeedbackContext);
    const [initialFetch, setInitialFetch] = useState<boolean>(false);
    const [showDescription, setShowDescription] = useState(false);
    const [isRounded, setIsRounded] = useState(true);
    const [isRoundedF, setIsRoundedF] = useState(true);
    const [criterionValue, setCriterionValue] = useState(criteria.criterion_1);
    const [progressWidth, setProgressWidth] = useState(0);


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
                        <div className='optionS' onClick={toggleSidebar}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='searchsicon'>
                                <path d="M16.9265 17.0401L20.3996 20.4001M11.3996 7.2001C13.3878 7.2001 14.9996 8.81187 14.9996 10.8001M19.2796 11.4401C19.2796 15.77 15.7695 19.2801 11.4396 19.2801C7.1097 19.2801 3.59961 15.77 3.59961 11.4401C3.59961 7.11018 7.1097 3.6001 11.4396 3.6001C15.7695 3.6001 19.2796 7.11018 19.2796 11.4401Z" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <p className='pbtn'>Search Tasks</p>
                        </div>
                        <div className='mode'>
                            <p>Study mode</p>
                            <div >
                                <svg  className='togglebutton' width="27" height="19" viewBox="0 0 27 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_dd_1144_601)">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.2745 17.4376C21.9743 17.4376 25.7843 13.7943 25.7843 9.3001C25.7843 4.80588 21.9743 1.1626 17.2745 1.1626C12.5746 1.1626 8.76465 4.80588 8.76465 9.3001C8.76465 13.7943 12.5746 17.4376 17.2745 17.4376Z" fill="white"/>
                                    <path d="M17.2745 17.6876C22.1017 17.6876 26.0343 13.9428 26.0343 9.3001C26.0343 4.65739 22.1017 0.912598 17.2745 0.912598C12.4472 0.912598 8.51465 4.65739 8.51465 9.3001C8.51465 13.9428 12.4472 17.6876 17.2745 17.6876Z" stroke="black" stroke-opacity="0.04" stroke-width="0.5"/>
                                    </g>
                                    <defs>
                                    <filter id="filter0_dd_1144_601" x="0.264648" y="-4.3374" width="34.0195" height="33.2749" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="3"/>
                                    <feGaussianBlur stdDeviation="0.5"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1144_601"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dy="3"/>
                                    <feGaussianBlur stdDeviation="4"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                                    <feBlend mode="normal" in2="effect1_dropShadow_1144_601" result="effect2_dropShadow_1144_601"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_1144_601" result="shape"/>
                                    </filter>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className='rightpanel'>

                        {/* TODO: finish state magement of panels and remove unnecessary functions*/}

                        {/* <TaskPanel isOpen={isSidebarOpen} close={toggleSidebar} /> */}
                        {/* <TaskDesc isOpenD={showDescription} closeD={toggleDescription} /> */}
                        {/* <FeedbackWindow/> */}
                    </div>
                </div>
            </div>
    );
};

export default FeedbackPanel;
