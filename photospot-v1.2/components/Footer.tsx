import React from 'react';
import { HeartIcon } from './icons';

const Footer: React.FC = () => {
    const kofiUrl = 'https://ko-fi.com/F2F71N7N3S';
    return (
        <footer className="w-full p-4 text-center text-gray-400 text-sm">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                <p>Made with ❤️ by Photospot</p>
                <a 
                    href={kofiUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                    <HeartIcon className="w-4 h-4 mr-2" />
                    Enjoying the app? Support on Ko-fi
                </a>
            </div>
        </footer>
    );
};

export default Footer;