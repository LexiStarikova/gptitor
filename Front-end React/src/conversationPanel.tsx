import './conversationPanel.css';

export const ConversationPanel = () => {
    return (
    <div id ="panel">
        <div id="model-menu">
            <a id ="model-name" > LLM</a>
        </div>
        <div id = "conversation">

        </div>
        <div id="input-field">
            <div id="text-area">
                <a id="placeHolder">Write here, to get your feedback.</a>
                <button id="sendButton">
                    <img id="button" src="src/UI-kit UNIONE/Icons/ConversationPanel/sendArrow.svg"></img>
                </button>
            </div>
        </div>
        <div id="LLM-Response">
            <a id="LLM-avatar" ></a>
            <a id="responseText"> response here</a>
            <ul>
                <button >
                    <img className="likeButton" src="src/UI-kit UNIONE/Icons/ConversationPanel/likeIcon.svg"></img>
                </button>
                <button >
                    <img className="dislikeButton" src="src/UI-kit UNIONE/Icons/ConversationPanel/dislikeIcon.svg"></img>
                </button>
                <button >
                    <img className="pinButton" src="src/UI-kit UNIONE/Icons/ConversationPanel/pinIcon.svg"></img>
                </button>
            </ul>
        </div>  
        <div id="userPrompt">
            <img src="src/UI-kit UNIONE/Icons/ConversationPanel/avatar.svg" id="user-avatar"></img>
            <a id="promptText">prompt here</a>
        </div>  

    </div>
    )
}