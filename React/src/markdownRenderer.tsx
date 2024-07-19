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

        const codeColor = containerColor === '#2287DA' ? '#2287DA' : '#7B61FF';
        // Set larger font size if background is #2287DA
        const fontSize = containerColor === '#2287DA' ? '1.15em' : '1em'; 

        const checkMultiline = () => {
            if (codeRef.current) {
                const lineHeight = parseInt(getComputedStyle(codeRef.current).lineHeight, 10);
                const codeHeight = codeRef.current.offsetHeight;
                setIsMultiline(codeHeight > lineHeight);
            }
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


        const shouldHighlight = isMultiline || isIsolated;

        return (
            <div style={{
                backgroundColor: shouldHighlight ? 'rgba(255, 255, 255, 0.9)' : 'transparent', // White background only if multiline
                border: shouldHighlight ? '1px solid #ccc' : 'none',       // Border only if multiline
                padding: shouldHighlight ? '5px' : '0',                   // Padding only if multiline
                borderRadius: shouldHighlight ? '3px' : '0',                // Rounded corners only if multiline
                width: '100%',                                          // Make the div cover full width
                boxSizing: 'border-box'                                 // Ensure padding is included in the width
            }}>
                <code ref={codeRef} style={{ 
                    color: codeColor, // Use dynamic color here
                    fontWeight: 'normal', 
                    fontSize: fontSize,
                    overflowWrap: 'break-word',  // Ensure long words break
                    wordWrap: 'break-word',     // Same as overflowWrap for older browsers
                    whiteSpace: 'pre-wrap', 
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
