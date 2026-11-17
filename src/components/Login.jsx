import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, isValidRealEmail } from '../context/AuthContext';
import { assets } from '../assets/assets';
import {
  Sparkles,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  ArrowRight,
  Database,
  ArrowLeft,
  Music,
  X
} from 'lucide-react';

// Official Google 4-Color SVG Icon
function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

/**
 * 60FPS Glowing Audio Visualizer Parallel to "Sign in to Flux Music"
 * - Automatically aligns its horizontal animation axis to be exactly PARALLEL to the "Sign in to Flux Music" button
 * - Flanking symmetrical equalizer beat bars stream out from the sides of the enlarged card
 * - Deep clean pitch-black (#050408) canvas with zero clumsiness and zero scrollbar
 */
function AudioLineRibbonBeatVisualizer({ targetElementRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.038;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;

      ctx.clearRect(0, 0, w, h);

      // Deep clean pitch black background
      ctx.fillStyle = '#050408';
      ctx.fillRect(0, 0, w, h);

      // =========================================================================
      // DYNAMICALLY ALIGN PARALLEL TO "SIGN IN TO FLUX MUSIC"
      // =========================================================================
      let parallelY = Math.min(h - 85, h * 0.72);
      let cardLeft = cx - 250;
      let cardRight = cx + 250;

      if (targetElementRef && targetElementRef.current) {
        const rect = targetElementRef.current.getBoundingClientRect();
        if (rect && rect.top > 0) {
          parallelY = rect.top + rect.height / 2;
        }
        const cardElem = targetElementRef.current.closest('.flux-login-card');
        if (cardElem) {
          const cardRect = cardElem.getBoundingClientRect();
          cardLeft = cardRect.left;
          cardRight = cardRect.right;
        }
      }

      const barSpacing = 8.5;
      const barWidth = 3.2;

      // 1. LEFT PARALLEL WING (Flanking the left side of "Sign in to Flux Music")
      ctx.save();
      const leftGrad = ctx.createLinearGradient(0, parallelY - 35, 0, parallelY + 35);
      leftGrad.addColorStop(0, '#ff5722');    // Fiery Orange
      leftGrad.addColorStop(0.35, '#ec4899'); // Hot Pink
      leftGrad.addColorStop(0.7, '#d946ef');  // Fuchsia
      leftGrad.addColorStop(1, '#a855f7');    // Purple
      ctx.fillStyle = leftGrad;
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 10;

      for (let x = 20; x < cardLeft - 12; x += barSpacing) {
        const normL = (x - 20) / Math.max(1, cardLeft - 32);
        const envelope = Math.sin(normL * Math.PI);

        // Music beat harmonics
        const b1 = Math.sin(x * 0.12 + time * 3.8);
        const b2 = Math.cos(x * 0.22 - time * 2.4);
        const b3 = Math.sin(time * 5.2 + x * 0.06) * 0.5;
        const amp = Math.abs(b1 * 0.5 + b2 * 0.35 + b3);
        const halfH = Math.max(2.5, amp * 30 * envelope);

        ctx.beginPath();
        ctx.roundRect(x - barWidth / 2, parallelY - halfH, barWidth, halfH * 2, barWidth / 2);
        ctx.fill();
      }

      // Left laser line connecting the wing directly to the button axis
      ctx.beginPath();
      ctx.moveTo(10, parallelY);
      ctx.lineTo(cardLeft - 8, parallelY);
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // 2. RIGHT PARALLEL WING (Flanking the right side of "Sign in to Flux Music")
      ctx.save();
      const rightGrad = ctx.createLinearGradient(0, parallelY - 35, 0, parallelY + 35);
      rightGrad.addColorStop(0, '#22d3ee');   // Electric Cyan
      rightGrad.addColorStop(0.35, '#38bdf8'); // Sky Blue
      rightGrad.addColorStop(0.7, '#6366f1');  // Indigo
      rightGrad.addColorStop(1, '#8b5cf6');    // Violet
      ctx.fillStyle = rightGrad;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;

      for (let x = cardRight + 12; x < w - 20; x += barSpacing) {
        const normR = (x - (cardRight + 12)) / Math.max(1, w - cardRight - 32);
        const envelope = Math.sin(normR * Math.PI);

        // Music beat harmonics
        const b1 = Math.sin(x * 0.11 - time * 3.6);
        const b2 = Math.cos(x * 0.20 + time * 2.8);
        const b3 = Math.sin(time * 4.8 + x * 0.05) * 0.5;
        const amp = Math.abs(b1 * 0.5 + b2 * 0.35 + b3);
        const halfH = Math.max(2.5, amp * 30 * envelope);

        ctx.beginPath();
        ctx.roundRect(x - barWidth / 2, parallelY - halfH, barWidth, halfH * 2, barWidth / 2);
        ctx.fill();
      }

      // Right laser line connecting the wing directly to the button axis
      ctx.beginPath();
      ctx.moveTo(cardRight + 8, parallelY);
      ctx.lineTo(w - 10, parallelY);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // 3. MINIMAL AMBIENT GLOW ALONG THE PARALLEL AXIS BEHIND CARD
      const centerGlow = ctx.createRadialGradient(cx, parallelY, 20, cx, parallelY, cx * 0.8);
      centerGlow.addColorStop(0, 'rgba(168, 85, 247, 0.08)');
      centerGlow.addColorStop(0.5, 'rgba(59, 130, 246, 0.04)');
      centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, w, h);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [targetElementRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none select-none" />;
}

const Login = ({ initialMode = "signin" }) => {
  const { login, register, loginWithGoogle, loginWithPhone, verifyPhoneOTP } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Ref to the "Sign in to Flux Music" button for exact parallel animation alignment
  const submitButtonRef = useRef(null);

  // Mode: "signin" | "phone" | "signup"
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    if (location.pathname === '/register') {
      setMode('signup');
    }
  }, [location.pathname]);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Phone states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [phoneStep, setPhoneStep] = useState("enter-number"); // "enter-number" | "enter-otp"

  // Google Real Gmail Modal
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [googleError, setGoogleError] = useState("");

  // Forgot password modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // Feedback states
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(false);

  // Validate that email is not a dummy account
  const validateRealEmailInput = (inputEmail) => {
    if (!inputEmail || !inputEmail.trim()) {
      return "Email address is required.";
    }
    const clean = inputEmail.trim().toLowerCase();
    if (!isValidRealEmail(clean)) {
      return "Please enter a valid, real email address (e.g. yourname@gmail.com). Dummy accounts like test@, fake@, dummy@ are blocked.";
    }
    return null;
  };

  // Handle Real Gmail Authentication
  const handleRealGmailSubmit = async (e) => {
    e.preventDefault();
    setGoogleError("");
    const clean = (googleEmail || "").trim().toLowerCase();

    if (!clean || (!clean.endsWith('@gmail.com') && !clean.endsWith('@googlemail.com'))) {
      setGoogleError("Only real Google accounts (@gmail.com) are accepted.");
      return;
    }

    if (!isValidRealEmail(clean)) {
      setGoogleError("Dummy account detected. Please enter your real personal Gmail address.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithGoogle(clean, googleName);
      if (res.success) {
        setShowGoogleModal(false);
        setSuccessMessage(`Welcome! Signed in with ${clean}`);
        setTimeout(() => navigate('/'), 700);
      } else {
        setGoogleError(res.error || "Google sign-in failed.");
      }
    } catch (err) {
      setGoogleError(err.message || "Failed to authenticate with Google.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Standard Email Sign-in / Sign-up
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const emailErr = validateRealEmailInput(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (mode === "signup") {
      if (!username.trim()) {
        setError("Please enter a username.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    try {
      let res;
      if (mode === "signup") {
        res = await register(username.trim(), email.trim(), password);
      } else {
        res = await login(email.trim(), password);
      }

      if (res.success) {
        setSuccessMessage(mode === "signup" ? "Account created successfully!" : "Signed in successfully!");
        setTimeout(() => navigate('/'), 700);
      } else {
        setError(res.error || "Authentication failed. Please verify credentials.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Phone SMS OTP Request
  const handleSendPhoneOTP = async (e) => {
    e.preventDefault();
    setError(null);
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 8) {
      setError("Please enter a valid mobile phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithPhone(phoneNumber);
      if (res.success) {
        setPhoneStep("enter-otp");
        setSuccessMessage("Verification code sent via SMS!");
      } else {
        setError(res.error || "Failed to send SMS OTP.");
      }
    } catch (err) {
      setError(err.message || "Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Phone OTP Verification
  const handleVerifyPhoneOTP = async (e) => {
    e.preventDefault();
    setError(null);
    if (!verificationCode || verificationCode.length < 4) {
      setError("Please enter the verification code received via SMS.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyPhoneOTP(phoneNumber, verificationCode);
      if (res.success) {
        setSuccessMessage("Phone verified successfully! Redirecting...");
        setTimeout(() => navigate('/'), 700);
      } else {
        setError(res.error || "Invalid verification code.");
      }
    } catch (err) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Password Reset simulation
  const handlePasswordReset = (e) => {
    e.preventDefault();
    const err = validateRealEmailInput(resetEmail);
    if (err) {
      setError(err);
      return;
    }
    setShowResetModal(false);
    setSuccessMessage(`Password reset link sent to ${resetEmail}. Check your inbox!`);
    setResetEmail("");
  };

  return (
    <div className="h-screen max-h-screen w-full relative overflow-hidden flex flex-col justify-between select-none bg-[#050408] text-white">
      {/* 60FPS Glowing Audio Visualizer Parallel to "Sign in to Flux Music" */}
      <AudioLineRibbonBeatVisualizer targetElementRef={submitButtonRef} />

      {/* Top Header Navigation Bar (Compact, sleek, zero scroll down) */}
      <header className="w-full px-6 py-2.5 flex items-center justify-between relative z-20 shrink-0">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-cyan-500 flex items-center justify-center p-0.5 shadow-md shadow-purple-900/50 group-hover:scale-105 transition-transform">
            <img
              src={assets.flux_logo}
              alt="Flux Music"
              className="w-full h-full object-contain rounded-full bg-black/60"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-purple-300 transition-colors">
              fluxmusic
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Back to Studio Navigation Link */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs font-semibold px-3.5 py-1 rounded-full border border-[#2b273b] hover:border-purple-500 text-gray-300 hover:text-white bg-[#14121c]/90 backdrop-blur-md transition-all shadow-md flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Back to Studio</span>
          </button>
        </div>
      </header>

      {/* Main Content: Enlarged GlowGrace Card (Brought upper, zero scroll down) */}
      <main className="flex-1 w-full flex items-center justify-center px-4 py-0 relative z-10 min-h-0">
        <div className="w-full max-w-[465px] sm:max-w-[480px] flux-login-card rounded-2xl transition-all duration-300 p-6 sm:p-7 shadow-2xl relative border bg-[#110e19]/92 backdrop-blur-2xl border-[#2a243a] shadow-purple-950/70 -translate-y-2 sm:-translate-y-4">
          {/* Top Floating Badge with Glowing Music Icon */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white ring-2 ring-[#050408] shadow-purple-900/80">
              <Music className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          {/* Header Branding */}
          <div className="text-center mt-1.5 mb-3.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Flux Music
            </h1>
            <p className="text-xs mt-0.5 text-gray-400">
              High-Fidelity Audio Streaming & Beat Studio
            </p>

            {/* Active Project ID Pill Tag */}
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-medium border border-[#2f2842] bg-[#181324]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-gray-400">
                Project: <strong className="text-purple-300">flux-music-prod</strong>
              </span>
            </div>
          </div>

          {/* 3-Tab Pill Switcher (Email / Phone / Sign Up) */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-full mb-3 border bg-[#181324] border-[#2b253d]">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
              className={`h-8.5 text-xs sm:text-sm font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                mode === "signin"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-900/60"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("phone");
                setError(null);
                setPhoneStep("enter-number");
              }}
              className={`h-8.5 text-xs sm:text-sm font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                mode === "phone"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-900/60"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`h-8.5 text-xs sm:text-sm font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${
                mode === "signup"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-900/60"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Social Google Login Button (Large Pill with 4-Color G Logo) */}
          <button
            type="button"
            onClick={() => {
              setShowGoogleModal(true);
              setGoogleError("");
            }}
            className="w-full h-10 rounded-full border font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm bg-[#181324] border-[#2f2842] hover:border-purple-500 text-gray-100 hover:bg-[#201a30] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Continue with Google</span>
          </button>

          {/* Centered OR Divider */}
          <div className="relative my-2.5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#29223a]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2.5 font-bold tracking-widest text-[9px] bg-[#110e19] text-gray-500">
                OR SIGN IN WITH {mode === "phone" ? "PHONE" : mode === "signup" ? "DETAILS" : "EMAIL"}
              </span>
            </div>
          </div>

          {/* Error & Success Feedback Alerts */}
          {error && (
            <div className="mb-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ================= MODE: PHONE SMS OTP FLOW ================= */}
          {mode === "phone" ? (
            <form onSubmit={phoneStep === "enter-number" ? handleSendPhoneOTP : handleVerifyPhoneOTP} className="space-y-2.5">
              {phoneStep === "enter-number" ? (
                <div>
                  <label className="block text-[11px] font-bold mb-1 text-gray-300">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 rounded-lg border text-xs transition-all focus:outline-none bg-[#181324] border-[#2f2842] text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <p className="text-[10px] mt-0.5 text-gray-500">
                    We will send a one-time secure verification code via SMS.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold mb-1 text-gray-300">
                    Enter 6-Digit SMS Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full h-9 px-3 text-center tracking-widest font-mono text-sm font-bold rounded-lg border transition-all focus:outline-none bg-[#181324] border-[#2f2842] text-white focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPhoneStep("enter-number")}
                    className="text-[10px] text-purple-400 hover:underline mt-1 block"
                  >
                    Change phone number
                  </button>
                </div>
              )}

              <button
                ref={submitButtonRef}
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl font-bold text-sm text-white shadow-lg shadow-purple-900/50 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span>{phoneStep === "enter-number" ? "Send Verification Code" : "Verify & Sign In"}</span>
                )}
              </button>
            </form>
          ) : (
            /* ================= MODE: EMAIL SIGN IN & SIGN UP FLOW ================= */
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* Username field (Sign Up only) */}
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-300">
                    Username
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. alexmusic"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none bg-[#181324] border-[#2f2842] text-white focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none bg-[#181324] border-[#2f2842] text-white focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-300">
                    Password
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setShowResetModal(true)}
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 pl-10 pr-10 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none bg-[#181324] border-[#2f2842] text-white focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Sign Up only) */}
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none bg-[#181324] border-[#2f2842] text-white focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button ("Sign in to Flux Music" Parallel to Screen Beat Visualizer) */}
              <div className="pt-2">
                <button
                  ref={submitButtonRef}
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl font-bold text-sm sm:text-base text-white shadow-lg shadow-purple-900/50 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <div className="flex items-center justify-center gap-2.5">
                      {mode === "signin" && (
                        <div className="flex items-end gap-1 h-3.5 mr-0.5">
                          <span className="w-1 bg-cyan-300 rounded-full animate-pulse h-2" />
                          <span className="w-1 bg-white rounded-full animate-bounce h-3.5" />
                          <span className="w-1 bg-fuchsia-300 rounded-full animate-pulse h-2.5" />
                        </div>
                      )}
                      <span className="tracking-wide">{mode === "signup" ? "Create Flux Account" : "Sign in to Flux Music"}</span>
                      {mode === "signin" && (
                        <div className="flex items-end gap-1 h-3.5 ml-0.5">
                          <span className="w-1 bg-fuchsia-300 rounded-full animate-pulse h-2.5" />
                          <span className="w-1 bg-white rounded-full animate-bounce h-3.5" />
                          <span className="w-1 bg-cyan-300 rounded-full animate-pulse h-2" />
                        </div>
                      )}
                    </div>
                  )}
                </button>

                {/* Down animation pulse indicator directly below Sign in to Flux Music */}
                <div className="flex items-center justify-center gap-2 mt-2 opacity-60">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                  <span className="text-[10px] font-mono tracking-widest text-purple-300 uppercase flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
                    AUDIO BEAT PARALLEL SYNC
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent" />
                </div>
              </div>
            </form>
          )}

          {/* Bottom Switcher */}
          <div className="text-center mt-2 pt-2 border-t border-gray-800/80">
            <p className="text-[11px] text-gray-400">
              {mode === "signup" ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                    }}
                    className="font-bold text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                    }}
                    className="font-bold text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </main>

      {/* Footer copyright (Compact) */}
      <footer className="w-full text-center py-1.5 text-[10px] relative z-20 opacity-50 text-gray-400 shrink-0">
        <span>© 2026 Flux Music. All rights reserved. High-fidelity audio architecture.</span>
      </footer>

      {/* ================= MODAL: REAL GMAIL SIGN IN ================= */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl relative border bg-[#14101e] border-[#2e2642] text-white">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <GoogleIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Sign in with Google</h3>
                <p className="text-xs text-gray-400">Enter your real personal Gmail account</p>
              </div>
            </div>

            {googleError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {googleError}
              </div>
            )}

            <form onSubmit={handleRealGmailSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-300">Gmail Address *</label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none bg-[#1c162b] border-[#342b4b] text-white focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-gray-300">Your Display Name (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none bg-[#1c162b] border-[#342b4b] text-white focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-11 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Verify & Continue"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="px-4 h-11 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: FORGOT PASSWORD ================= */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl relative border bg-[#14101e] border-[#2e2642] text-white">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold mb-1">Reset Password</h3>
            <p className="text-xs text-gray-400 mb-4">
              Enter your real registered email to receive a password reset link.
            </p>

            <form onSubmit={handlePasswordReset} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-300">Registered Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@gmail.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border text-sm focus:outline-none bg-[#1c162b] border-[#342b4b] text-white focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 h-11 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;