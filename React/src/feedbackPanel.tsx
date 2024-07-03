<<<<<<< Updated upstream
import './feedbackPanel.css';
import { useState, useEffect, useContext } from 'react';
import TaskPanel from './taskpanel';
import { FeedbackContext } from './feedbackContext';
import { Metrics } from './models/metrics';
import { Task } from './models/task';

const FeedbackPanel = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { feedback, setFeedback } = useContext(FeedbackContext);
    const { criteria, setCriteria } = useContext(FeedbackContext);
    const [ averageScore, setAverageScore ] = useState(0.0);
    const { task, setTask } = useContext(FeedbackContext);
    const [initialFetch, setInitialFetch] = useState<boolean>(false);
    const [showDescription, setShowDescription] = useState(true);
    const [showFDescription, setShowFDescription] = useState(true);
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
        console.log('Toggling sidebar');
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
        if (criterionValue >= 0 && criterionValue <= 5) {
            setProgressWidth((criterionValue / 5) * 100);
        }
        resetFeedback();
        resetScore();
    }, [setFeedback, setCriteria, setTask, criterionValue]);

    const toggleBorderRadius = () => {
        setIsRounded(!isRounded);
    };

    return (
        <div>
            <div className='feedbackbigcontainter'>
                <div className='optionContainer'>
                    <div className='option' onClick={toggleSidebar}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='searchsicon'>
                            <path d="M16.9265 17.0401L20.3996 20.4001M11.3996 7.2001C13.3878 7.2001 14.9996 8.81187 14.9996 10.8001M19.2796 11.4401C19.2796 15.77 15.7695 19.2801 11.4396 19.2801C7.1097 19.2801 3.59961 15.77 3.59961 11.4401C3.59961 7.11018 7.1097 3.6001 11.4396 3.6001C15.7695 3.6001 19.2796 7.11018 19.2796 11.4401Z" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <TaskPanel isOpen={isSidebarOpen} close={toggleSidebar} />
                    </div>
                    <div className='option1'>
                        <p>Task {task.task_id}</p>
                    </div>
                </div>
                <div className='feedbackcontainer'>
                    <div className='Desccontainer'>
                        <div className={`DescTitle ${isRounded ? 'rounded' : ''}`} onClick={() => { toggleDescription(); toggleBorderRadius(); }}>
                            <p>Description</p>
                        </div>
                        <div className={`TaskDesc ${showDescription ? 'show' : 'hide'}`}>
                            {/* <p>Let Garfield be your favorite cat, in order to please your cat you’ll try to give it the best care. You should write the right prompt to get relevant details of how to take care of Garfield. If you fail Garfield will get mad</p> */}
                            <p>{task.description}</p>
                        </div>
                    </div>
                    <h4 className='res'>Results:</h4>
                    <div className={`scoreBoxes ${isRounded ? 'rounded' : ''}`}>
                        <div className='progressbar-rounded'>
                            <div className='progressbar-rounded-base-circle' style={{ background : 
                            `radial-gradient(closest-side, white 80%, transparent 80% 100%),
                                conic-gradient(#0060AE ${((criteria.criterion_1+criteria.criterion_2+criteria.criterion_3+criteria.criterion_4)/2*10).toFixed(0)}%, #D3EBFF 0)`}}>
                                <h3 className='progressbar-rounded-score'>{((criteria.criterion_1+criteria.criterion_2+criteria.criterion_3+criteria.criterion_4)/4).toFixed(0)}/5</h3>
                            </div>
                        </div>
                        <div className='criterias'>
                            <div className='criteriaBoxF'>
                                <div className='infoiconcrit crittooltip-containerF'>
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    <p className='crittooltipF'>The prompt should be concise and focused on a specific topic or question. Long, convoluted prompts can confuse the LLM and result in less coherent answers.</p>
                                </div>
                                <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                    <rect y="0.975586" width="40" height="40" rx="20" fill="#2287DA" />
                                    <path d="M20 23.6006C19.385 23.6006 18.875 23.0906 18.875 22.4756V14.9756C18.875 14.3606 19.385 13.8506 20 13.8506C20.615 13.8506 21.125 14.3606 21.125 14.9756V22.4756C21.125 23.0906 20.615 23.6006 20 23.6006Z" fill="white" />
                                    <path d="M20 28.4757C19.805 28.4757 19.61 28.4307 19.43 28.3557C19.25 28.2807 19.085 28.1757 18.935 28.0407C18.8 27.8907 18.695 27.7407 18.62 27.5457C18.545 27.3657 18.5 27.1707 18.5 26.9757C18.5 26.7807 18.545 26.5857 18.62 26.4057C18.695 26.2257 18.8 26.0607 18.935 25.9107C19.085 25.7757 19.25 25.6707 19.43 25.5957C19.79 25.4457 20.21 25.4457 20.57 25.5957C20.75 25.6707 20.915 25.7757 21.065 25.9107C21.2 26.0607 21.305 26.2257 21.38 26.4057C21.455 26.5857 21.5 26.7807 21.5 26.9757C21.5 27.1707 21.455 27.3657 21.38 27.5457C21.305 27.7407 21.2 27.8907 21.065 28.0407C20.915 28.1757 20.75 28.2807 20.57 28.3557C20.39 28.4307 20.195 28.4757 20 28.4757Z" fill="white" />
                                </svg>
                                <div className='barF'>
                                    <div className='critdescF'>
                                        <h6>{criteria.criterion_1.toFixed(0)}/5</h6>
                                        <p className='p5'>Conciseness & Focus</p>
                                    </div>
                                    <div className='progbarF'>
                                        <div className='progressbar-internals' style={{ width: `${(criteria.criterion_1/5*100).toFixed(0)}%`, backgroundColor: '#0060AE', height: '100%', borderRadius: '64px' }}></div>
                                    </div>
                                </div>
                                <div className='detailsF'>
                                    <p className='p5'>More Details &lt;</p>
                                </div>
                            </div>
                            <div>
                                <div className='criteriaBoxF'>
                                    <div className='infoiconcrit crittooltip-containerF'>
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>


                                        <p className='crittooltipF'>The prompt should be clear and specific, leaving little room for ambiguity. Vague or broad prompts can lead to off-target or generalized responses.</p>
                                    </div>
                                    <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                        <rect x="1" y="1.71948" width="38" height="38" rx="19" fill="white" />
                                        <rect x="1" y="1.71948" width="38" height="38" rx="19" stroke="#2287DA" stroke-width="2" />
                                        <circle cx="20" cy="20.7195" r="4.5" fill="#2287DA" />
                                    </svg>

                                    <div className='barF'>
                                        <div className='critdescF'>
                                            <h6>{criteria.criterion_2.toFixed(0)}/5</h6>
                                            <p className='p5'>Clarity & Specificity</p>
                                        </div>
                                        <div className='progbarF'>
                                            <div className='progressbar-internals' style={{ width: `${(criteria.criterion_2/5*100).toFixed(0)}%`, backgroundColor: '#0060AE', height: '100%', borderRadius: '64px' }}></div>
                                        </div>
                                    </div>
                                    <div className='detailsF'>
                                        <p className='p5'>More Details &lt;</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='criteriaBoxF'>
                                    <div className='infoiconcrit crittooltip-containerF'>
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                        <p className='crittooltipF'>The prompt should include relevant context to guide the LLM. Providing necessary background information can help the model generate a more accurate and pertinent response.</p>
                                    </div>
                                    <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                        <rect y="0.804932" width="40" height="40" rx="20" fill="#2287DA" />
                                        <path d="M15.755 26.175C15.47 26.175 15.185 26.07 14.96 25.845C14.525 25.41 14.525 24.69 14.96 24.255L23.45 15.765C23.885 15.33 24.605 15.33 25.04 15.765C25.475 16.2 25.475 16.92 25.04 17.355L16.55 25.845C16.34 26.07 16.04 26.175 15.755 26.175Z" fill="white" />
                                        <path d="M24.245 26.175C23.96 26.175 23.675 26.07 23.45 25.845L14.96 17.355C14.525 16.92 14.525 16.2 14.96 15.765C15.395 15.33 16.115 15.33 16.55 15.765L25.04 24.255C25.475 24.69 25.475 25.41 25.04 25.845C24.815 26.07 24.53 26.175 24.245 26.175Z" fill="white" />
                                    </svg>


                                    <div className='barF'>
                                        <div className='critdescF'>
                                            <h6>{criteria.criterion_3.toFixed(0)}/5</h6>
                                            <p className='p5'>Relevance & Context</p>
                                        </div>
                                        <div className='progbarF'>
                                            <div className='progressbar-internals' style={{ width: `${(criteria.criterion_3/5*100).toFixed(0)}%`, backgroundColor: '#0060AE', height: '100%', borderRadius: '64px' }}></div>
                                        </div>
                                    </div>
                                    <div className='detailsF'>
                                        <p className='p5'>More Details &lt;</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='criteriaBoxF'>
                                    <div className='infoiconcrit crittooltip-containerF'>
                                        <svg width="21" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                        <p className='crittooltipF'>The prompt should clearly state the desired output or purpose of the response. This helps the LLM understand the expected format and detail level.</p>
                                    </div>
                                    <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                        <rect y="0.890137" width="40" height="40" rx="20" fill="#2287DA" />
                                        <path d="M17.8702 26.26C17.5702 26.26 17.2852 26.14 17.0752 25.93L12.8302 21.685C12.3952 21.25 12.3952 20.53 12.8302 20.095C13.2652 19.66 13.9852 19.66 14.4202 20.095L17.8702 23.545L25.5802 15.835C26.0152 15.4 26.7352 15.4 27.1702 15.835C27.6052 16.27 27.6052 16.99 27.1702 17.425L18.6652 25.93C18.4552 26.14 18.1702 26.26 17.8702 26.26Z" fill="white" />
                                    </svg>

                                    <div className='barF'>
                                        <div className='critdescF'>
                                            <h6>{criteria.criterion_4.toFixed(0)}/5</h6>
                                            <p className='p5'>Purpose & Output</p>
                                        </div>
                                        <div className='progbarF'>
                                            <div className='progressbar-internals' style={{ width: `${(criteria.criterion_4/5*100).toFixed(0)}%`, backgroundColor: '#0060AE', height: '100%', borderRadius: '64px' }}></div>
                                        </div>
                                    </div>
                                    <div className='detailsF'>
                                        <p className='p5'>More Details &lt;</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='FeedContainer'>
                        <div className={`FeedTitle ${isRounded ? 'roundede' : ''}`} onClick={() => { toggleDescription(); toggleBorderRadius(); }}>
                            <h6>Feedback</h6>
                        </div>
                        {feedback ? (
                            <div className={`FeedDesc ${showDescription ? 'show' : 'hide'}`}>
                                <p>{feedback}</p>
                            </div>
                        ) : (
                            <div className={`FeedDesc ${showDescription ? 'show' : 'hide'}`}>
                                <p>Write The Prompt there to get your Feedback here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default FeedbackPanel;
=======
import './feedbackPanel.css';
import { useState, useEffect, useContext } from 'react';
import TaskPanel from './taskpanel';
import { FeedbackContext } from './feedbackContext';
import { Metrics } from './models/metrics';
import TaskDesc from './taskdescription';

const FeedbackPanel = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { feedback, setFeedback } = useContext(FeedbackContext);
    const { criteria, setCriteria } = useContext(FeedbackContext);
    const { task, setTask } = useContext(FeedbackContext);
    const [initialFetch, setInitialFetch] = useState<boolean>(false);
    const [showDescription, setShowDescription] = useState(false);
    const [isRounded, setIsRounded] = useState(true);

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

    return (
        <div>
            <div className='feedbackbigcontainter'>
                <div className='optionContainer'>
                    <div className='option' onClick={toggleSidebar}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='searchsicon'>
                            <path d="M16.9265 17.0401L20.3996 20.4001M11.3996 7.2001C13.3878 7.2001 14.9996 8.81187 14.9996 10.8001M19.2796 11.4401C19.2796 15.77 15.7695 19.2801 11.4396 19.2801C7.1097 19.2801 3.59961 15.77 3.59961 11.4401C3.59961 7.11018 7.1097 3.6001 11.4396 3.6001C15.7695 3.6001 19.2796 7.11018 19.2796 11.4401Z" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <TaskPanel isOpen={isSidebarOpen} close={toggleSidebar} />
                    </div>
                    <div className='option1'>
                        <p>Task {task.task_id}</p>
                    </div>
                </div>
                <TaskDesc isOpenD={showDescription} closeD={toggleDescription} />
                <div className='feedbackcontainer'>
                    <div>
                        <h6 className='viewTask' onClick={toggleDescription}>View Task</h6>
                        <div className='unline'></div>
                    </div>
                    <h4 className='res'>Results:</h4>
                    <div className={`scoreBoxes ${isRounded ? 'rounded' : ''}`}>
                        <div><svg width="189" height="190" viewBox="0 0 189 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M189 95C189 147.467 146.691 190 94.5 190C42.3091 190 0 147.467 0 95C0 42.5329 42.3091 0 94.5 0C146.691 0 189 42.5329 189 95ZM18.9 95C18.9 136.974 52.7473 171 94.5 171C136.253 171 170.1 136.974 170.1 95C170.1 53.0264 136.253 19 94.5 19C52.7473 19 18.9 53.0264 18.9 95Z" fill="#D3EBFF" />
                            <path d="M94.5 9.5C94.5 4.25329 98.764 -0.0496929 103.984 0.479621C113.14 1.4081 122.13 3.67799 130.664 7.23145C142.129 12.0056 152.546 19.0033 161.322 27.8249C170.097 36.6464 177.058 47.1192 181.807 58.6451C185.354 67.2548 187.616 76.3262 188.533 85.5654C189.048 90.7589 184.769 95 179.55 95C174.331 95 170.16 90.7532 169.516 85.574C168.678 78.8322 166.942 72.2194 164.345 65.9161C160.546 56.6953 154.977 48.3171 147.957 41.2599C140.937 34.2026 132.603 28.6045 123.431 24.7852C117.191 22.187 110.647 20.4466 103.975 19.5992C98.7699 18.9382 94.5 14.7467 94.5 9.5Z" fill="#2287DA" />
                            <path d="M56.516 85.7839C54.724 85.7839 53.0067 85.5492 51.364 85.0799C49.7213 84.5892 48.3987 83.9599 47.396 83.1919L49.156 79.2879C50.116 79.9706 51.2467 80.5359 52.548 80.9839C53.8707 81.4106 55.204 81.6239 56.548 81.6239C57.572 81.6239 58.3933 81.5279 59.012 81.3359C59.652 81.1226 60.1213 80.8346 60.42 80.4719C60.7187 80.1092 60.868 79.6932 60.868 79.2239C60.868 78.6266 60.6333 78.1572 60.164 77.8159C59.6947 77.4532 59.076 77.1652 58.308 76.9519C57.54 76.7172 56.6867 76.5039 55.748 76.3119C54.8307 76.0986 53.9027 75.8426 52.964 75.5439C52.0467 75.2452 51.204 74.8612 50.436 74.3919C49.668 73.9226 49.0387 73.3039 48.548 72.5359C48.0787 71.7679 47.844 70.7866 47.844 69.5919C47.844 68.3119 48.1853 67.1492 48.868 66.1039C49.572 65.0372 50.6173 64.1946 52.004 63.5759C53.412 62.9359 55.172 62.6159 57.284 62.6159C58.692 62.6159 60.0787 62.7866 61.444 63.1279C62.8093 63.4479 64.0147 63.9386 65.06 64.5999L63.46 68.5359C62.4147 67.9386 61.3693 67.5012 60.324 67.2239C59.2787 66.9252 58.2547 66.7759 57.252 66.7759C56.2493 66.7759 55.428 66.8932 54.788 67.1279C54.148 67.3626 53.6893 67.6719 53.412 68.0559C53.1347 68.4186 52.996 68.8452 52.996 69.3359C52.996 69.9119 53.2307 70.3812 53.7 70.7439C54.1693 71.0852 54.788 71.3626 55.556 71.5759C56.324 71.7892 57.1667 72.0026 58.084 72.2159C59.0227 72.4292 59.9507 72.6746 60.868 72.9519C61.8067 73.2292 62.66 73.6026 63.428 74.0719C64.196 74.5412 64.8147 75.1599 65.284 75.9279C65.7747 76.6959 66.02 77.6666 66.02 78.8399C66.02 80.0986 65.668 81.2506 64.964 82.2959C64.26 83.3412 63.204 84.1839 61.796 84.8239C60.4093 85.4639 58.6493 85.7839 56.516 85.7839ZM77.9303 85.6559C76.0742 85.6559 74.4209 85.2826 72.9702 84.5359C71.5196 83.7679 70.3782 82.7119 69.5462 81.3679C68.7356 80.0239 68.3302 78.4986 68.3302 76.7919C68.3302 75.0639 68.7356 73.5386 69.5462 72.2159C70.3782 70.8719 71.5196 69.8266 72.9702 69.0799C74.4209 68.3119 76.0742 67.9279 77.9303 67.9279C79.7436 67.9279 81.3223 68.3119 82.6663 69.0799C84.0103 69.8266 85.0023 70.9039 85.6423 72.3119L81.7703 74.3919C81.3223 73.5812 80.7569 72.9839 80.0743 72.5999C79.4129 72.2159 78.6876 72.0239 77.8983 72.0239C77.0449 72.0239 76.2769 72.2159 75.5942 72.5999C74.9116 72.9839 74.3676 73.5279 73.9622 74.2319C73.5782 74.9359 73.3863 75.7892 73.3863 76.7919C73.3863 77.7946 73.5782 78.6479 73.9622 79.3519C74.3676 80.0559 74.9116 80.5999 75.5942 80.9839C76.2769 81.3679 77.0449 81.5599 77.8983 81.5599C78.6876 81.5599 79.4129 81.3786 80.0743 81.0159C80.7569 80.6319 81.3223 80.0239 81.7703 79.1919L85.6423 81.3039C85.0023 82.6906 84.0103 83.7679 82.6663 84.5359C81.3223 85.2826 79.7436 85.6559 77.9303 85.6559ZM96.8897 85.6559C95.0551 85.6559 93.4231 85.2719 91.9937 84.5039C90.5857 83.7359 89.4657 82.6906 88.6337 81.3679C87.8231 80.0239 87.4177 78.4986 87.4177 76.7919C87.4177 75.0639 87.8231 73.5386 88.6337 72.2159C89.4657 70.8719 90.5857 69.8266 91.9937 69.0799C93.4231 68.3119 95.0551 67.9279 96.8897 67.9279C98.7031 67.9279 100.324 68.3119 101.754 69.0799C103.183 69.8266 104.303 70.8612 105.114 72.1839C105.924 73.5066 106.33 75.0426 106.33 76.7919C106.33 78.4986 105.924 80.0239 105.114 81.3679C104.303 82.6906 103.183 83.7359 101.754 84.5039C100.324 85.2719 98.7031 85.6559 96.8897 85.6559ZM96.8897 81.5599C97.7217 81.5599 98.4684 81.3679 99.1298 80.9839C99.7911 80.5999 100.314 80.0559 100.698 79.3519C101.082 78.6266 101.274 77.7732 101.274 76.7919C101.274 75.7892 101.082 74.9359 100.698 74.2319C100.314 73.5279 99.7911 72.9839 99.1298 72.5999C98.4684 72.2159 97.7217 72.0239 96.8897 72.0239C96.0577 72.0239 95.3111 72.2159 94.6497 72.5999C93.9884 72.9839 93.4551 73.5279 93.0497 74.2319C92.6657 74.9359 92.4737 75.7892 92.4737 76.7919C92.4737 77.7732 92.6657 78.6266 93.0497 79.3519C93.4551 80.0559 93.9884 80.5999 94.6497 80.9839C95.3111 81.3679 96.0577 81.5599 96.8897 81.5599ZM110.067 85.3999V68.1839H114.835V73.0479L114.163 71.6399C114.675 70.4239 115.496 69.5066 116.627 68.8879C117.757 68.2479 119.133 67.9279 120.755 67.9279V72.5359C120.541 72.5146 120.349 72.5039 120.179 72.5039C120.008 72.4826 119.827 72.4719 119.635 72.4719C118.269 72.4719 117.16 72.8666 116.307 73.6559C115.475 74.4239 115.059 75.6292 115.059 77.2719V85.3999H110.067ZM132.542 85.6559C130.579 85.6559 128.851 85.2719 127.358 84.5039C125.886 83.7359 124.744 82.6906 123.934 81.3679C123.123 80.0239 122.718 78.4986 122.718 76.7919C122.718 75.0639 123.112 73.5386 123.902 72.2159C124.712 70.8719 125.811 69.8266 127.198 69.0799C128.584 68.3119 130.152 67.9279 131.902 67.9279C133.587 67.9279 135.102 68.2906 136.446 69.0159C137.811 69.7199 138.888 70.7439 139.678 72.0879C140.467 73.4106 140.862 74.9999 140.862 76.8559C140.862 77.0479 140.851 77.2719 140.83 77.5279C140.808 77.7626 140.787 77.9866 140.766 78.1999H126.782V75.2879H138.142L136.222 76.1519C136.222 75.2559 136.04 74.4772 135.678 73.8159C135.315 73.1546 134.814 72.6426 134.174 72.2799C133.534 71.8959 132.787 71.7039 131.934 71.7039C131.08 71.7039 130.323 71.8959 129.662 72.2799C129.022 72.6426 128.52 73.1652 128.158 73.8479C127.795 74.5092 127.614 75.2986 127.614 76.2159V76.9839C127.614 77.9226 127.816 78.7546 128.222 79.4799C128.648 80.1839 129.235 80.7279 129.982 81.1119C130.75 81.4746 131.646 81.6559 132.67 81.6559C133.587 81.6559 134.387 81.5172 135.07 81.2399C135.774 80.9626 136.414 80.5466 136.99 79.9919L139.646 82.8719C138.856 83.7679 137.864 84.4612 136.67 84.9519C135.475 85.4212 134.099 85.6559 132.542 85.6559Z" fill="#59657D" />
                            <path d="M68.3115 120.725V118L76.5615 106.9H80.8115L72.7365 118L70.7615 117.425H84.5365V120.725H68.3115ZM77.7365 124.4V120.725L77.8615 117.425V114.15H81.6865V124.4H77.7365ZM84.1338 126.9L92.3838 103.35H95.8588L87.6088 126.9H84.1338ZM98.7807 124.4V108.4L100.531 110.15H95.2807V106.9H102.831V124.4H98.7807ZM112.971 124.7C111.537 124.7 110.254 124.35 109.121 123.65C107.987 122.933 107.096 121.9 106.446 120.55C105.796 119.2 105.471 117.567 105.471 115.65C105.471 113.733 105.796 112.1 106.446 110.75C107.096 109.4 107.987 108.375 109.121 107.675C110.254 106.958 111.537 106.6 112.971 106.6C114.421 106.6 115.704 106.958 116.821 107.675C117.954 108.375 118.846 109.4 119.496 110.75C120.146 112.1 120.471 113.733 120.471 115.65C120.471 117.567 120.146 119.2 119.496 120.55C118.846 121.9 117.954 122.933 116.821 123.65C115.704 124.35 114.421 124.7 112.971 124.7ZM112.971 121.275C113.654 121.275 114.246 121.083 114.746 120.7C115.262 120.317 115.662 119.708 115.946 118.875C116.246 118.042 116.396 116.967 116.396 115.65C116.396 114.333 116.246 113.258 115.946 112.425C115.662 111.592 115.262 110.983 114.746 110.6C114.246 110.217 113.654 110.025 112.971 110.025C112.304 110.025 111.712 110.217 111.196 110.6C110.696 110.983 110.296 111.592 109.996 112.425C109.712 113.258 109.571 114.333 109.571 115.65C109.571 116.967 109.712 118.042 109.996 118.875C110.296 119.708 110.696 120.317 111.196 120.7C111.712 121.083 112.304 121.275 112.971 121.275Z" fill="#12152A" />
                        </svg>
                        </div>
                        <div className='criterias'>
                            <div className='criteriaBoxF'>
                                <div className='infoiconcrit crittooltip-containerF'>
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    <p className='crittooltipF'>Ah Yes, Criteria Description.</p>
                                </div>
                                <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                    <rect y="0.975586" width="40" height="40" rx="20" fill="#2287DA" />
                                    <path d="M20 23.6006C19.385 23.6006 18.875 23.0906 18.875 22.4756V14.9756C18.875 14.3606 19.385 13.8506 20 13.8506C20.615 13.8506 21.125 14.3606 21.125 14.9756V22.4756C21.125 23.0906 20.615 23.6006 20 23.6006Z" fill="white" />
                                    <path d="M20 28.4757C19.805 28.4757 19.61 28.4307 19.43 28.3557C19.25 28.2807 19.085 28.1757 18.935 28.0407C18.8 27.8907 18.695 27.7407 18.62 27.5457C18.545 27.3657 18.5 27.1707 18.5 26.9757C18.5 26.7807 18.545 26.5857 18.62 26.4057C18.695 26.2257 18.8 26.0607 18.935 25.9107C19.085 25.7757 19.25 25.6707 19.43 25.5957C19.79 25.4457 20.21 25.4457 20.57 25.5957C20.75 25.6707 20.915 25.7757 21.065 25.9107C21.2 26.0607 21.305 26.2257 21.38 26.4057C21.455 26.5857 21.5 26.7807 21.5 26.9757C21.5 27.1707 21.455 27.3657 21.38 27.5457C21.305 27.7407 21.2 27.8907 21.065 28.0407C20.915 28.1757 20.75 28.2807 20.57 28.3557C20.39 28.4307 20.195 28.4757 20 28.4757Z" fill="white" />
                                </svg>
                                <div className='barF'>
                                    <div className='critdescF'>
                                        <h6>{criteria.criterion_1}/5</h6>
                                        <p className='p5'>Averaga Criteria</p>
                                    </div>
                                    <div className='progbarF'></div>
                                </div>
                                <div className='detailsF'>
                                    <p className='p5'>More Details &lt;</p>
                                </div>
                            </div>
                            <div>
                                <div className='criteriaBoxF'>
                                    <div className='infoiconcrit crittooltip-containerF'>
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>


                                        <p className='crittooltipF'>Ah Yes, Criteria Description.</p>
                                    </div>
                                    <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                        <rect x="1" y="1.71948" width="38" height="38" rx="19" fill="white" />
                                        <rect x="1" y="1.71948" width="38" height="38" rx="19" stroke="#2287DA" stroke-width="2" />
                                        <circle cx="20" cy="20.7195" r="4.5" fill="#2287DA" />
                                    </svg>

                                    <div className='barF'>
                                        <div className='critdescF'>
                                            <h6>{criteria.criterion_2}/5</h6>
                                            <p className='p5'>Averaga Criteria</p>
                                        </div>
                                        <div className='progbarF'></div>
                                    </div>
                                    <div className='detailsF'>
                                        <p className='p5'>More Details &lt;</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='criteriaBoxF'>
                                    <div className='infoiconcrit crittooltip-containerF'>
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                        <p className='crittooltipF'>Ah Yes, Criteria Description.</p>
                                    </div>
                                    <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                        <rect y="0.804932" width="40" height="40" rx="20" fill="#2287DA" />
                                        <path d="M15.755 26.175C15.47 26.175 15.185 26.07 14.96 25.845C14.525 25.41 14.525 24.69 14.96 24.255L23.45 15.765C23.885 15.33 24.605 15.33 25.04 15.765C25.475 16.2 25.475 16.92 25.04 17.355L16.55 25.845C16.34 26.07 16.04 26.175 15.755 26.175Z" fill="white" />
                                        <path d="M24.245 26.175C23.96 26.175 23.675 26.07 23.45 25.845L14.96 17.355C14.525 16.92 14.525 16.2 14.96 15.765C15.395 15.33 16.115 15.33 16.55 15.765L25.04 24.255C25.475 24.69 25.475 25.41 25.04 25.845C24.815 26.07 24.53 26.175 24.245 26.175Z" fill="white" />
                                    </svg>


                                    <div className='barF'>
                                        <div className='critdescF'>
                                            <h6>{criteria.criterion_3}/5</h6>
                                            <p className='p5'>Averaga Criteria</p>
                                        </div>
                                        <div className='progbarF'></div>
                                    </div>
                                    <div className='detailsF'>
                                        <p className='p5'>More Details &lt;</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='criteriaBoxF'>
                                    <div className='infoiconcrit crittooltip-containerF'>
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                        <p className='crittooltipF'>Ah Yes, Criteria Description.</p>
                                    </div>
                                    <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                        <rect y="0.890137" width="40" height="40" rx="20" fill="#2287DA" />
                                        <path d="M17.8702 26.26C17.5702 26.26 17.2852 26.14 17.0752 25.93L12.8302 21.685C12.3952 21.25 12.3952 20.53 12.8302 20.095C13.2652 19.66 13.9852 19.66 14.4202 20.095L17.8702 23.545L25.5802 15.835C26.0152 15.4 26.7352 15.4 27.1702 15.835C27.6052 16.27 27.6052 16.99 27.1702 17.425L18.6652 25.93C18.4552 26.14 18.1702 26.26 17.8702 26.26Z" fill="white" />
                                    </svg>

                                    <div className='barF'>
                                        <div className='critdescF'>
                                            <h6>{criteria.criterion_4}/5</h6>
                                            <p className='p5'>Averaga Criteria</p>
                                        </div>
                                        <div className='progbarF'></div>
                                    </div>
                                    <div className='detailsF'>
                                        <p className='p5'>More Details &lt;</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='FeedContainer'>
                        <div className="FeedTitle">
                            <h6>Feedback</h6>
                        </div>
                        {feedback ? (
                            <div className={`FeedDesc ${showDescription ? 'show' : 'hide'}`}>
                                <p>{feedback}</p>
                            </div>
                        ) : (
                            <div className={`FeedDesc ${showDescription ? 'show' : 'hide'}`}>
                                <p>Write The Prompt there to get your Feedback here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default FeedbackPanel;
>>>>>>> Stashed changes
