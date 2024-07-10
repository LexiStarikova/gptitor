




import { useState, useEffect, useContext } from 'react';
import { FeedbackContext } from './feedbackContext';
import { Metrics } from './models/metrics';
import './feedbackWindow.css'
import TaskDesc from './taskdescription';
import { Task } from './models/task';


interface NotStudyModeProps {
    isOpenF: boolean;
    isOpenD: boolean;
    isOpenS: boolean;
    closeF: () => void;
}

const NotStudyMode: React.FC<NotStudyModeProps> = ({ isOpenF, isOpenD, isOpenS, closeF }) => {


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
        <div className={`feedbackcontainer${isOpenF && !isOpenD && !isOpenS ? 'open' : ''}`}>
            <div className='TaskDlinex'>
                <h6 className='titleRT'><strong>Real-Time Feedback</strong></h6>
                <div className='unlineDx'></div>
            </div>

            <div className='lowpart'>
                <h4 className='res'>Results:</h4>
                <div className={`hg ${isRounded ? 'rounded' : ''}`}>
                    
                    <div className='values'>
                        <div className='progressbar-score'>
                            <div className='progressbar-internals'
                                style={{
                                    background:
                                        `radial-gradient(closest-side, white 80%, transparent 80% 100%),
                                            conic-gradient(#0060AE ${((criteria.criterion_1
                                            + criteria.criterion_2
                                            + criteria.criterion_3
                                            + criteria.criterion_4) * 5)}%, #D3EBFF 0)`
                                }}>
                                <h3 className='c'>{returnOverallScore()}/5</h3>
                            </div>
                        </div>
                        <div className='sup'>
                            <div className='criterias'>
                                <div className='criteriaBoxF'>
                                    <div className='box1'>
                                        <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                            <rect y="0.975586" width="40" height="40" rx="20" fill="#2287DA" />
                                            <path d="M20 23.6006C19.385 23.6006 18.875 23.0906 18.875 22.4756V14.9756C18.875 14.3606 19.385 13.8506 20 13.8506C20.615 13.8506 21.125 14.3606 21.125 14.9756V22.4756C21.125 23.0906 20.615 23.6006 20 23.6006Z" fill="white" />
                                            <path d="M20 28.4757C19.805 28.4757 19.61 28.4307 19.43 28.3557C19.25 28.2807 19.085 28.1757 18.935 28.0407C18.8 27.8907 18.695 27.7407 18.62 27.5457C18.545 27.3657 18.5 27.1707 18.5 26.9757C18.5 26.7807 18.545 26.5857 18.62 26.4057C18.695 26.2257 18.8 26.0607 18.935 25.9107C19.085 25.7757 19.25 25.6707 19.43 25.5957C19.79 25.4457 20.21 25.4457 20.57 25.5957C20.75 25.6707 20.915 25.7757 21.065 25.9107C21.2 26.0607 21.305 26.2257 21.38 26.4057C21.455 26.5857 21.5 26.7807 21.5 26.9757C21.5 27.1707 21.455 27.3657 21.38 27.5457C21.305 27.7407 21.2 27.8907 21.065 28.0407C20.915 28.1757 20.75 28.2807 20.57 28.3557C20.39 28.4307 20.195 28.4757 20 28.4757Z" fill="white" />
                                        </svg>
                                        <div className='barF'>
                                            <div className='critdescF'>
                                                <div className='scoree'>
                                                    <h6>{returnFloatOrNum(criteria.criterion_1)}/5</h6>
                                                    <p className='p5'>Conciseness & Focus</p>
                                                </div>
                                                <div className='infoiconcrits crittooltip-containerF'>
                                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <p className='crittooltipF'>The prompt should be concise and focused on a specific topic or question. Long, convoluted prompts can confuse the LLM and result in less coherent answers.</p>
                                                </div>
                                            </div>
                                            <div className='progbarF'>
                                                <div className='progressbar-internals' style={{ width: `${returnFloatOrNum(criteria.criterion_1 * 20)}%`, backgroundColor: '#0060AE', height: '100%', borderRadius: '64px' }}></div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='detailsF'>
                                        <p className='p5'>More Details &lt;</p>
                                    </div>
                                </div>


                            </div>

                            <div className='criterias'>
                                <div className='criteriaBoxF'>
                                    <div className='box1'>
                                        <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                            <rect y="0.975586" width="40" height="40" rx="20" fill="#2287DA" />
                                            <path d="M20 23.6006C19.385 23.6006 18.875 23.0906 18.875 22.4756V14.9756C18.875 14.3606 19.385 13.8506 20 13.8506C20.615 13.8506 21.125 14.3606 21.125 14.9756V22.4756C21.125 23.0906 20.615 23.6006 20 23.6006Z" fill="white" />
                                            <path d="M20 28.4757C19.805 28.4757 19.61 28.4307 19.43 28.3557C19.25 28.2807 19.085 28.1757 18.935 28.0407C18.8 27.8907 18.695 27.7407 18.62 27.5457C18.545 27.3657 18.5 27.1707 18.5 26.9757C18.5 26.7807 18.545 26.5857 18.62 26.4057C18.695 26.2257 18.8 26.0607 18.935 25.9107C19.085 25.7757 19.25 25.6707 19.43 25.5957C19.79 25.4457 20.21 25.4457 20.57 25.5957C20.75 25.6707 20.915 25.7757 21.065 25.9107C21.2 26.0607 21.305 26.2257 21.38 26.4057C21.455 26.5857 21.5 26.7807 21.5 26.9757C21.5 27.1707 21.455 27.3657 21.38 27.5457C21.305 27.7407 21.2 27.8907 21.065 28.0407C20.915 28.1757 20.75 28.2807 20.57 28.3557C20.39 28.4307 20.195 28.4757 20 28.4757Z" fill="white" />
                                        </svg>
                                        <div className='barF'>
                                            <div className='critdescF'>
                                                <div className='scoree'>
                                                    <h6>{returnFloatOrNum(criteria.criterion_2)}/5</h6>
                                                    <p className='p5'>Clarity & Specificity</p>
                                                </div>
                                                <div className='infoiconcrits crittooltip-containerF'>
                                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <p className='crittooltipF'>The prompt should be clear and specific, leaving little room for ambiguity. Vague or broad prompts can lead to off-target or generalized responses.</p>
                                                </div>
                                            </div>
                                            <div className='progbarF'>
                                                <div className='progressbar-internals' style={{ width: `${returnFloatOrNum(criteria.criterion_2 * 20)}%`, backgroundColor: '#0060AE', height: '100%', borderRadius: '64px' }}></div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='detailsF'>
                                        <p className='p5'>More Details &lt;</p>
                                    </div>
                                </div>


                            </div>

                            <div className='criterias'>
                                <div className='criteriaBoxF'>
                                    <div className='box1'>
                                        <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                            <rect y="0.975586" width="40" height="40" rx="20" fill="#2287DA" />
                                            <path d="M20 23.6006C19.385 23.6006 18.875 23.0906 18.875 22.4756V14.9756C18.875 14.3606 19.385 13.8506 20 13.8506C20.615 13.8506 21.125 14.3606 21.125 14.9756V22.4756C21.125 23.0906 20.615 23.6006 20 23.6006Z" fill="white" />
                                            <path d="M20 28.4757C19.805 28.4757 19.61 28.4307 19.43 28.3557C19.25 28.2807 19.085 28.1757 18.935 28.0407C18.8 27.8907 18.695 27.7407 18.62 27.5457C18.545 27.3657 18.5 27.1707 18.5 26.9757C18.5 26.7807 18.545 26.5857 18.62 26.4057C18.695 26.2257 18.8 26.0607 18.935 25.9107C19.085 25.7757 19.25 25.6707 19.43 25.5957C19.79 25.4457 20.21 25.4457 20.57 25.5957C20.75 25.6707 20.915 25.7757 21.065 25.9107C21.2 26.0607 21.305 26.2257 21.38 26.4057C21.455 26.5857 21.5 26.7807 21.5 26.9757C21.5 27.1707 21.455 27.3657 21.38 27.5457C21.305 27.7407 21.2 27.8907 21.065 28.0407C20.915 28.1757 20.75 28.2807 20.57 28.3557C20.39 28.4307 20.195 28.4757 20 28.4757Z" fill="white" />
                                        </svg>
                                        <div className='barF'>
                                            <div className='critdescF'>
                                                <div className='scoree'>
                                                    <h6>{returnFloatOrNum(criteria.criterion_3)}/5</h6>
                                                    <p className='p5'>Relevance & Context</p>
                                                </div>
                                                <div className='infoiconcrits crittooltip-containerF'>
                                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <p className='crittooltipF'>The prompt should include relevant context to guide the LLM. Providing necessary background information can help the model generate a more accurate and pertinent response.</p>
                                                </div>
                                            </div>
                                            <div className='progbarF'>
                                                <div className='progressbar-internals' style={{ width: `${returnFloatOrNum(criteria.criterion_3 * 20)}%`, backgroundColor: '#0060AE', height: '100%', borderRadius: '64px' }}></div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='detailsF'>
                                        <p className='p5'>More Details &lt;</p>
                                    </div>
                                </div>


                            </div>

                            <div className='criterias'>
                                <div className='criteriaBoxF'>
                                    <div className='box1'>
                                        <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                            <rect y="0.975586" width="40" height="40" rx="20" fill="#2287DA" />
                                            <path d="M20 23.6006C19.385 23.6006 18.875 23.0906 18.875 22.4756V14.9756C18.875 14.3606 19.385 13.8506 20 13.8506C20.615 13.8506 21.125 14.3606 21.125 14.9756V22.4756C21.125 23.0906 20.615 23.6006 20 23.6006Z" fill="white" />
                                            <path d="M20 28.4757C19.805 28.4757 19.61 28.4307 19.43 28.3557C19.25 28.2807 19.085 28.1757 18.935 28.0407C18.8 27.8907 18.695 27.7407 18.62 27.5457C18.545 27.3657 18.5 27.1707 18.5 26.9757C18.5 26.7807 18.545 26.5857 18.62 26.4057C18.695 26.2257 18.8 26.0607 18.935 25.9107C19.085 25.7757 19.25 25.6707 19.43 25.5957C19.79 25.4457 20.21 25.4457 20.57 25.5957C20.75 25.6707 20.915 25.7757 21.065 25.9107C21.2 26.0607 21.305 26.2257 21.38 26.4057C21.455 26.5857 21.5 26.7807 21.5 26.9757C21.5 27.1707 21.455 27.3657 21.38 27.5457C21.305 27.7407 21.2 27.8907 21.065 28.0407C20.915 28.1757 20.75 28.2807 20.57 28.3557C20.39 28.4307 20.195 28.4757 20 28.4757Z" fill="white" />
                                        </svg>
                                        <div className='barF'>
                                            <div className='critdescF'>
                                                <div className='scoree'>
                                                    <h6>{returnFloatOrNum(criteria.criterion_4)}/5</h6>
                                                    <p className='p5'>Purpose & Output</p>
                                                </div>
                                                <div className='infoiconcrits crittooltip-containerF'>
                                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <p className='crittooltipF'>The prompt should clearly state the desired output or purpose of the response. This helps the LLM understand the expected format and detail level.</p>
                                                </div>
                                            </div>
                                            <div className='progbarF'>
                                                <div className='progressbar-internals' style={{ width: `${returnFloatOrNum(criteria.criterion_4 * 20)}%`, backgroundColor: '#0060AE', height: '100%', borderRadius: '64px' }}></div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='detailsF'>
                                        <p className='p5'>More Details &lt;</p>
                                    </div>
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
    );
};

export default NotStudyMode;