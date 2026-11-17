import { createContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

export const AuthContext = createContext();

const DUMMY_PATTERNS = [
    /^test@/i,
    /^dummy/i,
    /^fake/i,
    /^temp/i,
    /^sample/i,
    /@example\.com$/i,
    /@test\.com$/i,
    /@dummy\.com$/i,
    /@fake\.com$/i
];

export const isValidRealEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const clean = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(clean)) return false;

    for (const pattern of DUMMY_PATTERNS) {
        if (pattern.test(clean)) return false;
    }
    return true;
};

const AuthContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authMessage, setAuthMessage] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                setIsAuthenticated(true);
            } catch (e) {
                console.error('Error parsing stored user:', e);
            }
        }
        setLoading(false);
    }, []);

    const showMessage = (message, type = 'info') => {
        setAuthMessage({ message, type });
        setTimeout(() => setAuthMessage(null), 3500);
    };

    const register = async (username, email, password) => {
        try {
            const cleanEmail = email.trim().toLowerCase();
            if (!isValidRealEmail(cleanEmail)) {
                const err = 'Please enter a valid, real email address (e.g. name@gmail.com). Dummy or test accounts are not allowed.';
                showMessage(err, 'error');
                return { success: false, error: err };
            }

            const response = await authAPI.register(username, cleanEmail, password);
            setUser(response.data.user);
            setIsAuthenticated(true);
            showMessage('Account created successfully! Welcome to Flux Music.', 'success');
            return { success: true, user: response.data.user };
        } catch (error) {
            console.error('Registration error:', error);
            const message = error.response?.data?.message || error.message || 'Registration failed. Please check backend connection.';
            showMessage(message, 'error');
            return { success: false, error: message };
        }
    };

    const login = async (email, password) => {
        try {
            const cleanEmail = email.trim().toLowerCase();
            if (!isValidRealEmail(cleanEmail)) {
                const err = 'Please enter a valid, real email address. Dummy accounts are blocked.';
                showMessage(err, 'error');
                return { success: false, error: err };
            }

            const response = await authAPI.login(cleanEmail, password);
            setUser(response.data.user);
            setIsAuthenticated(true);
            showMessage('Login successful! Welcome back.', 'success');
            return { success: true, user: response.data.user };
        } catch (error) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || error.message || 'Login failed. Please check credentials.';
            showMessage(message, 'error');
            return { success: false, error: message };
        }
    };

    const loginWithGoogle = async (realGmail, displayName) => {
        try {
            const cleanEmail = (realGmail || '').trim().toLowerCase();
            if (!cleanEmail || (!cleanEmail.endsWith('@gmail.com') && !cleanEmail.endsWith('@googlemail.com'))) {
                const err = 'Please provide a valid Google account ending with @gmail.com';
                showMessage(err, 'error');
                return { success: false, error: err };
            }
            if (!isValidRealEmail(cleanEmail)) {
                const err = 'Dummy accounts are not allowed. Please enter your real Gmail.';
                showMessage(err, 'error');
                return { success: false, error: err };
            }

            const response = await authAPI.googleAuth(cleanEmail, displayName);
            setUser(response.data.user);
            setIsAuthenticated(true);
            showMessage(`Welcome! Signed in with ${cleanEmail}`, 'success');
            return { success: true, user: response.data.user };
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Google sign-in failed';
            showMessage(msg, 'error');
            return { success: false, error: msg };
        }
    };

    const loginWithClever = async (email, name, school) => {
        try {
            const cleanEmail = (email || '').trim().toLowerCase();
            if (!cleanEmail) {
                const err = 'Please provide your school or Clever account email';
                showMessage(err, 'error');
                return { success: false, error: err };
            }
            if (!isValidRealEmail(cleanEmail) && !cleanEmail.endsWith('@clever.org') && !cleanEmail.includes('.edu')) {
                const err = 'Dummy accounts are not allowed. Please enter your real school/Clever email.';
                showMessage(err, 'error');
                return { success: false, error: err };
            }

            const response = await authAPI.cleverAuth(cleanEmail, name, school);
            setUser(response.data.user);
            setIsAuthenticated(true);
            showMessage(`Welcome! Signed in with Clever (${cleanEmail})`, 'success');
            return { success: true, user: response.data.user };
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Clever sign-in failed';
            showMessage(msg, 'error');
            return { success: false, error: msg };
        }
    };

    const loginWithOffice365 = async (email, name) => {
        try {
            const cleanEmail = (email || '').trim().toLowerCase();
            if (!cleanEmail) {
                const err = 'Please provide your Microsoft or Office 365 email';
                showMessage(err, 'error');
                return { success: false, error: err };
            }
            if (!isValidRealEmail(cleanEmail)) {
                const err = 'Dummy accounts are not allowed. Please enter your real Microsoft/Office 365 email.';
                showMessage(err, 'error');
                return { success: false, error: err };
            }

            const response = await authAPI.officeAuth(cleanEmail, name);
            setUser(response.data.user);
            setIsAuthenticated(true);
            showMessage(`Welcome! Signed in with Office 365 (${cleanEmail})`, 'success');
            return { success: true, user: response.data.user };
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Office 365 sign-in failed';
            showMessage(msg, 'error');
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
        setIsAuthenticated(false);
        showMessage('Logged out successfully', 'success');
    };

    const upgradeToPremium = (planName = 'Premium Individual') => {
        const updatedUser = {
            ...(user || { username: 'Flux Member', email: 'member@gmail.com' }),
            isPremium: true,
            premiumPlan: planName,
            premiumSince: new Date().toISOString()
        };
        setUser(updatedUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showMessage(`🎉 Congratulations! You have unlocked ${planName}.`, 'success');
        return { success: true, user: updatedUser };
    };

    const cancelPremium = () => {
        if (!user) return;
        const updatedUser = {
            ...user,
            isPremium: false,
            premiumPlan: null
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showMessage('Your Premium membership has been canceled.', 'info');
        return { success: true, user: updatedUser };
    };

    const contextValue = {
        user,
        isAuthenticated,
        loading,
        authMessage,
        register,
        login,
        loginWithGoogle,
        loginWithClever,
        loginWithOffice365,
        logout,
        upgradeToPremium,
        cancelPremium,
        showMessage
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
