import React, { useState, useRef, useEffect, useContext } from 'react';
import './conversationPanel.css';
import { FeedbackContext } from './feedbackContext';
import { Score } from './models/score';

export const ConversationPanel: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [queries, setQueries] = useState<string[]>([]);
    const [responses, setResponses] = useState<string[]>([]);
    const { feedback, setFeedback } = useContext(FeedbackContext);
    const { criteria, setCriteria } = useContext(FeedbackContext);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        adjustTextareaHeight();
    }, [text]);

    const adjustTextareaHeight = () => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    };
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        adjustTextareaHeight();
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = async () => {
        if (text.trim() === "") return;

        const newQuery = text;
        setQueries(prevQueries => [...prevQueries, newQuery]);
        setText('');
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }
        try {
            const response = await fetch('http://10.100.30.244:8000/conversations/1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query_text: text,
                })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Failed to send message:', errorMessage);
                return;
            }
            console.log('Message sent successfully');
            const data = await response.json();
            
            const newResponse = data.response_text;
            setResponses(prevResponses => [...prevResponses, newResponse]);
            setFeedback(data.comment);
            console.log(`query_id = ${data.query_id}`, 
                `criterion_1 = ${data.score.criterion_1}`, 
                `criterion_2 = ${data.score.criterion_2}`, 
                `criterion_3 = ${data.score.criterion_3}`,
                `criterion_4 = ${data.score.criterion_4}`,);
            
            setCriteria(new Score(data.score.criterion_1, data.score.criterion_2, data.score.criterion_3, data.score.criterion_4));
        } catch (error) {
            console.error('There was a problem sending the message:', error);
        }
    };



    return (
        <div>
            <div className='chatbigcontainter'>
                <div className='optionContainer'>
                    <div className='option1'>
                        <p>GPT-4</p>
                    </div>
                    <div className='option'>
                        <p>Illama3</p>
                    </div>
                </div>
                <div className='conversationcontainer'>
                    <div className='Convo'>
                        {queries.map((query, index) => (
                            <div key={`conversation-${index}`} className='conversation-item'>
                                <div className='req'>
                                    <div className='reqbub'>
                                        <p className='p4'>{query}</p>
                                    </div>
                                    <div className='pdpchat'></div>
                                </div>
                                {responses[index] && (
                                    <div className='rescomplete'>
                                        <div className='resp'>
                                            <div className='pdpchat'></div>
                                            <div className='reqbub'>
                                                <p className='p4'>{responses[index]}</p>
                                            </div>
                                        </div>
                                        <div className='reactions'>
                                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className='like'>
                                                <path d="M6.46715 9.49724C6.25502 9.67402 6.22635 9.9893 6.40314 10.2014C6.57992 10.4136 6.8952 10.4422 7.10734 10.2655L6.46715 9.49724ZM10.4996 6.78773L10.8197 6.40362C10.6343 6.2491 10.3649 6.2491 10.1795 6.40362L10.4996 6.78773ZM13.8918 10.2655C14.104 10.4422 14.4192 10.4136 14.596 10.2014C14.7728 9.9893 14.7441 9.67402 14.532 9.49724L13.8918 10.2655ZM9.99958 14.2124C9.99958 14.4885 10.2234 14.7124 10.4996 14.7124C10.7757 14.7124 10.9996 14.4885 10.9996 14.2124H9.99958ZM7.10734 10.2655L10.8197 7.17184L10.1795 6.40362L6.46715 9.49724L7.10734 10.2655ZM10.1795 7.17184L13.8918 10.2655L14.532 9.49724L10.8197 6.40362L10.1795 7.17184ZM9.99958 6.78773V14.2124H10.9996V6.78773H9.99958ZM16.0857 4.91395C19.1709 7.9991 19.1709 13.0011 16.0857 16.0862L16.7929 16.7933C20.2685 13.3177 20.2685 7.68251 16.7929 4.20685L16.0857 4.91395ZM16.0857 16.0862C13.0006 19.1714 7.99861 19.1714 4.91347 16.0862L4.20636 16.7933C7.68202 20.269 13.3172 20.269 16.7929 16.7933L16.0857 16.0862ZM4.91347 16.0862C1.82832 13.0011 1.82832 7.9991 4.91347 4.91395L4.20636 4.20685C0.730693 7.68251 0.730693 13.3177 4.20636 16.7933L4.91347 16.0862ZM4.91347 4.91395C7.99861 1.82881 13.0006 1.82881 16.0857 4.91395L16.7929 4.20685C13.3172 0.731181 7.68202 0.731181 4.20636 4.20685L4.91347 4.91395Z" fill="#3B4168" />
                                            </svg>
                                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className='dislike'>
                                                <path d="M14.532 11.503C14.7441 11.3262 14.7728 11.0109 14.596 10.7988C14.4192 10.5866 14.104 10.558 13.8918 10.7347L14.532 11.503ZM10.4996 14.2125L10.1795 14.5966C10.3649 14.7511 10.6343 14.7511 10.8197 14.5966L10.4996 14.2125ZM7.10734 10.7347C6.8952 10.558 6.57992 10.5866 6.40314 10.7988C6.22635 11.0109 6.25502 11.3262 6.46715 11.503L7.10734 10.7347ZM10.9996 6.78779C10.9996 6.51165 10.7757 6.28779 10.4996 6.28779C10.2234 6.28779 9.99958 6.51165 9.99958 6.78779H10.9996ZM13.8918 10.7347L10.1795 13.8283L10.8197 14.5966L14.532 11.503L13.8918 10.7347ZM10.8197 13.8283L7.10734 10.7347L6.46715 11.503L10.1795 14.5966L10.8197 13.8283ZM10.9996 14.2125V6.78779H9.99958L9.99958 14.2125H10.9996ZM16.0857 16.0862C13.0006 19.1714 7.99861 19.1714 4.91347 16.0862L4.20636 16.7933C7.68202 20.269 13.3172 20.269 16.7929 16.7933L16.0857 16.0862ZM4.91347 16.0862C1.82832 13.0011 1.82832 7.9991 4.91347 4.91395L4.20636 4.20685C0.730693 7.68251 0.730693 13.3177 4.20636 16.7933L4.91347 16.0862ZM4.91347 4.91395C7.99861 1.82881 13.0006 1.82881 16.0857 4.91395L16.7929 4.20685C13.3172 0.731181 7.68202 0.731181 4.20636 4.20685L4.91347 4.91395ZM16.0857 4.91395C19.1709 7.9991 19.1709 13.0011 16.0857 16.0862L16.7929 16.7933C20.2685 13.3177 20.2685 7.68251 16.7929 4.20685L16.0857 4.91395Z" fill="#3B4168" />
                                            </svg>
                                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className='pin'>
                                                <path d="M10.4996 8.4001V15.4001M7.34961 12.1545C4.27119 12.6737 2.09961 13.9312 2.09961 15.4001C2.09961 17.3331 5.86042 18.9001 10.4996 18.9001C15.1388 18.9001 18.8996 17.3331 18.8996 15.4001C18.8996 13.9312 16.728 12.6737 13.6496 12.1545M13.2996 4.9001C13.2996 6.44649 12.046 7.7001 10.4996 7.7001C8.95321 7.7001 7.69961 6.44649 7.69961 4.9001C7.69961 3.3537 8.95321 2.1001 10.4996 2.1001C12.046 2.1001 13.2996 3.3537 13.2996 4.9001Z" stroke="#3B4168" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='inputField'>
                    <textarea className='chatinput'
                        ref={inputRef}
                        placeholder='Write here, to get your feedback.'
                        value={text}
                        onChange={handleTextChange}
                        onKeyPress={handleKeyPress}
                    ></textarea>
                    <div className='sendBtn' onClick={handleSend}>
                        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" className='sendsvg1'>
                            <path d="M23.3154 3.64397L11.7983 15.1611M4.09215 9.37411L22.0265 3.15198C23.131 2.76881 24.1906 3.82842 23.8074 4.93287L17.5853 22.8672C17.159 24.0959 15.4337 24.1295 14.9598 22.9185L12.112 15.6407C11.9698 15.2772 11.6822 14.9896 11.3187 14.8474L4.04089 11.9995C2.82984 11.5257 2.86353 9.80037 4.09215 9.37411Z" stroke="white" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        <svg width="31" height="21" viewBox="0 0 31 21" fill="none" xmlns="http://www.w3.org/2000/svg" className='sendsvg2'>
                            <path d="M29.7792 10.5L13.8251 10.5M7.10208 15.7693H4.02939M7.10208 10.6851H1M7.10208 5.60082H4.02939M12.4958 1.14253L29.2272 9.26496C30.2576 9.76515 30.2576 11.2348 29.2272 11.735L12.4958 19.8575C11.3495 20.4139 10.1312 19.2408 10.6418 18.0723L13.7101 11.0501C13.8634 10.6994 13.8634 10.3006 13.7101 9.94986L10.6418 2.92772C10.1312 1.75922 11.3495 0.586091 12.4958 1.14253Z" stroke="white" stroke-width="2" stroke-linecap="round" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

