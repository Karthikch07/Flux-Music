import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackendRequired = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-[#121212] rounded-lg p-8 text-center">
                <div className="mb-6">
                    <svg className="w-20 h-20 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Backend Not Connected</h1>
                <p className="text-gray-400 mb-6">
                    This application requires a backend API to function. The backend is not currently deployed or accessible.
                </p>
                <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6 text-left">
                    <h2 className="text-xl font-semibold text-white mb-4">What you can do:</h2>
                    <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">1.</span>
                            <span><strong>Run Locally:</strong> Clone the repository and follow the setup instructions in README.md to run both frontend and backend locally.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">2.</span>
                            <span><strong>Deploy Backend:</strong> Deploy the backend folder to a Node.js hosting service (Heroku, Railway, Render, etc.) with MongoDB.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">3.</span>
                            <span><strong>Configure Environment:</strong> Set the VITE_API_URL environment variable to point to your deployed backend.</span>
                        </li>
                    </ul>
                </div>
                <div className="flex gap-4 justify-center">
                    <a 
                        href="https://github.com/Karthikch07/Flux-Music" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-green-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-green-400 transition"
                    >
                        View on GitHub
                    </a>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-[#282828] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#3E3E3E] transition"
                    >
                        Retry Connection
                    </button>
                </div>
                <p className="text-gray-500 text-sm mt-6">
                    API URL: {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}
                </p>
            </div>
        </div>
    );
};

export default BackendRequired;
