import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await login(email, password);
        setIsLoading(false);
        if (result.success) {
            navigate('/');
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-black px-4">
            <div className="max-w-md w-full space-y-8 bg-black/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-800">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Login to continue to Flux Music</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <div className="text-center">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="text-purple-500 hover:text-purple-400 font-medium"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Login;
