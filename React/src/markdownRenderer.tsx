import React, { useState, useEffect, useRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './markdownRenderer.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
    containerColor: string; // Pass the container color as a prop
    text: string;
}

interface CodeProps {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any; // Allows additional properties
    containerColor: string; // Pass the container color as a prop
}

const MarkdownRenderer = memo(({ text, containerColor } : MarkdownRendererProps) => {
    const CodeBlock = ({ node, inline = false, className, children, ...props }: CodeProps) => {
        const [isMultiline, setIsMultiline] = useState(false);
        const [isIsolated, setIsIsolated] = useState(false);
        const codeRef = useRef<HTMLDivElement>(null);

        const codeColor = containerColor === '#2287DA' ? 'white' : '#7B61FF';
        const fontWeight = containerColor === '#2287DA' ? 'bold' : 'normal';
       
        // Check if the code block is multiline based on the presence of newline characters
        const checkMultiline = () => {
            // Check if `children` contains newline characters
            const codeContent = typeof children === 'string' ? children : (children as React.ReactElement).props.children;
            setIsMultiline(codeContent.includes('\n'));
        };

        const checkIsolated = () => {
            if (codeRef.current) {
                const parent = codeRef.current.parentNode;
                if (parent) {
                    const previousSibling = codeRef.current.previousSibling;
                    const nextSibling = codeRef.current.nextSibling;

                    const previousText = previousSibling?.textContent || '';
                    const nextText = nextSibling?.textContent || '';

                    const isStartingFromNewLine = !previousSibling || previousText.endsWith('\n');
                    const isFollowedByNewLine = !nextSibling || nextText.startsWith('\n');
                    setIsIsolated(isStartingFromNewLine && isFollowedByNewLine);
                }
            }
        };

        useEffect(() => {
            checkMultiline();
            checkIsolated();
        }, [text]); // Trigger checks when text changes


        const backgroundColor = (isMultiline && containerColor !== '#2287DA') ? 'rgba(255, 255, 255, 0.8)' : 'transparent';
        const border = (isMultiline && containerColor !== '#2287DA') ? '1px solid #ccc' : 'none';
        const borderRadius = isMultiline ? '3px' : '0';
        const width = isMultiline ? '100%' : 'fit-content';
        const boxSizing = isMultiline ? 'border-box' : 'content-box';
        const margin = (isMultiline || isIsolated) ? '0 5px' : '0'; // Add margin for spacing
        const display = isIsolated && !inline ? 'block' : 'inline';

        return (
            <div style={{
                backgroundColor: backgroundColor, // White background only if multiline
                border: border,       // Border only if multiline
                padding: isMultiline ? '3px' : '0',                   // Padding only if multiline
                borderRadius: borderRadius,                // Rounded corners only if multiline
                width: width,                                          // Make the div cover full width
                boxSizing: boxSizing,                                 // Ensure padding is included in the width
                overflow: 'auto',
                display: display
            }}>
                <code ref={codeRef} style={{ 
                    color: codeColor, // Use dynamic color here
                    fontWeight: fontWeight, 
                    fontSize: '1em',
                    overflowWrap: 'break-word',  // Ensure long words break
                    wordWrap: 'break-word',     // Same as overflowWrap for older browsers
                    whiteSpace: 'pre-wrap', 
                    margin: margin,
                }} {...props}>
                    {children}
                </code>
            </div>
        );
    };

    return (
        <ReactMarkdown
            className="markdown-body"
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                h1: ({ node, ...props }) => <h1 style={{ 
                    color: '#7B61FF', 
                    fontSize: '2rem',
                    lineHeight: '1.2',
                 }} {...props} />,
                h2: ({ node, ...props }) => <h2 style={{ 
                    fontSize: '1.8rem',
                    lineHeight: '1.2' 
                }} {...props} />,
                h3: ({ node, ...props }) => <h3 style={{
                    fontSize: '1.5rem',
                    lineHeight: '1.2'
                }} {...props} />,
                h4: ({ node, ...props }) => <h4 style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.2'
                }} {...props} />,
                h5: ({ node, ...props }) => <h5 style={{
                    color: '#0060AE', 
                    fontSize: '1rem',
                    lineHeight: '1.2'
                }} {...props} />,
                h6: ({ node, ...props }) => <h6 style={{
                    color: '#0060AE', 
                    fontSize: '0.8rem',
                    lineHeight: '1.2'
                }} {...props} />,
                code: (props) => <CodeBlock {...props} containerColor={containerColor} />,
                a: ({ node, ...props }) => <a style={{ 
                    color: '#7B61FF', 
                    overflowWrap: 'break-word',  // Ensure long words break
                    wordWrap: 'break-word',     // Same as overflowWrap for older browsers
                    whiteSpace: 'pre-wrap',  
                }} {...props} />,
                li: ({ node, ...props }) => <li style={{
                    fontSize: '0.9rem',
                    lineHeight: '1.5'
                }} {...props} />
            }}
        >
            {text}
        </ReactMarkdown>
    );
});

export default MarkdownRenderer;
