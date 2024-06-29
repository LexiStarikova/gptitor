import './studymode.css';
import { ConversationPanel } from './conversationPanel.tsx';
import Sidebar from './sidebar';
import FeedbackPanel from './feedbackPanel.tsx';
import FeedbackContextProvider from './feedbackContextProvider.tsx';

interface Message {
    user_id: number;
    query_id: number;
    query_text: string;
    llm_id: number;
    response_id: number;
    response_text: string;
    comment: string;
    conversation_id: number;
}

const StudyMode: React.FC = () => {

    const [data, setData] = useState<Message[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const openConversation = async (stored_id: number) => {
        console.log('Conversation is opening...');

        try {
            const response = await fetch(`http://10.100.30.244:8000/conversations/${stored_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data: any[] = await response.json();

            const messages: Message[] = data.map(item => ({
                user_id: item.user_id,
                query_id: item.query_id,
                query_text: item.query_text,
                llm_id: item.llm_id,
                response_id: item.response_id,
                response_text: item.response_text,
                comment: item.comment,
                conversation_id: item.conversation_id
            }));

            console.log(`Number of messages: ${messages.length}`);

            setData(messages);
            setIsOpen(true); // Set isOpen to display ConversationPanel

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <FeedbackContextProvider>
                <div className='chatpage'>
                    <Sidebar openConversation={openConversation} data={data} />
                    {isOpen && <ConversationPanel data={data} />} 
                    <FeedbackPanel></FeedbackPanel>
                </div>
            </FeedbackContextProvider>
        </div>
    );
};

export default StudyMode;

