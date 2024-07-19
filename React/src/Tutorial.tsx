// src/components/Tutorial.tsx
import React, { useState, useEffect, useRef } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import './Tutorial.css';
const steps: Step[] = [
    {
        target: '.mode',
        content: 'You can switch between study mode and non-study mode through this switch.',
        title: "MODE SWITCH",
        disableBeacon: true,
    },
    {
        target: '.panelcontainer',
        content: 'You can choose a task through this task panel, the tasks are sorted according to their categories.',
        title: "TASK PANEL",
        disableBeacon: true,
    },
    {
        target: '.optionS',
        content: 'Click on this button to hide/show the task panel, let us practice it now, click it to hide the the task panel (PLEASE CLICK IT SO THE TUTORIAL PROCEED).',
        title: "SEARCH TASK",
        disableBeacon: true,
    },
    {
        target: '.lowpart',
        content: 'This the feedback panel where you will access the feedback given by the our LLM along with the cumiltive grade to your promt with grades on specfic critereas.',
        title: "FEEDBACK PANEL",
        disableBeacon: true,
    },
    {
        target: '.more-details-btn',
        content: 'Click on more details to have additional feedback on a specific criteria.',
        title: "CRITERIA FEEDBACK",
        disableBeacon: true,
    },
    {
        target: '.TaskDlinex',
        content: 'Click on view task to open the description to the selected task.',
        title: "DESCRIPTION",
        disableBeacon: true,
    },
    {
        target: '.chatbigcontainter',
        content: 'This is the conversation panel, where the magic happens.',
        title: "CONVERSATION PANEL",
        disableBeacon: true,
    },
    {
        target: '.option',
        content: 'You can select LLMs through clicking on the LLM name, you can have one LLM per conversation, clicking on a different LLM that it is not used in the current conversation will automatically create a new conversation with selected LLM.',
        title: "LLM SWITCH",
        disableBeacon: true,
    },
    {
        target: '.sidebarhidden',
        content: 'This is the sidebar when it is hidden.',
        title: "SIDEBAR",
        disableBeacon: true,
    },
    {
        target: '.tutomenuiconhidden',
        content: 'Click the menu icon so it expands and you will be able to access its functionalities (PLEASE CLICK IT SO THE TUTORIAL PROCEED).',
        disableBeacon: true,
    },
    {
        target: '.sidebar',
        content: 'This is the sidebar in full glory.',
        title: "SIDEBAR",
        disableBeacon: true,
    },
    {
        target: '.chaticonhidden',
        content: 'Click on the chat icon to create a new conversation.',
        title: "NEW CHAT",
        disableBeacon: true,
    },
    {
        target: '.queries',
        content: 'This is your query list for today.',
        title: "QUERIES",
        disableBeacon: true,
    },
    {
        target: '.deleteicon',
        content: 'Click on this icon to delete this query from your history.',
        title: "DELETION",
        disableBeacon: true,
    },
    {
        target: '.editicon',
        content: 'Our LLM will assign a title to your query, if you do not like it you can change through clicking on this icon.',
        title: "TITLE EDIT",
        disableBeacon: true,
    },
    {
        target: '.likeicon',
        content: 'If you like a query and want to save it click on this icon.',
        title: "LIKE A QUERY",
        disableBeacon: true,
    },
    {
        target: '.favicon',
        content: 'To show only liked queries click on this icon.',
        title: "SHOW LIKED QUERY",
        disableBeacon: true,
    },
    {
        target: '.inputField',
        content: 'Now you are familiar with our product,NOW LETS GET BETTER AT PROMPTING.',
        title: "START",
        disableBeacon: true,
    },
];
interface TutorialProps {
    runTutorial: boolean;
    onClose: () => void;
}
const Tutorial: React.FC<TutorialProps> = ({ runTutorial, onClose }) => {
    const [run, setRun] = React.useState(true);
    useEffect(() => {
        if (runTutorial) {
            setRun(true);
        }
    }, [runTutorial]);


    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            localStorage.setItem('tutorialCompleted', 'true');
            setRun(false);
            setTimeout(() => setRun(true), 0);
            onClose();
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
