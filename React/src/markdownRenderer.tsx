import React, { useState, useEffect, useRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './markdownRenderer.css';


interface CodeProps {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any; // Allows additional properties
}

const MarkdownRenderer = memo(({ text }: { text: string }) => {
    const CodeBlock = ({ node, inline = false, className, children, ...props }: CodeProps) => {
        const [isMultiline, setIsMultiline] = useState(false);
        const codeRef = useRef<HTMLDivElement>(null);

        const checkMultiline = () => {
            if (codeRef.current) {
                const lineHeight = parseInt(getComputedStyle(codeRef.current).lineHeight, 10);
                const codeHeight = codeRef.current.offsetHeight;
                setIsMultiline(codeHeight > lineHeight);
            }
        };

        useEffect(() => {
            checkMultiline();
        }, [text]); // Trigger checkMultiline when text changes 

        return (
            <div style={{
                backgroundColor: isMultiline ? 'rgba(255, 255, 255, 0.85)' : 'transparent', // White background only if multiline
                border: isMultiline ? '1px solid #ccc' : 'none',       // Border only if multiline
                padding: isMultiline ? '10px' : '0',                   // Padding only if multiline
                borderRadius: isMultiline ? '3px' : '0',                // Rounded corners only if multiline
                width: '100%',                                          // Make the div cover full width
                boxSizing: 'border-box'                                 // Ensure padding is included in the width
            }}>
                <code ref={codeRef} style={{ 
                    color: '#7B61FF',
                    overflowWrap: 'break-word',  // Ensure long words break
                    wordWrap: 'break-word',     // Same as overflowWrap for older browsers
                    whiteSpace: 'pre-wrap', 
                    borderRadius: isMultiline ? '0' : '3px',
                }} {...props}>
                    {children}
                </code>
            </div>
        );
    };

    return (
        <ReactMarkdown
            className="markdown-body"
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ node, ...props }) => <h1 style={{ 
                    color: '#7B61FF', 
                    fontSize: '3rem',
                    lineHeight: '1.2',
                 }} {...props} />,
                h2: ({ node, ...props }) => <h2 style={{ 
                    fontSize: '2.3rem',
                    lineHeight: '1.2' 
                }} {...props} />,
                h3: ({ node, ...props }) => <h3 style={{
                    fontSize: '1.8rem',
                    lineHeight: '1.2'
                }} {...props} />,
                h4: ({ node, ...props }) => <h4 style={{
                    fontSize: '1.5rem',
                    lineHeight: '1.2'
                }} {...props} />,
                h5: ({ node, ...props }) => <h5 style={{
                    color: '#0060AE', 
                    fontSize: '1.2rem',
                    lineHeight: '1.2'
                }} {...props} />,
                code: CodeBlock,
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
