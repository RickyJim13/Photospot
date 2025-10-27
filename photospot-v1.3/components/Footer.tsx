import React from 'react';

interface FooterProps {
    onShowTerms: () => void;
    onShowPrivacy: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowTerms, onShowPrivacy }) => {
    return (
        <footer className="w-full p-4 text-center text-gray-400 text-sm">
            <div className="max-w-4xl mx-auto flex justify-center items-center">
                <div className="flex items-center space-x-4">
                    <span>Made with ❤️ by Photospot</span>
                    <span className="text-gray-600">|</span>
                    <button onClick={onShowTerms} className="hover:text-blue-300 hover:underline transition-colors">Terms of Service</button>
                    <span className="text-gray-600">|</span>
                    <button onClick={onShowPrivacy} className="hover:text-blue-300 hover:underline transition-colors">Privacy Policy</button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;