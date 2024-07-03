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
        <div>
            <FeedbackContextProvider>
                <div className='chatpage'>
                    <ConversationPanel requests={requests} setRequests={setRequests} setResponses={setResponses} responses={responses} conversation_id={conversation_id} ></ConversationPanel>
                    <FeedbackPanel></FeedbackPanel>
                </div>
            </FeedbackContextProvider>
        </div>
    );
};


export default StudyMode;
