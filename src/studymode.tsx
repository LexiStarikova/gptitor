import './studymode.css';
import { ConversationPanel } from './conversationPanel.tsx';
import FeedbackPanel from './feedbackPanel.tsx';
const StudyMode: React.FC = () => {
    return (
        <div>
            <div className='chatpage'>
                <ConversationPanel></ConversationPanel>
                <FeedbackPanel></FeedbackPanel>
            </div>
        </div>
    );
};

export default StudyMode;
