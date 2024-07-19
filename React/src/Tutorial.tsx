// src/components/Tutorial.tsx
import React, { useState, useEffect, useRef } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import './Tutorial.css';
const steps: Step[] = [
    {
        target: '.mode',
        content: 'You can switch between study mode and non-study mode through this switch.',
        title: "MODE SWITCH",
    },
    {
        target: '.panelcontainer',
        content: 'You can choose a task through this task panel, the tasks are sorted according to their categories.',
        title: "TASK PANEL",
    },
    {
        target: '.optionS',
        content: 'Click on this button to hide/show the task panel, let us practice it now, click it to hide the the task panel (PLEASE CLICK IT SO THE TUTORIAL PROCEED).',
        title: "SEARCH TASK",
    },
    {
        target: '.lowpart',
        content: 'This the feedback panel where you will access the feedback given by the our LLM along with the cumiltive grade to your promt with grades on specfic critereas.',
        title: "FEEDBACK PANEL",
    },
    {
        target: '.more-details-btn',
        content: 'Click on more details to have additional feedback on a specific criteria.',
        title: "CRITERIA FEEDBACK",
    },
    {
        target: '.TaskDlinex',
        content: 'Click on view task to open the description to the selected task.',
        title: "DESCRIPTION",
    },
    {
        target: '.chatbigcontainter',
        content: 'This is the conversation panel, where the magic happens.',
        title: "CONVERSATION PANEL",
    },
    {
        target: '.option',
        content: 'You can select LLMs through clicking on the LLM name, you can have one LLM per conversation, clicking on a different LLM that it is not used in the current conversation will automatically create a new conversation with selected LLM.',
        title: "LLM SWITCH",
    },
    {
        target: '.sidebarhidden',
        content: 'This is the sidebar when it is hidden.',
        title: "SIDEBAR",
    },
    {
        target: '.tutomenuiconhidden',
        content: 'Click the menu icon so it expands and you will be able to access its functionalities (PLEASE CLICK IT SO THE TUTORIAL PROCEED).',
    },
    {
        target: '.sidebar',
        content: 'This is the sidebar in full glory.',
        title: "SIDEBAR",
    },
    {
        target: '.chaticonhidden',
        content: 'Click on the chat icon to create a new conversation.',
        title: "NEW CHAT",
    },
    {
        target: '.queries',
        content: 'This is your query list for today.',
        title: "QUERIES",
    },
    {
        target: '.deleteicon',
        content: 'Click on this icon to delete this query from your history.',
        title: "DELETION",
    },
    {
        target: '.editicon',
        content: 'Our LLM will assign a title to your query, if you do not like it you can change through clicking on this icon.',
        title: "TITLE EDIT",
    },
    {
        target: '.likeicon',
        content: 'If you like a query and want to save it click on this icon.',
        title: "LIKE A QUERY",
    },
    {
        target: '.favicon',
        content: 'To show only liked queries click on this icon.',
        title: "SHOW LIKED QUERY",
    },
    {
        target: '.inputField',
        content: 'Now you are familiar with our product,NOW LETS GET BETTER AT PROMPTING.',
        title: "START",
    },
];
interface TutorialProps {
    onClose: () => void;
}
const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
    const [run, setRun] = React.useState(true);



    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            localStorage.setItem('tutorialCompleted', 'true');
            setRun(false);
        }
    };


    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showSkipButton
            showProgress
            callback={handleJoyrideCallback}
            spotlightClicks={true}
            styles={{
                options: {
                    arrowColor: "#2287DA",
                    primaryColor: "#7B61FF",
                },
            }}
        />
    );
};

export default Tutorial;
