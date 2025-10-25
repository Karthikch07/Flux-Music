import { createContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
export const AuthContext = createContext();
const AuthContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authMessage, setAuthMessage] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);
    const showMessage = (message, type = 'info') => {
        setAuthMessage({ message, type });
        setTimeout(() => setAuthMessage(null), 3000);
    };
    const register = async (username, email, password) => {
        try {
            console.log('Attempting registration...', { username, email });
            const response = await authAPI.register(username, email, password);
            console.log('Registration response:', response);
            setUser(response.data.user);
            setIsAuthenticated(true);
            showMessage('Account created successfully!', 'success');
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            const message = error.response?.data?.message || error.message || 'Registration failed. Please check backend connection.';
            showMessage(message, 'error');
            return { success: false, error: message };
        }
    };
    const login = async (email, password) => {
        try {
            console.log('Attempting login...', { email });
            const response = await authAPI.login(email, password);
            console.log('Login response:', response);
            setUser(response.data.user);
            setIsAuthenticated(true);
            showMessage('Login successful!', 'success');
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || error.message || 'Login failed. Please check backend connection.';
            showMessage(message, 'error');
            return { success: false, error: message };
        }
    };
    const logout = () => {
        authAPI.logout();
        setUser(null);
        setIsAuthenticated(false);
        showMessage('Logged out successfully', 'success');
    };
    const contextValue = {
        user,
        isAuthenticated,
        loading,
        authMessage,
        register,
        login,
        logout,
        showMessage
    };
    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};
export default AuthContextProvider;
