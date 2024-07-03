import './studymode.css';
import { ConversationPanel } from './conversationPanel.tsx';
import FeedbackPanel from './feedbackPanel.tsx';
import TaskDesc from "./taskdescription.tsx"
import FeedbackContextProvider from './feedbackContextProvider.tsx';

const StudyMode: React.FC = () => {
    return (
        <div>
            <FeedbackContextProvider>
                <div className='chatpage'>
                    <ConversationPanel></ConversationPanel>
                    <FeedbackPanel></FeedbackPanel>
                </div>
            </FeedbackContextProvider>
        </div>
    );
};

export default StudyMode;
