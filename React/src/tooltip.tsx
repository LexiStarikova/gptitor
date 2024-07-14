import React from 'react';
import './tooltip.css';

interface TooltipProps {
    content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content }) => {
    return <p className="tooltipi p3">{content}</p>;
};

export default Tooltip;
