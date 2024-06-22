import './feedbackPanel.css'

export const FeedbackPanel = () => {
    return (
        <div id="feedPanel">
            <div id="sections">
                <ul>
                    <li id="task1">
                        <a>Task</a>
                    </li>
                </ul>
            </div>
            <div id="content">
                <div id="taskDescription">
                    <div>
                        <a id="description">Description</a>
                    </div>
                    <div>
                        <a id="descriptionText">Description here</a>
                    </div>
                    
                </div>
                <div id="progress">
                    
                </div>
                <div id="feedbackContent">
                    <div>
                        <a id="feedback">Feedback</a>
                    </div>
                    <div>
                        <a id="feedbackText">Feedback here</a>
                    </div>
                </div>
            </div>

        </div>
    )
}