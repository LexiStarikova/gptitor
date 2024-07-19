import { useState, useEffect, useContext } from 'react';
import { FeedbackContext } from './feedbackContext';
import { Metrics } from './models/metrics';
import './feedbackWindow.css'
import MarkdownRenderer from './markdownRenderer';


interface feedbackWindowProps {
    isOpenF: boolean;
    isOpenD: boolean;
    isOpenS: boolean;
    closeF: () => void;
    containerColor: string;
}

const FeedbackWindow: React.FC<feedbackWindowProps> = ({ isOpenF, isOpenD, isOpenS, closeF, containerColor }) => {

    const { feedback, setFeedback } = useContext(FeedbackContext);
    const { criteria, setCriteria } = useContext(FeedbackContext);
    const { setTask } = useContext(FeedbackContext);
    const [showDescription, setShowDescription] = useState(false);
    const [isRounded, setIsRounded] = useState(true);
    const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null);

    const resetFeedback = () => {
        setFeedback('');
    };

    const resetScore = () => {
        setCriteria(new Metrics(0.0, "", 0.0, "", 0.0, "", 0.0, ""));
    };

    const toggleDetails = (criterion: string) => {
        setExpandedCriterion(prevCriterion => prevCriterion === criterion ? null : criterion);
    };

    const returnOverallScore = () => {
        let score = ((criteria.criterion_1
            + criteria.criterion_2
            + criteria.criterion_3
            + criteria.criterion_4) / 20 * 5)
        if (score % 1 === 0) return score.toFixed(0)
        else return score.toFixed(1)
    }

    useEffect(() => {
        resetFeedback();
        resetScore();

        console.log(((criteria.criterion_1
            + criteria.criterion_2
            + criteria.criterion_3
            + criteria.criterion_4) / 20 * 10))
    }, [setFeedback, setCriteria, setTask]);

    const returnFloatOrNum = (criterion: number) => {
        if (criterion % 1 === 0) return criterion.toFixed(0)
        else return criterion.toFixed(1)
    }

    useEffect(() => {
        console.log(`Background color is: ${containerColor}`);
        console.log("Criteria updated for window:", criteria);
    }, [criteria]);

    return (
        <div className={`feedbackcontainer${isOpenF && !isOpenD && !isOpenS ? 'open' : ''}`}>
            <div className='TaskDlinex'>
                <h6 className='viewTask' onClick={closeF}>View Task</h6>
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
                                        <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="1" y="1.51709" width="38" height="38" rx="19" fill="white" />
                                            <rect x="1" y="1.51709" width="38" height="38" rx="19" stroke="#2287DA" stroke-width="2" />
                                            <circle cx="20" cy="20.5171" r="4.5" fill="#2287DA" />
                                        </svg>
                                        <div className='barF'>
                                            <div className='critdescF'>
                                                <div className='scoree'>
                                                    <h6>{returnFloatOrNum(criteria.criterion_1)}/5</h6>
                                                    <h6 className='criteriaT'>Conciseness & Focus</h6>
                                                </div>
                                                <div className='infoiconcrits crittooltip-containerF'>
                                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <p className='crittooltipF'>The prompt should be concise and focused on a specific topic or question. Long, convoluted prompts can confuse the LLM and result in less coherent answers.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='progress-criteria-outer'>
                                        <div className='progress-criteria-inner' style={{ width: `${returnFloatOrNum(criteria.criterion_1 * 20)}%` }}>
                                        </div>
                                    </div>
                                    <button onClick={() => toggleDetails('criterion_1')} className='more-details-btn'>
                                        {expandedCriterion === 'criterion_1' ? 'Less Details' : 'More Details'}
                                    </button>
                                </div>
                                <div className={`criterion-details ${expandedCriterion === 'criterion_1' ? 'expanded' : ''}`}>
                                    <p className='pdetails'>{criteria.comment_criterion_1 ? criteria.comment_criterion_1 : "Here are more details about your score..."}</p>
                                </div>

                            </div>

                            <div className='criterias'>
                                <div className='criteriaBoxF'>
                                    <div className='box1'>
                                        <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="1" y="1.51709" width="38" height="38" rx="19" fill="white" />
                                            <rect x="1" y="1.51709" width="38" height="38" rx="19" stroke="#2287DA" stroke-width="2" />
                                            <circle cx="20" cy="20.5171" r="4.5" fill="#2287DA" />
                                        </svg>
                                        <div className='barF'>
                                            <div className='critdescF'>
                                                <div className='scoree'>
                                                    <h6>{returnFloatOrNum(criteria.criterion_2)}/5</h6>
                                                    <h6 className='criteriaT'>Clarity & Specificity</h6>
                                                </div>
                                                <div className='infoiconcrits crittooltip-containerF'>
                                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <p className='crittooltipF'>The prompt should be clear and specific, leaving little room for ambiguity. Vague or broad prompts can lead to off-target or generalized responses.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='progress-criteria-outer'>
                                        <div className='progress-criteria-inner' style={{ width: `${returnFloatOrNum(criteria.criterion_2 * 20)}%` }}>
                                        </div>
                                    </div>
                                    <button onClick={() => toggleDetails('criterion_2')} className='more-details-btn'>
                                        {expandedCriterion === 'criterion_2' ? 'Less Details' : 'More Details'}
                                    </button>
                                </div>
                                <div className={`criterion-details ${expandedCriterion === 'criterion_2' ? 'expanded' : ''}`}>
                                    <p className='pdetails'>{criteria.comment_criterion_2 ? criteria.comment_criterion_2 : "Here are more details about your score..."}</p>
                                </div>

                            </div>

                            <div className='criterias'>
                                <div className='criteriaBoxF'>
                                    <div className='box1'>
                                        <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="1" y="1.51709" width="38" height="38" rx="19" fill="white" />
                                            <rect x="1" y="1.51709" width="38" height="38" rx="19" stroke="#2287DA" stroke-width="2" />
                                            <circle cx="20" cy="20.5171" r="4.5" fill="#2287DA" />
                                        </svg>
                                        <div className='barF'>
                                            <div className='critdescF'>
                                                <div className='scoree'>
                                                    <h6>{returnFloatOrNum(criteria.criterion_3)}/5</h6>
                                                    <h6 className='criteriaT'>Relevance & Context</h6>
                                                </div>
                                                <div className='infoiconcrits crittooltip-containerF'>
                                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <p className='crittooltipF'>The prompt should include relevant context to guide the LLM. Providing necessary background information can help the model generate a more accurate and pertinent response.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='progress-criteria-outer'>
                                        <div className='progress-criteria-inner' style={{ width: `${returnFloatOrNum(criteria.criterion_3 * 20)}%` }}>
                                        </div>
                                    </div>
                                    <button onClick={() => toggleDetails('criterion_3')} className='more-details-btn'>
                                        {expandedCriterion === 'criterion_3' ? 'Less Details' : 'More Details'}
                                    </button>
                                </div>
                                <div className={`criterion-details ${expandedCriterion === 'criterion_3' ? 'expanded' : ''}`}>
                                    <p className='pdetails'>{criteria.comment_criterion_3 ? criteria.comment_criterion_3 : "Here are more details about your score..."}</p>
                                </div>

                            </div>

                            <div className='criterias'>
                                <div className='criteriaBoxF'>
                                    <div className='box1'>
                                        <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="1" y="1.51709" width="38" height="38" rx="19" fill="white" />
                                            <rect x="1" y="1.51709" width="38" height="38" rx="19" stroke="#2287DA" stroke-width="2" />
                                            <circle cx="20" cy="20.5171" r="4.5" fill="#2287DA" />
                                        </svg>
                                        <div className='barF'>
                                            <div className='critdescF'>
                                                <div className='scoree'>
                                                    <h6>{returnFloatOrNum(criteria.criterion_4)}/5</h6>
                                                    <h6 className='criteriaT'>Purpose & Output</h6>
                                                </div>
                                                <div className='infoiconcrits crittooltip-containerF'>
                                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <p className='crittooltipF'>The prompt should clearly state the desired output or purpose of the response. This helps the LLM understand the expected format and detail level.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='progress-criteria-outer'>
                                        <div className='progress-criteria-inner' style={{ width: `${returnFloatOrNum(criteria.criterion_4 * 20)}%` }}>
                                        </div>
                                    </div>
                                    <button onClick={() => toggleDetails('criterion_4')} className='more-details-btn'>
                                        {expandedCriterion === 'criterion_4' ? 'Less Details' : 'More Details'}
                                    </button>
                                </div>
                                <div className={`criterion-details ${expandedCriterion === 'criterion_4' ? 'expanded' : ''}`}>
                                    <p className='pdetails'>{criteria.comment_criterion_4 ? criteria.comment_criterion_4 : "Here are more details about your score..."}</p>
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
                            <div className="inner">
                                <MarkdownRenderer text={feedback} containerColor='#2287DA' />
                            </div>
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

export default FeedbackWindow;