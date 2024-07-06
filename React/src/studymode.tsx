import './studymode.css';
import { ConversationPanel } from './conversationPanel.tsx';
import FeedbackPanel from './feedbackPanel.tsx';
import TaskDesc from "./taskdescription.tsx"
import FeedbackContextProvider from './feedbackContextProvider.tsx';

interface MessageSimplifyed {
    id: number,
    text: string
}

interface StudyModeProps {
    requests: MessageSimplifyed[];
    setRequests: React.Dispatch<React.SetStateAction<MessageSimplifyed[]>>;
    responses: MessageSimplifyed[];
    setResponses: React.Dispatch<React.SetStateAction<MessageSimplifyed[]>>;
    conversation_id : number;
}


const StudyMode: React.FC<StudyModeProps> = ({ requests, responses, setRequests, setResponses, conversation_id }) => {
    return (
        <div className='panelscontainer'>
            <svg className='leftgradient' width="674.1" height="509.6" viewBox="74.9 0 674.1 509.6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="327.5" cy="421.5" r="421.5" fill="url(#paint0_radial_878_1741)"/>
                <defs>
                    <radialGradient id="paint0_radial_878_1741" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(337.5 422) rotate(-59.5461) scale(429.689)">
                    <stop stop-color="#AAABFA"/>
                    <stop offset="0.916" stop-color="#EFEFEF"/>
                    <stop offset="1" stop-color="#EFEFEF"/>
                    </radialGradient>
                </defs>
            </svg>

            <FeedbackContextProvider>
                    <ConversationPanel requests={requests} setRequests={setRequests} setResponses={setResponses} responses={responses} conversation_id={conversation_id} ></ConversationPanel>
                    {/* <FeedbackPanel></FeedbackPanel> */}
            </FeedbackContextProvider>
        </div>
    );
};


export default StudyMode;
