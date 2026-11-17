import img1 from './img1.jpg';
import img2 from './img2.jpg';
import img3 from './img3.jpg';
import img4 from './img4.jpg';
import img5 from './img5.jpg';
import img6 from './img6.jpg';
import img7 from './img7.jpg';
import img8 from './img8.jpg';
import img9 from './img9.jpg';
import img10 from './img10.jpg';
import img11 from './img11.jpg';
import img12 from './img12.jpg';
import img13 from './img13.jpg';
import img14 from './img14.jpg';
import img15 from './img15.jpg';
import img16 from './img16.jpg';
import song1 from './song1.mp3';
import song2 from './song2.mp3';
import song3 from './song3.mp3';

export const PODCAST_CATEGORIES = [
  { 
    name: 'Technology', 
    count: 24, 
    color: 'from-blue-600 to-indigo-900',
    image: img7,
    icon: 'Laptop'
  },
  { 
    name: 'Business', 
    count: 18, 
    color: 'from-emerald-600 to-teal-900',
    image: img8,
    icon: 'Briefcase'
  },
  { 
    name: 'True Crime', 
    count: 15, 
    color: 'from-rose-600 to-red-950',
    image: img9,
    icon: 'Shield'
  },
  { 
    name: 'Comedy', 
    count: 22, 
    color: 'from-amber-500 to-orange-900',
    image: img10,
    icon: 'Smile'
  },
  { 
    name: 'Science', 
    count: 14, 
    color: 'from-cyan-600 to-blue-950',
    image: img11,
    icon: 'Atom'
  },
  { 
    name: 'Music Production', 
    count: 19, 
    color: 'from-purple-600 to-fuchsia-950',
    image: img12,
    icon: 'Music'
  },
  { 
    name: 'Education', 
    count: 16, 
    color: 'from-violet-600 to-slate-900',
    image: img13,
    icon: 'GraduationCap'
  },
  { 
    name: 'Health & Fitness', 
    count: 12, 
    color: 'from-pink-600 to-rose-950',
    image: img14,
    icon: 'Dumbbell'
  }
];

