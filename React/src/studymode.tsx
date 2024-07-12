import './studymode.css';
import { useState } from 'react';
import { ConversationPanel } from './conversationPanel';
import FeedbackPanel from './feedbackPanel';
import TaskDesc from "./taskdescription"

interface MessageSimplifyed {
    id: number,
    text: string,
}

interface StudyModeProps {
    queries: { display_id: number; stored_id: number; text: string; date: Date }[];
    createConversation: () => Promise<void>;
    requests: MessageSimplifyed[];
    setRequests: React.Dispatch<React.SetStateAction<MessageSimplifyed[]>>;
    responses: MessageSimplifyed[];
    setResponses: React.Dispatch<React.SetStateAction<MessageSimplifyed[]>>;
    conversation_id: number;
}


const StudyMode: React.FC<StudyModeProps> = ({ queries, createConversation, requests, responses, setRequests, setResponses, conversation_id }) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showDescription, setShowDescription] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleDescription = () => {
        setShowDescription(!showDescription);
        // setFeedbackOpen(!isFeedbackOpen);
    };

    return (
        <div >
            <svg className='leftgradient' width="674.1" height="509.6" viewBox="74.9 0 674.1 509.6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="327.5" cy="421.5" r="421.5" fill="url(#paint0_radial_878_1741)" />
                <defs>
                    <radialGradient id="paint0_radial_878_1741" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(337.5 422) rotate(-59.5461) scale(429.689)">
                        <stop stop-color="#AAABFA" />
                        <stop offset="0.916" stop-color="#EFEFEF" />
                        <stop offset="1" stop-color="#EFEFEF" />
                    </radialGradient>
                </defs>
            </svg>
            <svg className='rightgradient' width="429" height="336" viewBox="0 0 429 336" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="336.5" cy="336.5" r="336.5" fill="url(#paint0_radial_878_1740)" />
                <defs>
                    <radialGradient id="paint0_radial_878_1740" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(344.483 336.899) rotate(-59.5461) scale(343.037)">
                        <stop stop-color="#AAABFA" />
                        <stop offset="0.916" stop-color="#EFEFEF" />
                        <stop offset="1" stop-color="#EFEFEF" />
                    </radialGradient>
                </defs>
            </svg>
            <div className='panels'>
                <ConversationPanel queries={queries} createConversation={createConversation} isOpenS={isSidebarOpen} close={toggleSidebar} requests={requests} setRequests={setRequests} isOpenD={showDescription} closeD={toggleDescription} setResponses={setResponses} responses={responses} conversation_id={conversation_id}></ConversationPanel>
                <FeedbackPanel isOpenS={isSidebarOpen} close={toggleSidebar} isOpenD={showDescription} closeD={toggleDescription}></FeedbackPanel>
            </div>
        </div>
    );
};


export default StudyMode;
