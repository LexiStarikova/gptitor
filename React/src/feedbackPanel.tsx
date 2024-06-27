import './feedbackPanel.css';
import { useState, useEffect, useContext } from 'react';
import TaskPanel from './taskpanel';
import { FeedbackContext } from './feedbackContext';

const FeedbackPanel = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { feedback, setFeedback } = useContext(FeedbackContext);
    const toggleSidebar = () => {
        console.log('Toggling sidebar');
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [criterionOneValue, setcriterionOneValue] = useState<number | null>(null);
    const [criterionTwoValue, setcriterionTwoValue] = useState<number | null>(null);
    const [criterionThreeValue, setcriterionThreeValue] = useState<number | null>(null);
    const [criterionFourValue, setcriterionFourValue] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const resetFeedback = () => {
        setFeedback('');
    };


    useEffect(() => {

        const fetchcriterionOneValue = async () => {
            try {
                const response = await fetch(`http://10.100.30.244:8000/feedback/1/criterion_1`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                const value = parseFloat(data.score);

                setcriterionOneValue(value);
            } catch (Error) {
                setError('Error: failed to GET criteria 1 !');
            }
        };

        const fetchcriterionTwoValue = async () => {
            try {
                const response = await fetch(`http://10.100.30.244:8000/feedback/1/criterion_2`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                const value = parseFloat(data.score);

                setcriterionTwoValue(value);
            } catch (Error) {
                setError('Error: failed to GET criteria 2 !');
            }
        };

        const fetchcriterionThreeValue = async () => {
            try {
                const response = await fetch(`http://10.100.30.244:8000/feedback/1/criterion_3`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                const value = parseFloat(data.score);

                setcriterionThreeValue(value);
            } catch (Error) {
                setError('Error: failed to GET criteria 3 !');
            }
        };
        const fetchcriterionFourValue = async () => {
            try {
                const response = await fetch(`http://10.100.30.244:8000/feedback/1/criterion_4`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                const value = parseFloat(data.score);

                setcriterionFourValue(value);
            } catch (Error) {
                setError('Error: failed to GET criteria 4 !');
            }
        };

        fetchcriterionOneValue();
        fetchcriterionTwoValue();
        fetchcriterionThreeValue();
        fetchcriterionFourValue();
        resetFeedback();
    }, [setFeedback]);

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
                        <p>Task 1</p>
                    </div>
                </div>
                <div className='feedbackcontainer'>
                    <div className='Desccontainer'>
                        <div className='DescTitle'>
                            <p>Description</p>
                        </div>
                        <div className='TaskDesc'>
                            <p>Let Garfield be your favorite cat, in order to please your cat you’ll try to give it the best care. You should write the right prompt to get relevant details of how to take care of Garfield. If you fail Garfield will get mad</p>
                        </div>
                    </div>
                    <h4 className='res'>Results:</h4>
                    <div className='scoreBoxes'>
                        <div className='score'></div>
                        <div className='criterias'>
                            <div className='criteriaBoxF'>
                                <div className='infoiconcrit crittooltip-containerF'>
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.2927 11.2412L11.2927 15.3791M11.2927 8.17411V8.13775M3.00977 11.2412C3.00977 6.67056 6.71816 2.96533 11.2927 2.96533C15.8672 2.96533 19.5756 6.67056 19.5756 11.2412C19.5756 15.8118 15.8672 19.5171 11.2927 19.5171C6.71816 19.5171 3.00977 15.8118 3.00977 11.2412Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    <p className='crittooltipF'>Ah Yes, Criteria Description.</p>
                                </div>
                                <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                    <rect y="0.975586" width="40" height="40" rx="20" fill="#F1C21B" />
                                    <path d="M20 23.6006C19.385 23.6006 18.875 23.0906 18.875 22.4756V14.9756C18.875 14.3606 19.385 13.8506 20 13.8506C20.615 13.8506 21.125 14.3606 21.125 14.9756V22.4756C21.125 23.0906 20.615 23.6006 20 23.6006Z" fill="white" />
                                    <path d="M20 28.4757C19.805 28.4757 19.61 28.4307 19.43 28.3557C19.25 28.2807 19.085 28.1757 18.935 28.0407C18.8 27.8907 18.695 27.7407 18.62 27.5457C18.545 27.3657 18.5 27.1707 18.5 26.9757C18.5 26.7807 18.545 26.5857 18.62 26.4057C18.695 26.2257 18.8 26.0607 18.935 25.9107C19.085 25.7757 19.25 25.6707 19.43 25.5957C19.79 25.4457 20.21 25.4457 20.57 25.5957C20.75 25.6707 20.915 25.7757 21.065 25.9107C21.2 26.0607 21.305 26.2257 21.38 26.4057C21.455 26.5857 21.5 26.7807 21.5 26.9757C21.5 27.1707 21.455 27.3657 21.38 27.5457C21.305 27.7407 21.2 27.8907 21.065 28.0407C20.915 28.1757 20.75 28.2807 20.57 28.3557C20.39 28.4307 20.195 28.4757 20 28.4757Z" fill="white" />
                                </svg>
                                <div className='barF'>
                                    <div className='critdescF'>
                                        <h6>{criterionOneValue}/10</h6>
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
                                        <rect x="1" y="1.71948" width="38" height="38" rx="19" stroke="#0043CE" stroke-width="2" />
                                        <circle cx="20" cy="20.7195" r="4.5" fill="#0043CE" />
                                    </svg>

                                    <div className='barF'>
                                        <div className='critdescF'>
                                            <h6>{criterionTwoValue}/10</h6>
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
                                        <rect y="0.804932" width="40" height="40" rx="20" fill="#DA1E28" />
                                        <path d="M15.755 26.175C15.47 26.175 15.185 26.07 14.96 25.845C14.525 25.41 14.525 24.69 14.96 24.255L23.45 15.765C23.885 15.33 24.605 15.33 25.04 15.765C25.475 16.2 25.475 16.92 25.04 17.355L16.55 25.845C16.34 26.07 16.04 26.175 15.755 26.175Z" fill="white" />
                                        <path d="M24.245 26.175C23.96 26.175 23.675 26.07 23.45 25.845L14.96 17.355C14.525 16.92 14.525 16.2 14.96 15.765C15.395 15.33 16.115 15.33 16.55 15.765L25.04 24.255C25.475 24.69 25.475 25.41 25.04 25.845C24.815 26.07 24.53 26.175 24.245 26.175Z" fill="white" />
                                    </svg>


                                    <div className='barF'>
                                        <div className='critdescF'>
                                            <h6>{criterionThreeValue}/10</h6>
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
                                        <rect y="0.890137" width="40" height="40" rx="20" fill="#198038" />
                                        <path d="M17.8702 26.26C17.5702 26.26 17.2852 26.14 17.0752 25.93L12.8302 21.685C12.3952 21.25 12.3952 20.53 12.8302 20.095C13.2652 19.66 13.9852 19.66 14.4202 20.095L17.8702 23.545L25.5802 15.835C26.0152 15.4 26.7352 15.4 27.1702 15.835C27.6052 16.27 27.6052 16.99 27.1702 17.425L18.6652 25.93C18.4552 26.14 18.1702 26.26 17.8702 26.26Z" fill="white" />
                                    </svg>

                                    <div className='barF'>
                                        <div className='critdescF'>
                                            <h6>{criterionFourValue}/10</h6>
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
                        <div className='FeedTitle'>
                            <p>Feedback</p>
                        </div>
                        <div className='FeedDesc'>
                            <p>{feedback}</p>
                            {/* <p>Personnaly I am not a cat expert, but I see that you successfully colected the nessacery information to ensure that Garfield in a good health. Here’s a tip, next time ask for Garfield favortie ice cream flavor !</p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default FeedbackPanel;