export const PODCAST_DATA = [
  {
    id: 'pod-1',
    title: 'Tech Talk Daily',
    host: 'Sarah Johnson',
    category: 'Technology',
    image: img7,
    bannerImage: img15,
    gradient: 'from-blue-600 to-indigo-900',
    description: 'Deep dives into artificial intelligence, neural computing, robotics, and cutting-edge software architecture.',
    subscribers: '428K',
    rating: '4.9 ★',
    episodes: [
      {
        id: 'pod-1-ep-1',
        number: 342,
        title: 'The Future of Generative Music & Neural Soundscapes',
        duration: '2:45',
        date: 'Nov 14, 2026',
        desc: 'How diffusion models and real-time DSP are transforming the landscape of music production.',
        audioFile: song1,
        image: img7
      },
      {
        id: 'pod-1-ep-2',
        number: 341,
        title: 'Quantum Computing: Breaking Down the Physics',
        duration: '3:50',
        date: 'Nov 10, 2026',
        desc: 'Understanding qubits, superposition, and what fault-tolerant quantum hardware means for encryption.',
        audioFile: song2,
        image: img15
      },
      {
        id: 'pod-1-ep-3',
        number: 340,
        title: 'Inside Next-Gen Web Architecture & Reactive Systems',
        duration: '3:20',
        date: 'Nov 5, 2026',
        desc: 'Building sub-millisecond edge APIs and resilient distributed architectures.',
        audioFile: song3,
        image: img11
      }
    ]
  },
  {
    id: 'pod-2',
    title: 'Business Minds & Startups',
    host: 'Michael Chen',
    category: 'Business',
    image: img8,
    bannerImage: img4,
    gradient: 'from-emerald-600 to-teal-900',
    description: 'Candid conversations with bootstrap founders, venture capitalists, and leaders scaling to nine figures.',
    subscribers: '315K',
    rating: '4.8 ★',
    episodes: [
      {
        id: 'pod-2-ep-1',
        number: 215,
        title: 'From Zero to $100M ARR Bootstrapped',
        duration: '3:50',
        date: 'Nov 12, 2026',
        desc: 'The unvarnished story of capital efficiency, unit economics, and relentless product distribution.',
        audioFile: song2,
        image: img8
      },
      {
        id: 'pod-2-ep-2',
        number: 214,
        title: 'The Art of Negotiation & Enterprise Pitch Decks',
        duration: '2:45',
        date: 'Nov 8, 2026',
        desc: 'Tactics for closing multi-million dollar deals and standing out in crowded B2B categories.',
        audioFile: song1,
        image: img4
      },
      {
        id: 'pod-2-ep-3',
        number: 213,
        title: 'SaaS Metrics Every Founder Must Track',
        duration: '3:20',
        date: 'Oct 30, 2026',
        desc: 'Net revenue retention, CAC payback windows, and avoiding vanity metric traps.',
        audioFile: song3,
        image: img5
      }
    ]
  },
  {
    id: 'pod-3',
    title: 'Noir & Crime Chronicles',
    host: 'Emma Davis',
    category: 'True Crime',
    image: img9,
    bannerImage: img1,
    gradient: 'from-rose-600 to-red-950',
    description: 'Investigative storytelling exploring unsolved mysteries, forensic breakthroughs, and historic heist archives.',
    subscribers: '512K',
    rating: '4.9 ★',
    episodes: [
      {
        id: 'pod-3-ep-1',
        number: 156,
        title: 'The Phantom of the Black Forest',
        duration: '3:20',
        date: 'Nov 13, 2026',
        desc: 'A thirty-year-old cold case reopened with modern genomic genealogy telemetry.',
        audioFile: song3,
        image: img9
      },
      {
        id: 'pod-3-ep-2',
        number: 155,
        title: 'Cold Case Solved: The 1994 Diamond Heist',
        duration: '2:45',
        date: 'Nov 6, 2026',
        desc: 'The intricate vault bypass that baffled authorities until a single fingerprint surfaced.',
        audioFile: song1,
        image: img1
      }
    ]
  },
  {
    id: 'pod-4',
    title: 'The Midnight Comedy Hour',
    host: 'James Wilson',
    category: 'Comedy',
    image: img10,
    bannerImage: img6,
    gradient: 'from-amber-500 to-orange-900',
    description: 'Uncensored standup breakdowns, hilarious improvisation, and comedic takes on daily modern absurdities.',
    subscribers: '280K',
    rating: '4.7 ★',
    episodes: [
      {
        id: 'pod-4-ep-1',
        number: 289,
        title: 'Hilarious Encounters on Public Transit',
        duration: '2:45',
        date: 'Nov 11, 2026',
        desc: 'Bizarre commutes, unhinged conversations, and subway comedy gold.',
        audioFile: song1,
        image: img10
      },
      {
        id: 'pod-4-ep-2',
        number: 288,
        title: 'Improv Stories & Roommate Nightmares',
        duration: '3:50',
        date: 'Nov 3, 2026',
        desc: 'Touring comedians share their most disastrous living situations before making it big.',
        audioFile: song2,
        image: img6
      }
    ]
  },
  {
    id: 'pod-5',
    title: 'Mind & Science Horizons',
    host: 'Dr. Liam Vance',
    category: 'Science',
    image: img11,
    bannerImage: img16,
    gradient: 'from-cyan-600 to-blue-950',
    description: 'Astrophysics, neurobiology, and evolutionary breakthroughs told through vivid, accessible narratives.',
    subscribers: '194K',
    rating: '4.9 ★',
    episodes: [
      {
        id: 'pod-5-ep-1',
        number: 98,
        title: "James Webb Telescope's Deepest Mysteries",
        duration: '3:50',
        date: 'Nov 9, 2026',
        desc: 'Early universe galactic clusters that defy traditional cosmological models.',
        audioFile: song2,
        image: img11
      },
      {
        id: 'pod-5-ep-2',
        number: 97,
        title: 'Neuroplasticity: How the Brain Learns Code & Language',
        duration: '3:20',
        date: 'Nov 1, 2026',
        desc: 'Synaptic rewiring, flow states, and cognitive optimization protocols.',
        audioFile: song3,
        image: img16
      }
    ]
  },
  {
    id: 'pod-6',
    title: 'Studio Secrets & Music Theory',
    host: 'Elena Rostova',
    category: 'Music Production',
    image: img12,
    bannerImage: img3,
    gradient: 'from-purple-600 to-fuchsia-950',
    description: 'Sound design masterclasses, tape saturation techniques, chord progression secrets, and mix bus breakdowns.',
    subscribers: '240K',
    rating: '5.0 ★',
    episodes: [
      {
        id: 'pod-6-ep-1',
        number: 74,
        title: 'Mixing Lo-Fi Beats: Saturation & Vinyl Warmth',
        duration: '3:20',
        date: 'Nov 7, 2026',
        desc: 'How bitcrushing, tape flutter, and sidechain compression create timeless analog texture.',
        audioFile: song3,
        image: img12
      },
      {
        id: 'pod-6-ep-2',
        number: 73,
        title: 'Deconstructing Modal Jazz & Modern Trap Harmony',
        duration: '2:45',
        date: 'Oct 28, 2026',
        desc: 'Borrowing Dorian and Phrygian modes to add darkness and tension to 808-heavy beats.',
        audioFile: song1,
        image: img3
      }
    ]
  },
  {
    id: 'pod-7',
    title: 'Daily Global Briefing',
    host: 'David Sterling',
    category: 'Education',
    image: img13,
    bannerImage: img2,
    gradient: 'from-violet-600 to-slate-900',
    description: 'Objective, comprehensive analysis of global economic shifts, emerging technology policy, and philosophy.',
    subscribers: '360K',
    rating: '4.8 ★',
    episodes: [
      {
        id: 'pod-7-ep-1',
        number: 412,
        title: 'Geopolitics & Renewable Energy Transitions',
        duration: '2:45',
        date: 'Nov 15, 2026',
        desc: 'Rare earth mineral supply chains and the infrastructure race of this decade.',
        audioFile: song1,
        image: img13
      },
      {
        id: 'pod-7-ep-2',
        number: 411,
        title: 'Philosophy of Time in the Modern Digital Age',
        duration: '3:50',
        date: 'Nov 8, 2026',
        desc: 'How hyper-connectivity alters human memory retention and attention spans.',
        audioFile: song2,
        image: img2
      }
    ]
  },
  {
    id: 'pod-8',
    title: 'Athletic Edge & Biohacking',
    host: 'Maya Patel',
    category: 'Health & Fitness',
    image: img14,
    bannerImage: img15,
    gradient: 'from-pink-600 to-rose-950',
    description: 'Evidence-based protocols for endurance athletes, sleep architecture, recovery science, and nutrition.',
    subscribers: '175K',
    rating: '4.7 ★',
    episodes: [
      {
        id: 'pod-8-ep-1',
        number: 62,
        title: 'Sleep Architecture for High Performers',
        duration: '3:50',
        date: 'Nov 12, 2026',
        desc: 'Deep sleep phase optimization, temperature regulation, and circadian alignment.',
        audioFile: song2,
        image: img14
      },
      {
        id: 'pod-8-ep-2',
        number: 61,
        title: 'Endurance Fueling & Mitochondrial Health',
        duration: '3:20',
        date: 'Nov 4, 2026',
        desc: 'Zone 2 training protocols, lactate thresholds, and metabolic flexibility.',
        audioFile: song3,
        image: img15
      }
    ]
  }
];
