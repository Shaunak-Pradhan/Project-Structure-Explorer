
import React from 'react';

const MarkdownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16" {...props}>
        <path d="M12.5 0h-9A1.5 1.5 0 0 0 2 1.5v13A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 12.5 0zM3.5 15h-1a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5h1v14zM12.5 15h-9V1h9v14z"/>
        <path d="M5.924 10.952h1.535L8.23 8.31h.022l.772 2.642h1.535L9.22 6.35h-1.5L5.924 10.952zM4.5 11V6.5h1.5l1.031 1.63 1.031-1.63H9.5V11h-1.5V8.156L7.156 9.87h-.022L6 8.156V11H4.5z"/>
    </svg>
);

export default MarkdownIcon;
