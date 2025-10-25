import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setIsLoading(true);
        const result = await register(username, email, password);
        setIsLoading(false);
        if (result.success) {
            navigate('/');
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-black px-4">
            <div className="max-w-md w-full space-y-8 bg-black/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-800">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400">Join Flux Music today</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Choose a username"
                            />
                        </div>
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
                                placeholder="Create a password"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Confirm your password"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                    <div className="text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-purple-500 hover:text-purple-400 font-medium"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Register;
