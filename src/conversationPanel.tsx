import React, { useState } from 'react';
import './conversationPanel.css';

export const ConversationPanel: React.FC = () => {
    
    const [text, setText] = useState<string>('');

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };
    // conversation_id = 1
    const handleSend = async () => {
        if(text.trim() === "") return;
        const url = 'http://10.100.30.244:8000/conversations/1/messages';
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query_text: text })
            });

            if (!response.ok) {
                // Check if response is not okay (status is not in the range 200-299)
                const errorMessage = await response.text();
                console.error('Failed to send message:', errorMessage);
                return;
            }
    
            if (response.ok) {  
                console.log('Message sent successfully');
                setText(''); 
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('There was a problem sending the message:', error);
        }
    };

    return (
        <div id="panel">
            <div id="model-menu">
                <a id="model-name">LLM</a>
            </div>
            <div id="conversation">
                {}
            </div>
            <div id="input-field">
                <input 
                    type="text"
                    id="placeHolder" 
                    placeholder="Write here to get your feedback.."
                    value={text}
                    onChange={handleTextChange}
                />
                <button id="button" onClick={handleSend}> 
                    <img src="src/UI-kit UNIONE/Icons/ConversationPanel/sendArrow.svg" alt="Send"></img>
                </button>
            </div>
            <div id="LLM-Response">
                <a id="LLM-avatar"></a>
                <a id="responseText">Response here</a>
                <ul>
                    <button>
                        <img className="likeButton" src="src/UI-kit UNIONE/Icons/ConversationPanel/likeIcon.svg" alt="Like"></img>
                    </button>
                    <button>
                        <img className="dislikeButton" src="src/UI-kit UNIONE/Icons/ConversationPanel/dislikeIcon.svg" alt="Dislike"></img>
                    </button>
                    <button>
                        <img className="pinButton" src="src/UI-kit UNIONE/Icons/ConversationPanel/pinIcon.svg" alt="Pin"></img>
                    </button>
                </ul>
            </div>
            <div id="userPrompt">
                <img src="src/UI-kit UNIONE/Icons/ConversationPanel/avatar.svg" id="user-avatar" alt="User avatar"></img>
                <a id="promptText">Prompt here</a>
            </div>
        </div>
    );
};
