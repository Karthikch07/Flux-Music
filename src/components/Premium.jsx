import React, { useState, useContext } from 'react';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';
import { PlayerContext } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Sparkles,
  Check,
  Zap,
  Sliders,
  Download,
  ShieldCheck,
  Headphones,
  Music,
  Radio,
  Volume2,
  Disc,
  Layers,
  ArrowRight,
  CreditCard,
  X,
  Laptop,
  CheckCircle2,
  Flame,
  Star,
  QrCode,
  Building2,
  Smartphone
} from 'lucide-react';

const PLANS = [
  {
    id: 'student',
    name: 'Student Discount',
    badge: 'COLLEGE PASS • 50% OFF',
    priceMonthly: 49,
    priceYearly: 499,
    period: 'month',
    desc: 'Full Individual Premium access at an affordable price for verified college students in India.',
    features: [
      '1 Verified Student Account',
      'Lossless FLAC & 320 kbps Hi-Fi Audio',
      'Zero Ads • 100% Uninterrupted Listening',
      'Offline Download Cache for flights & study halls',
      'Renewable every academic year'
    ],
    popular: false,
    gradient: 'from-amber-600/30 to-orange-900/40',
    border: 'border-amber-500/30',
    buttonColor: 'bg-amber-600 hover:bg-amber-500'
  },
  {
    id: 'individual',
    name: 'Individual Premium',
    badge: 'Standard Pass',
    priceMonthly: 99,
    priceYearly: 999,
    period: 'month',
    desc: 'For one music lover who wants pure high-fidelity sound without interruptions.',
    features: [
      '1 Premium Account',
      'Lossless FLAC & 320 kbps Hi-Fi Audio',
      'Zero Ads • 100% Uninterrupted',
      'Unlimited Skips on All Songs & Albums',
      'Offline Download Cache for flights & travels',
      '5-Band Pro Studio Equalizer Presets'
    ],
    popular: false,
    gradient: 'from-blue-600/30 to-indigo-900/40',
    border: 'border-blue-500/30',
    buttonColor: 'bg-blue-600 hover:bg-blue-500'
  },
  {
    id: 'duo',
    name: 'Duo Premium',
    badge: 'For 2 Accounts',
    priceMonthly: 149,
    priceYearly: 1499,
    period: 'month',
    desc: '2 independent Premium accounts for couples, roommates, or friends sharing music.',
    features: [
      '2 Independent Premium Accounts',
      'Duo Mix: Auto-curated combined playlist',
      'Lossless FLAC High-Resolution Audio',
      'Zero Ad Interruptions for both listeners',
      'Offline Downloads & Unlimited Skips'
    ],
    popular: false,
    gradient: 'from-emerald-600/30 to-teal-900/40',
    border: 'border-emerald-500/30',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-500'
  },
  {
    id: 'studio-pro',
    name: 'Studio Pro & Family',
    badge: '⭐ MOST POPULAR • BEST VALUE',
    priceMonthly: 199,
    priceYearly: 1999,
    period: 'month',
    desc: 'Up to 6 accounts + exclusive AI Stem Studio, 24-bit 192kHz Masters & 3D Spatial Audio.',
    features: [
      'Up to 6 Individual Premium Accounts',
      '24-bit / 192kHz Studio Master Quality',
      'AI Stem Separator (Vocals, Drums, Bass, Melodies)',
      '3D Binaural Spatial Audio Engine',
      'Zero Ads across all family devices',
      'Family Shared Hub & Explicit Content Controls',
      'Unlimited Offline Storage on 5 devices each'
    ],
    popular: true,
    gradient: 'from-purple-600/40 via-fuchsia-600/30 to-pink-900/40',
    border: 'border-purple-500/60 shadow-[0_0_30px_rgba(168,85,247,0.25)]',
    buttonColor: 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
  }
];

const EQUALIZER_PRESETS = [
  { name: 'Bass Extreme', levels: [10, 7, 0, 3, 6] },
  { name: 'Studio Reference Flat', levels: [0, 0, 0, 0, 0] },
  { name: 'Vocal Air & Treble', levels: [-2, 2, 6, 8, 9] },
  { name: 'Electronic EDM Punch', levels: [8, 5, -1, 6, 8] },
  { name: 'Acoustic Warmth', levels: [4, 6, 3, 2, -1] }
];

const AUDIO_QUALITIES = [
  { id: 'standard', name: '128 kbps (Standard)', format: 'AAC Standard', note: 'Low data usage' },
  { id: 'hifi', name: '320 kbps (Hi-Fi)', format: 'MP3 High-Fidelity', note: 'Crisp studio details' },
  { id: 'lossless', name: '24-bit / 96kHz (Lossless FLAC)', format: 'FLAC Master Studio', note: 'Bit-perfect audio' },
  { id: 'spatial', name: 'Flux 3D Spatial Audio', format: '360° Binaural Stage', note: 'Immersive soundscape' }
];

const Premium = () => {
  const { user, isAuthenticated, upgradeToPremium, cancelPremium, showMessage } = useContext(AuthContext);
  const { track } = useContext(PlayerContext);
  const navigate = useNavigate();

  // State
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]); // Default to Studio Pro
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Interactive Live Feature Demo States
  const [activeQuality, setActiveQuality] = useState(
    localStorage.getItem('flux_audio_quality') || 'lossless'
  );
  const [activePreset, setActivePreset] = useState(EQUALIZER_PRESETS[0]);
  const [eqSliders, setEqSliders] = useState(EQUALIZER_PRESETS[0].levels);

  // AI Stem Studio Sliders
  const [stemVocals, setStemVocals] = useState(100);
  const [stemDrums, setStemDrums] = useState(100);
  const [stemBass, setStemBass] = useState(100);
  const [stemMelody, setStemMelody] = useState(100);
  const [isStemProcessing, setIsStemProcessing] = useState(false);

  // Offline Simulation State
  const [cachedSongsCount, setCachedSongsCount] = useState(14);
  const [isCaching, setIsCaching] = useState(false);

  // Handle Quality Change
  const handleSelectQuality = (id) => {
    setActiveQuality(id);
    localStorage.setItem('flux_audio_quality', id);
    showMessage(`Audio streaming set to: ${id.toUpperCase()}`, 'success');
  };

  // Handle Equalizer Preset
  const handleSelectPreset = (preset) => {
    setActivePreset(preset);
    setEqSliders(preset.levels);
    showMessage(`Equalizer preset changed to "${preset.name}"`, 'info');
  };

  // Handle Slider Change
  const handleEqSliderChange = (idx, value) => {
    const next = [...eqSliders];
    next[idx] = Number(value);
    setEqSliders(next);
  };

  // Handle Offline Caching Simulation
  const handleSimulateOfflineCache = () => {
    setIsCaching(true);
    setTimeout(() => {
      setIsCaching(false);
      setCachedSongsCount((prev) => prev + 1);
      showMessage(`Downloaded "${track?.name || 'Current Track'}" for offline playback!`, 'success');
    }, 1200);
  };

  // Handle Promo Code Apply
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'FLUX50' || clean === 'VIP50' || clean === 'STUDENT50') {
      setDiscountPercent(50);
      showMessage('50% promo code applied successfully!', 'success');
    } else if (clean === 'FREE100') {
      setDiscountPercent(100);
      showMessage('Special Access Code applied: 100% OFF!', 'success');
    } else {
      setPromoError('Invalid promo code. Try "FLUX50" for 50% discount.');
    }
  };

  // Handle Upgrade Checkout Submit
  const handleConfirmUpgrade = () => {
    upgradeToPremium(selectedPlan.name);
    setShowCheckoutModal(false);
  };

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState('');

  // Pricing calculations
  const calculatePrice = (plan) => {
    const base = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
    if (discountPercent > 0) {
      const discounted = base * (1 - discountPercent / 100);
      return Number.isInteger(discounted) ? discounted : Math.round(discounted);
    }
    return base;
  };

  return (
    <div className='min-h-full pb-16 text-white'>
      <Navbar />

      {/* Hero Banner Header */}
      <div className='relative mt-4 rounded-3xl overflow-hidden border border-purple-500/20 bg-gradient-to-b from-[#1c142c] via-[#120f1d] to-[#0c0a13] p-8 md:p-12 shadow-2xl'>
        {/* Ambient Atmospheric Bloom */}
        <div className='absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none' />
        <div className='absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-cyan-600/15 blur-3xl pointer-events-none' />

        <div className='relative z-10 max-w-3xl'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold tracking-wide uppercase mb-4'>
            <Crown className='w-4 h-4 text-amber-400 animate-pulse' />
            <span>Flux Premium Pass • 1 Month Free</span>
          </div>

          <h1 className='text-3xl md:text-5xl font-black tracking-tight text-white mb-3'>
            Listen Without Limits. <br />
            <span className='bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent'>
              Pure Studio Hi-Fi Audio.
            </span>
          </h1>

          <p className='text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-2xl'>
            Stream in 24-bit Lossless FLAC, isolate vocals with the AI Stem Studio, download unlimited tracks for offline flights, and enjoy 100% ad-free listening across all your devices.
          </p>

          {/* Current Membership Status Banner */}
          {user?.isPremium ? (
            <div className='p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between flex-wrap gap-3 mb-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2.5 rounded-full bg-amber-500/20 text-amber-400'>
                  <Crown className='w-5 h-5' />
                </div>
                <div>
                  <p className='text-sm font-bold text-amber-300'>You are a Premium Member!</p>
                  <p className='text-xs text-gray-400'>Active Plan: {user.premiumPlan || 'Flux Studio Pro'}</p>
                </div>
              </div>
              <button
                onClick={cancelPremium}
                className='text-xs font-semibold px-4 py-1.5 rounded-full border border-gray-600 text-gray-300 hover:text-red-400 hover:border-red-500/50 transition'
              >
                Cancel Subscription
              </button>
            </div>
          ) : (
            <div className='flex items-center gap-3 flex-wrap'>
              <button
                onClick={() => {
                  setSelectedPlan(PLANS[1]);
                  setShowCheckoutModal(true);
                }}
                className='px-6 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/60 transition-all hover:scale-105 flex items-center gap-2'
              >
                <Sparkles className='w-4 h-4 text-amber-300' />
                <span>Get 1 Month Free</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('plans-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className='px-5 py-3 rounded-full font-semibold text-sm border border-gray-700 bg-white/5 hover:bg-white/10 text-gray-200 transition'
              >
                View All Plans
              </button>
            </div>
          )}

          {/* Feature Badges Row */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-purple-500/15 text-xs text-gray-300'>
            <div className='flex items-center gap-2'>
              <Check className='w-4 h-4 text-cyan-400 shrink-0' />
              <span>Zero Ad Interruptions</span>
            </div>
            <div className='flex items-center gap-2'>
              <Check className='w-4 h-4 text-purple-400 shrink-0' />
              <span>24-bit / 96kHz FLAC</span>
            </div>
            <div className='flex items-center gap-2'>
              <Check className='w-4 h-4 text-fuchsia-400 shrink-0' />
              <span>Unlimited Offline Cache</span>
            </div>
            <div className='flex items-center gap-2'>
              <Check className='w-4 h-4 text-amber-400 shrink-0' />
              <span>AI Audio Stem Studio</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE PRO FEATURES DEMO SUITE (Live on the page)
      ========================================================================= */}
      <div className='mt-10'>
        <div className='flex items-center gap-2 mb-2'>
          <Sparkles className='w-5 h-5 text-purple-400' />
          <h2 className='text-2xl font-bold tracking-tight text-white'>Interactive Pro Feature Studio</h2>
        </div>
        <p className='text-sm text-gray-400 mb-6'>
          Experience the actual technology behind Flux Premium. Change streaming quality, isolate vocal stems, and adjust pro studio equalization.
        </p>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Feature 1: Lossless Audio Quality Engine */}
          <div className='rounded-2xl p-6 border border-[#2b253e] bg-[#141120] relative overflow-hidden'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2.5'>
                <div className='p-2 rounded-xl bg-cyan-500/10 text-cyan-400'>
                  <Disc className='w-5 h-5 animate-spin' style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <h3 className='font-bold text-base text-white'>Audio Resolution Engine</h3>
                  <p className='text-xs text-gray-400'>Select your preferred stream bit-rate</p>
                </div>
              </div>
              <span className='px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'>
                {activeQuality.toUpperCase()} ACTIVE
              </span>
            </div>

            <div className='space-y-2.5'>
              {AUDIO_QUALITIES.map((q) => (
                <div
                  key={q.id}
                  onClick={() => handleSelectQuality(q.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    activeQuality === q.id
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                      : 'bg-[#181426] border-[#29223a] text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${activeQuality === q.id ? 'border-purple-400 bg-purple-500' : 'border-gray-500'}`}>
                      {activeQuality === q.id && <div className='w-1.5 h-1.5 rounded-full bg-white' />}
                    </div>
                    <div>
                      <p className='text-xs font-bold'>{q.name}</p>
                      <p className='text-[11px] text-gray-400'>{q.format} • {q.note}</p>
                    </div>
                  </div>
                  {q.id === 'lossless' && (
                    <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30'>
                      Hi-Res Master
                    </span>
                  )}
                  {q.id === 'spatial' && (
                    <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'>
                      3D Binaural
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Audio Engine Telemetry */}
            <div className='mt-4 p-3 rounded-xl bg-[#0e0c16] border border-gray-800 text-[11px] font-mono text-gray-400 flex items-center justify-between'>
              <span>Sample Rate: 96,000 Hz</span>
              <span>Bit Depth: 24-bit Float</span>
              <span className='text-emerald-400'>Lossless Codec: Active</span>
            </div>
          </div>

          {/* Feature 2: AI Stem Studio Mixer */}
          <div className='rounded-2xl p-6 border border-[#2b253e] bg-[#141120] relative overflow-hidden'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2.5'>
                <div className='p-2 rounded-xl bg-purple-500/10 text-purple-400'>
                  <Layers className='w-5 h-5' />
                </div>
                <div>
                  <h3 className='font-bold text-base text-white'>AI Stem Studio Isolator</h3>
                  <p className='text-xs text-gray-400'>Isolate and remix real-time track elements</p>
                </div>
              </div>
              <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30'>
                Flux AI Neural Core
              </span>
            </div>

            <div className='space-y-3.5'>
              {/* Stem: Vocals */}
              <div>
                <div className='flex items-center justify-between text-xs font-semibold mb-1'>
                  <span className='flex items-center gap-1.5 text-purple-300'>
                    🎤 Vocals & Acapella
                  </span>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => setStemVocals(stemVocals === 0 ? 100 : 0)}
                      className={`text-[10px] px-2 py-0.5 rounded ${stemVocals === 0 ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'}`}
                    >
                      {stemVocals === 0 ? 'MUTED' : 'MUTE'}
                    </button>
                    <span className='font-mono text-gray-400'>{stemVocals}%</span>
                  </div>
                </div>
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={stemVocals}
                  onChange={(e) => setStemVocals(Number(e.target.value))}
                  className='w-full accent-purple-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer'
                />
              </div>

              {/* Stem: Drums */}
              <div>
                <div className='flex items-center justify-between text-xs font-semibold mb-1'>
                  <span className='flex items-center gap-1.5 text-cyan-300'>
                    🥁 Drums & Percussion
                  </span>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => setStemDrums(stemDrums === 0 ? 100 : 0)}
                      className={`text-[10px] px-2 py-0.5 rounded ${stemDrums === 0 ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'}`}
                    >
                      {stemDrums === 0 ? 'MUTED' : 'MUTE'}
                    </button>
                    <span className='font-mono text-gray-400'>{stemDrums}%</span>
                  </div>
                </div>
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={stemDrums}
                  onChange={(e) => setStemDrums(Number(e.target.value))}
                  className='w-full accent-cyan-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer'
                />
              </div>

              {/* Stem: Bassline */}
              <div>
                <div className='flex items-center justify-between text-xs font-semibold mb-1'>
                  <span className='flex items-center gap-1.5 text-fuchsia-300'>
                    🎸 Sub Bass & Low End
                  </span>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => setStemBass(stemBass === 0 ? 100 : 0)}
                      className={`text-[10px] px-2 py-0.5 rounded ${stemBass === 0 ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'}`}
                    >
                      {stemBass === 0 ? 'MUTED' : 'MUTE'}
                    </button>
                    <span className='font-mono text-gray-400'>{stemBass}%</span>
                  </div>
                </div>
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={stemBass}
                  onChange={(e) => setStemBass(Number(e.target.value))}
                  className='w-full accent-fuchsia-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer'
                />
              </div>

              {/* Stem: Melody & Synths */}
              <div>
                <div className='flex items-center justify-between text-xs font-semibold mb-1'>
                  <span className='flex items-center gap-1.5 text-amber-300'>
                    🎹 Instruments & Harmony
                  </span>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => setStemMelody(stemMelody === 0 ? 100 : 0)}
                      className={`text-[10px] px-2 py-0.5 rounded ${stemMelody === 0 ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300 hover:text-white'}`}
                    >
                      {stemMelody === 0 ? 'MUTED' : 'MUTE'}
                    </button>
                    <span className='font-mono text-gray-400'>{stemMelody}%</span>
                  </div>
                </div>
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={stemMelody}
                  onChange={(e) => setStemMelody(Number(e.target.value))}
                  className='w-full accent-amber-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer'
                />
              </div>
            </div>

            <div className='mt-4 flex items-center justify-between pt-2 border-t border-gray-800 text-xs'>
              <span className='text-gray-400 text-[11px]'>Source: {track?.name || 'Live Playing Song'}</span>
              <button
                onClick={() => {
                  setStemVocals(100);
                  setStemDrums(100);
                  setStemBass(100);
                  setStemMelody(100);
                  showMessage('All stems reset to 100%', 'info');
                }}
                className='text-[11px] text-purple-400 hover:text-purple-300'
              >
                Reset Stems
              </button>
            </div>
          </div>
        </div>

        {/* Feature 3: 5-Band Studio Equalizer & Offline Storage Bar */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
          {/* Pro Equalizer */}
          <div className='lg:col-span-2 rounded-2xl p-6 border border-[#2b253e] bg-[#141120]'>
            <div className='flex items-center justify-between mb-4 flex-wrap gap-2'>
              <div className='flex items-center gap-2.5'>
                <div className='p-2 rounded-xl bg-fuchsia-500/10 text-fuchsia-400'>
                  <Sliders className='w-5 h-5' />
                </div>
                <div>
                  <h3 className='font-bold text-base text-white'>5-Band Pro Studio Equalizer</h3>
                  <p className='text-xs text-gray-400'>Shape your acoustics with surgical frequency precision</p>
                </div>
              </div>

              {/* Preset Buttons */}
              <div className='flex items-center gap-1.5 flex-wrap'>
                {EQUALIZER_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handleSelectPreset(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      activePreset.name === p.name
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-[#1e1930] text-gray-400 hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 5 Vertical Sliders */}
            <div className='grid grid-cols-5 gap-4 pt-4 pb-2 text-center'>
              {['60Hz (Sub)', '230Hz (Bass)', '910Hz (Mids)', '4kHz (Presence)', '14kHz (Air)'].map((label, idx) => (
                <div key={label} className='flex flex-col items-center gap-2'>
                  <span className='text-[10px] font-mono text-purple-300 font-bold'>
                    {eqSliders[idx] > 0 ? `+${eqSliders[idx]}dB` : `${eqSliders[idx]}dB`}
                  </span>
                  <div className='h-32 flex items-center justify-center'>
                    <input
                      type='range'
                      min='-12'
                      max='12'
                      value={eqSliders[idx]}
                      onChange={(e) => handleEqSliderChange(idx, e.target.value)}
                      className='h-28 w-2 accent-purple-500 rounded-lg cursor-pointer transform -rotate-90'
                    />
                  </div>
                  <span className='text-[10px] text-gray-400 font-medium line-clamp-1'>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Downloads & Zero Ads Showcase */}
          <div className='rounded-2xl p-6 border border-[#2b253e] bg-[#141120] flex flex-col justify-between'>
            <div>
              <div className='flex items-center gap-2.5 mb-3'>
                <div className='p-2 rounded-xl bg-emerald-500/10 text-emerald-400'>
                  <Download className='w-5 h-5' />
                </div>
                <div>
                  <h3 className='font-bold text-base text-white'>Offline Studio Cache</h3>
                  <p className='text-xs text-gray-400'>Listen without internet connection</p>
                </div>
              </div>

              <div className='p-4 rounded-xl bg-[#191428] border border-[#2d2444] mb-4'>
                <div className='flex items-center justify-between text-xs mb-1.5'>
                  <span className='text-gray-300'>Cached Storage Used</span>
                  <span className='font-mono text-purple-300 font-bold'>1.8 GB / 10 GB</span>
                </div>
                <div className='w-full h-2 rounded-full bg-gray-800 overflow-hidden'>
                  <div className='h-full bg-gradient-to-r from-purple-500 to-cyan-400 w-[24%]' />
                </div>
                <p className='text-[11px] text-gray-400 mt-2'>
                  {cachedSongsCount} tracks & 3 podcasts saved locally on this device.
                </p>
              </div>

              {/* Download Current Song Button */}
              <button
                onClick={handleSimulateOfflineCache}
                disabled={isCaching}
                className='w-full py-2.5 rounded-xl border border-purple-500/40 bg-purple-600/15 hover:bg-purple-600/30 text-purple-200 text-xs font-bold transition flex items-center justify-center gap-2'
              >
                {isCaching ? (
                  <>
                    <div className='w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin' />
                    <span>Caching Track Stems...</span>
                  </>
                ) : (
                  <>
                    <Download className='w-4 h-4 text-purple-300' />
                    <span>Cache Current Track for Offline</span>
                  </>
                )}
              </button>
            </div>

            {/* Ad Shield Status */}
            <div className='mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs'>
              <div className='flex items-center gap-1.5 text-emerald-400 font-semibold'>
                <ShieldCheck className='w-4 h-4' />
                <span>Ad Shield: 100% Active</span>
              </div>
              <span className='text-[10px] text-gray-500'>0 Ads Blocked</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PLANS COMPARISON SECTION
      ========================================================================= */}
      <div id='plans-section' className='mt-14'>
        <div className='text-center max-w-xl mx-auto mb-8'>
          <h2 className='text-2xl md:text-3xl font-black text-white'>Choose Your Flux Pass</h2>
          <p className='text-gray-400 text-xs md:text-sm mt-1.5'>
            Cancel anytime in 1 click. Switch between monthly and annual billing with no penalty.
          </p>

          {/* Billing Switcher (Monthly vs Yearly) */}
          <div className='inline-flex items-center p-1 rounded-full bg-[#181324] border border-[#2d2442] mt-5'>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                billingCycle === 'monthly' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Yearly Billing</span>
              <span className='px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-black'>
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* 4 Plans Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan.id === plan.id;
            const price = calculatePrice(plan);

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between cursor-pointer relative bg-gradient-to-b ${plan.gradient} ${
                  isSelected ? `${plan.border} ring-2 ring-purple-500 scale-[1.02]` : 'border-[#2c243f] hover:border-gray-500'
                }`}
              >
                {/* Popular Pill */}
                {plan.popular && (
                  <div className='absolute -top-3.5 left-1/2 -translate-x-1/2'>
                    <span className='px-3 py-1 rounded-full text-[10px] font-black tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg'>
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div>
                  <div className='text-xs font-bold text-purple-300 uppercase tracking-wider mb-1'>
                    {plan.badge}
                  </div>
                  <h3 className='text-xl font-black text-white'>{plan.name}</h3>
                  <p className='text-xs text-gray-300 mt-1 min-h-[36px]'>{plan.desc}</p>

                  {/* Price */}
                  <div className='mt-4 mb-4 pb-4 border-b border-white/10'>
                    <div className='flex items-baseline gap-1'>
                      <span className='text-3xl font-black text-white'>₹{price}</span>
                      <span className='text-xs text-gray-400'>
                        / {billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <span className='text-[10px] text-emerald-400 font-semibold block mt-0.5'>
                        Includes 2 months free
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className='space-y-2.5 text-xs text-gray-200'>
                    {plan.features.map((feat, i) => (
                      <li key={i} className='flex items-start gap-2'>
                        <Check className='w-4 h-4 text-cyan-400 shrink-0 mt-0.5' />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select / Subscribe CTA */}
                <div className='mt-6 pt-4 border-t border-white/10'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan);
                      setShowCheckoutModal(true);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all ${plan.buttonColor}`}
                  >
                    {user?.isPremium && user.premiumPlan === plan.name
                      ? 'Current Plan'
                      : 'Get Started with Free Trial'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          FAQ SECTION
      ========================================================================= */}
      <div className='mt-16 rounded-3xl p-8 border border-[#2b253e] bg-[#120f1e]'>
        <h3 className='text-xl font-black text-white mb-6 text-center'>Frequently Asked Questions</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-300'>
          <div className='p-4 rounded-xl bg-[#181326] border border-gray-800'>
            <h4 className='font-bold text-white mb-1.5'>Can I cancel or change my plan anytime?</h4>
            <p className='text-gray-400'>
              Yes. You can cancel your subscription with 1 click from your profile or the Premium page. You keep full access until your billing cycle ends.
            </p>
          </div>

          <div className='p-4 rounded-xl bg-[#181326] border border-gray-800'>
            <h4 className='font-bold text-white mb-1.5'>What is Lossless FLAC Master audio?</h4>
            <p className='text-gray-400'>
              Unlike standard compressed MP3 files, FLAC is bit-perfect 24-bit 96kHz audio that delivers every nuance of the recording studio as intended by the artist.
            </p>
          </div>

          <div className='p-4 rounded-xl bg-[#181326] border border-gray-800'>
            <h4 className='font-bold text-white mb-1.5'>How does the AI Stem Separator work?</h4>
            <p className='text-gray-400'>
              Our deep learning neural network splits any song into 4 distinct tracks: Vocals, Drums, Bass, and Melody, allowing DJs and producers to isolate and mute components in real time.
            </p>
          </div>

          <div className='p-4 rounded-xl bg-[#181326] border border-gray-800'>
            <h4 className='font-bold text-white mb-1.5'>How do offline downloads work?</h4>
            <p className='text-gray-400'>
              Songs and podcasts are cached locally inside your browser's encrypted IndexedDB storage, so you can play them without an internet connection.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CHECKOUT & SUBSCRIPTION MODAL
      ========================================================================= */}
      {showCheckoutModal && (
        <div className='fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4'>
          <div className='w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl relative border bg-[#14101e] border-[#2e2642] text-white'>
            <button
              onClick={() => setShowCheckoutModal(false)}
              className='absolute right-4 top-4 text-gray-400 hover:text-white'
            >
              <X className='w-5 h-5' />
            </button>

            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30'>
                <Crown className='w-6 h-6 text-amber-400' />
              </div>
              <div>
                <h3 className='text-lg font-black'>Unlock {selectedPlan.name}</h3>
                <p className='text-xs text-gray-400'>First 30 days are completely free</p>
              </div>
            </div>

            {/* Plan Summary Card */}
            <div className='p-4 rounded-2xl bg-[#1b1528] border border-[#2e2444] mb-4'>
              <div className='flex items-center justify-between text-sm font-bold mb-1'>
                <span>{selectedPlan.name}</span>
                <span className='text-amber-400 font-extrabold text-base'>₹{calculatePrice(selectedPlan)} <span className='text-xs font-normal text-gray-400'>/ {billingCycle === 'yearly' ? 'year' : 'month'}</span></span>
              </div>
              <p className='text-xs text-gray-400'>{selectedPlan.desc}</p>
              <div className='mt-2.5 pt-2 border-t border-gray-700/60 flex items-center justify-between text-[11px] text-gray-300'>
                <span>Billing Period:</span>
                <span className='capitalize font-bold text-purple-300'>{billingCycle} (Renews automatically)</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className='mb-4'>
              <label className='block text-xs font-bold mb-1 text-gray-300'>Promo or Student Discount Code</label>
              <div className='flex gap-2'>
                <input
                  type='text'
                  placeholder='Try "FLUX50"'
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className='flex-1 h-9 px-3 rounded-xl border text-xs bg-[#191426] border-[#2c2242] text-white uppercase tracking-wider focus:outline-none focus:border-purple-500'
                />
                <button
                  type='submit'
                  className='px-3.5 h-9 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 text-xs font-bold border border-purple-500/40 transition'
                >
                  Apply
                </button>
              </div>
              {promoError && <p className='text-[10px] text-red-400 mt-1'>{promoError}</p>}
              {discountPercent > 0 && (
                <p className='text-[10px] text-emerald-400 mt-1 font-bold'>
                  ✓ {discountPercent}% discount active! Instant savings applied.
                </p>
              )}
            </form>

            {/* Indian Payment Methods: UPI / RuPay / NetBanking */}
            <div className='mb-5'>
              <label className='block text-xs font-bold mb-1.5 text-gray-300'>Select Payment Method</label>
              <div className='grid grid-cols-3 gap-2 mb-3'>
                {/* UPI Option */}
                <button
                  type='button'
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'upi'
                      ? 'border-purple-500 bg-purple-600/20 text-white shadow-md'
                      : 'border-gray-800 bg-[#191428] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <Smartphone className='w-4 h-4 text-emerald-400' />
                  <span className='text-xs font-bold'>UPI / QR</span>
                  <span className='text-[9px] text-gray-400'>GPay, PhonePe</span>
                </button>

                {/* Cards Option */}
                <button
                  type='button'
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'card'
                      ? 'border-purple-500 bg-purple-600/20 text-white shadow-md'
                      : 'border-gray-800 bg-[#191428] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <CreditCard className='w-4 h-4 text-purple-400' />
                  <span className='text-xs font-bold'>Cards</span>
                  <span className='text-[9px] text-gray-400'>RuPay, Visa, MC</span>
                </button>

                {/* Net Banking Option */}
                <button
                  type='button'
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'netbanking'
                      ? 'border-purple-500 bg-purple-600/20 text-white shadow-md'
                      : 'border-gray-800 bg-[#191428] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <Building2 className='w-4 h-4 text-cyan-400' />
                  <span className='text-xs font-bold'>Net Banking</span>
                  <span className='text-[9px] text-gray-400'>SBI, HDFC, ICICI</span>
                </button>
              </div>

              {/* Dynamic Payment Details Input */}
              {paymentMethod === 'upi' && (
                <div className='p-3 rounded-xl bg-[#191428] border border-gray-800'>
                  <div className='flex items-center justify-between text-[11px] text-gray-300 mb-1.5'>
                    <span>Enter UPI ID / VPA</span>
                    <span className='text-[10px] text-emerald-400 font-semibold'>Zero Convenience Fee</span>
                  </div>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      placeholder='yourname@okhdfcbank or @paytm'
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className='flex-1 h-8.5 px-3 rounded-lg border text-xs bg-[#100c1c] border-gray-700 text-white focus:outline-none focus:border-purple-500'
                    />
                    <button
                      type='button'
                      onClick={() => setUpiId('musiclover@okaxis')}
                      className='text-[10px] px-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
                    >
                      Fill Demo
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className='p-3 rounded-xl bg-[#191428] border border-gray-800 space-y-2'>
                  <input
                    type='text'
                    placeholder='RuPay / Debit / Credit Card Number'
                    defaultValue='4532 •••• •••• 8821'
                    className='w-full h-8.5 px-3 rounded-lg border text-xs bg-[#100c1c] border-gray-700 text-white focus:outline-none focus:border-purple-500'
                  />
                  <div className='grid grid-cols-2 gap-2'>
                    <input
                      type='text'
                      placeholder='MM / YY'
                      defaultValue='08/28'
                      className='h-8 px-3 rounded-lg border text-xs bg-[#100c1c] border-gray-700 text-white focus:outline-none focus:border-purple-500'
                    />
                    <input
                      type='password'
                      placeholder='CVV'
                      defaultValue='352'
                      maxLength='3'
                      className='h-8 px-3 rounded-lg border text-xs bg-[#100c1c] border-gray-700 text-white focus:outline-none focus:border-purple-500'
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className='p-3 rounded-xl bg-[#191428] border border-gray-800'>
                  <label className='block text-[11px] text-gray-300 mb-1.5'>Choose Your Bank</label>
                  <select className='w-full h-8.5 px-3 rounded-lg border text-xs bg-[#100c1c] border-gray-700 text-white focus:outline-none focus:border-purple-500'>
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                    <option>Punjab National Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Confirm Upgrade CTA */}
            <button
              onClick={handleConfirmUpgrade}
              className='w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg shadow-purple-900/60 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]'
            >
              <CheckCircle2 className='w-4 h-4 text-emerald-300' />
              <span>Start 30-Day Free Trial</span>
            </button>

            <p className='text-[10px] text-center text-gray-400 mt-3'>
              No charge today. Cancel anytime before trial ends without paying anything.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Premium;

