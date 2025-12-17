import React, { useState, useEffect, useRef } from 'react';
import { PetMood, PetSkinId, PetStats } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, Zap, Ghost, Utensils, Gamepad2, Pill, Activity, Sparkles, Skull, Cat } from 'lucide-react';
import { playSfx } from '../utils/audio';

interface PetProps {
  mood: PetMood;
  setMood: (mood: PetMood) => void;
  skinId: PetSkinId;
  scale: number;
  stats: PetStats;
  onFeed: () => void;
  onPlay: () => void;
  onHeal: () => void;
}

const Pet: React.FC<PetProps> = ({ 
  mood: forcedMood, 
  setMood, 
  skinId, 
  scale,
  stats,
  onFeed: onFeedProp,
  onPlay: onPlayProp,
  onHeal: onHealProp
}) => {
  const { language, t } = useLanguage();
  const [message, setMessage] = useState<string>('');
  const [showBubble, setShowBubble] = useState(false);
  const [showUI, setShowUI] = useState(false); // Controls stats visibility
  
  // Track previous level to detect level up
  const prevLevelRef = useRef(stats.level);
  
  // Physics & Movement State
  const [isDragging, setIsDragging] = useState(false);
  
  // Robust initial position calculation for mobile/desktop
  const [x, setX] = useState(() => {
    if (typeof window === 'undefined') return 0;
    if (window.innerWidth < 768) {
        return (window.innerWidth / 2) - 200;
    }
    return window.innerWidth - 450;
  });

  const [y, setY] = useState(0); 
  const [direction, setDirection] = useState(1); 
  const [isWalking, setIsWalking] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  
  // New State for Hair Physics (First Pet)
  const [hairSway, setHairSway] = useState(0);
  const swayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPosRef = useRef<{x: number, y: number} | null>(null);

  // Constants
  const isCat = skinId === 'cat-orange';
  const isPinkSkin = skinId === 'girl-pink'; // This is now the "Star Envoy"
  const isGoth = skinId === 'goth-bunny'; // New Goth Bunny skin

  // Wrappers to prevent stale closures if needed, though direct prop usage is usually fine here
  const onFeed = () => onFeedProp();
  const onPlay = () => onPlayProp();
  const onHeal = () => onHealProp();

  // --- Derived Mood Logic ---
  const effectiveMood = React.useMemo(() => {
     if (forcedMood !== PetMood.IDLE) return forcedMood;
     
     if (stats.health < 30) return PetMood.SLEEP;
     if (stats.hunger < 30) return PetMood.ANGRY;
     if (stats.happiness < 30) return PetMood.IDLE; // Just bored
     return PetMood.IDLE;
  }, [forcedMood, stats]);

  // --- Helper: Get Messages ---
  const getCurrentMessages = () => {
    return TRANSLATIONS[language].pet[skinId] || TRANSLATIONS['zh-CN'].pet['girl-white'];
  };

  // --- Palette Configuration ---
  const colors = isGoth ? {
    // Goth Bunny Palette
    hair: '#E2E8F0', // White/Greyish
    hairShadow: '#94A3B8',
    skin: '#FFF1F2', // Pale pinkish white
    eyes: '#F43F5E', // Rose/Pink
    clothes: '#09090b', // Deep Black
    highlight: '#F472B6', // Pink
    blush: '#FDA4AF',
    acc: '#FFFFFF' // Text color
  } : isPinkSkin ? {
    // Star Envoy Palette
    hair: '#0F172A', // Deep Blue
    hairShadow: '#020617',
    skin: '#FFF0E5',
    eyes: '#3B82F6', // Blue eyes
    clothes: '#FFFFFF', // White Robe
    highlight: '#FACC15', // Gold stars
    blush: '#FECDD3',
    acc: '#FACC15' // Gold Cross/Star
  } : {
    // Jinx/Girl White Palette
    hair: '#00E5FF',
    hairShadow: '#00B2CC',
    skin: '#FFFAFA',
    eyes: '#FF0055',
    clothes: '#1A1A1A',
    highlight: '#FFFFFF',
    blush: '#FFB6C1',
    acc: '#CCFF00'
  };

  // --- Eye Tracking ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * direction; 
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(isCat ? 2 : 2.5, Math.hypot(dx, dy) / 30);
      setEyePosition({ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isCat, direction]);

  // --- Blinking ---
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const triggerReaction = (newMood: PetMood, msgCategory: string, duration: number = 3000) => {
    setMood(newMood);
    const msgs = getCurrentMessages()[msgCategory as keyof ReturnType<typeof getCurrentMessages>];
    if (msgs && msgs.length > 0) {
        setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
        setShowBubble(true);
    }
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      setMood(PetMood.IDLE);
      setShowBubble(false);
    }, duration);
  };

  // --- Level Up Detection ---
  useEffect(() => {
      if (stats.level > prevLevelRef.current) {
          triggerReaction(PetMood.LOVE, 'levelup', 4000);
      }
      prevLevelRef.current = stats.level;
  }, [stats.level]);

  // --- AI: Random Walking & Idle Actions ---
  useEffect(() => {
    const planNextMove = () => {
      if (isDragging) return;
      const randomAction = Math.random();
      
      // If hungry or sick, move less
      const moveChance = (stats.health < 30 || stats.hunger < 30) ? 0.2 : 0.5;

      if (randomAction < moveChance) {
        // ... Walking Logic ...
        const screenWidth = window.innerWidth;
        const maxStep = 300; 
        const minStep = 50;
        let step = minStep + Math.random() * (maxStep - minStep);
        if (Math.random() > 0.5) step *= -1;
        
        let targetX = x + step;
        const minX = -100;
        const maxX = screenWidth - 300;
        if (targetX < minX) targetX = minX;
        if (targetX > maxX) targetX = maxX;

        const dist = targetX - x;
        if (Math.abs(dist) < 10) return;

        const duration = Math.abs(dist) * 5; 
        setDirection(dist > 0 ? 1 : -1);
        setIsWalking(true);
        setX(targetX);
        
        setTimeout(() => setIsWalking(false), duration); 
      } else {
        // Idle Behavior: Check for low stats complaints
        setIsWalking(false);
        if (Math.random() > 0.7) { // 30% chance to speak when idle check passes
             if (stats.health < 30) {
                 triggerReaction(PetMood.SLEEP, 'lowHealth');
             } else if (stats.hunger < 30) {
                 triggerReaction(PetMood.ANGRY, 'lowHunger');
             } else if (stats.happiness < 30) {
                 triggerReaction(PetMood.IDLE, 'lowMood');
             } else {
                 triggerReaction(PetMood.IDLE, 'idle');
             }
        }
      }
    };

    const timer = setTimeout(planNextMove, 1500); 
    walkIntervalRef.current = setInterval(planNextMove, 3000 + Math.random() * 3000); 

    return () => {
        clearTimeout(timer);
        if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
    };
  }, [x, isDragging, stats]); 

  // --- Dragging Logic ---
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    lastPosRef.current = { x: clientX, y: clientY };
    triggerReaction(PetMood.SURPRISED, 'surprised');
    playSfx('pet-surprised');
    setShowUI(true); // Show UI on interact
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
       if (!isDragging || !lastPosRef.current) return;
       const dx = clientX - lastPosRef.current.x;
       const dy = clientY - lastPosRef.current.y;
       
       // Physics: Calculate hair sway for first pet
       // If moving right (dx > 0), hair swings left (negative rotation)
       const sway = Math.max(-60, Math.min(60, dx * -2.5)); 
       setHairSway(sway);
       
       // Decay sway if movement stops but mouse is still held
       if (swayTimeoutRef.current) clearTimeout(swayTimeoutRef.current);
       swayTimeoutRef.current = setTimeout(() => setHairSway(0), 100);

       setX(prev => prev + dx);
       setY(prev => prev + dy);
       lastPosRef.current = { x: clientX, y: clientY };
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
        if (isDragging) { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY); }
    };
    const onEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        setHairSway(0); // Reset sway
        setY(0); 
        lastPosRef.current = null;
        setTimeout(() => setMood(PetMood.IDLE), 500);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchend', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);

  // --- SVG Renderers ---
  const renderBubbles = () => (
    <g className="pointer-events-none">
       <circle cx="50" cy="140" r="6" fill={isPinkSkin ? '#FFCCDD' : '#00E5FF'} opacity="0.6" className="animate-float" style={{animationDuration: '3s', animationDelay: '0s'}} />
       <circle cx="160" cy="50" r="4" fill="#FFFFFF" opacity="0.8" className="animate-float" style={{animationDuration: '4s', animationDelay: '1s'}} />
    </g>
  );

  const renderGothBunny = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-xl">
        <defs><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter></defs>
        
        {/* Background Elements */}
        <g className="pointer-events-none">
           <text x="40" y="140" fontSize="12" fill={colors.highlight} opacity="0.6" className="animate-float" style={{animationDuration: '4s'}}>☠️</text>
           <text x="160" y="50" fontSize="10" fill={colors.highlight} opacity="0.6" className="animate-float" style={{animationDuration: '3s'}}>✖</text>
        </g>

        {/* EARS (Back) - Adjusted for smaller head */}
        <g fill="#000000" stroke="none">
             {/* Left Ear */}
             <path d="M85,65 Q70,20 60,30 Q50,40 80,75 Z" className="animate-wiggle" style={{transformOrigin: '85px 65px', animationDuration: '3s'}} />
             {/* Right Ear */}
             <path d="M115,65 Q130,20 140,30 Q150,40 120,75 Z" className="animate-wiggle" style={{transformOrigin: '115px 65px', animationDuration: '4s'}} />
        </g>

        {/* HAIR - BACK - Narrower and tighter */}
        <g stroke="black" strokeWidth="2.5" fill={colors.hair}>
           <path d="M75,55 Q100,45 125,55 L130,105 Q100,115 70,105 Z" />
        </g>

        {/* LEGS & BOOTS - Very slim legs */}
        <g transform="translate(100, 155)">
             {/* Left Leg */}
             <line x1="-8" y1="-20" x2="-8" y2="25" stroke={colors.skin} strokeWidth="4" />
             {/* Boot L */}
             <g transform="translate(-8, 25)">
                <path d="M-10,-5 L6,-5 L6,10 L-12,10 L-12,0 Z" fill="#000" stroke="none" />
                <rect x="-12" y="10" width="20" height="4" fill="#333" />
             </g>
             
             {/* Right Leg */}
             <line x1="8" y1="-20" x2="8" y2="25" stroke={colors.skin} strokeWidth="4" />
             {/* Boot R */}
             <g transform="translate(8, 25)">
                <path d="M10,-5 L-6,-5 L-6,10 L12,10 L12,0 Z" fill="#000" stroke="none" />
                <rect x="-6" y="10" width="20" height="4" fill="#333" />
             </g>
        </g>

        {/* CLOTHES / BODY (Narrow Shoulders, Little Girl Frame) */}
        <g transform="translate(100, 125)">
            {/* Arms - More visible, extending from sleeves */}
            {/* Left Arm */}
            <path d="M-22,-5 Q-28,10 -28,20" stroke={colors.skin} strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx="-28" cy="20" r="3.5" fill={colors.skin} />
            
            {/* Right Arm */}
            <path d="M22,-5 Q28,10 28,20" stroke={colors.skin} strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx="28" cy="20" r="3.5" fill={colors.skin} />

            {/* Main Shirt Body - Narrow & Small */}
            <path d="M-18,-25 L18,-25 L24,30 L-24,30 Z" fill={colors.clothes} stroke="black" strokeWidth="2" />
            
            {/* Sleeves - Very narrow shoulders */}
            <path d="M-18,-25 L-28,-15 L-22,-5 L-14,-20" fill={colors.clothes} stroke="black" strokeWidth="2" />
            <path d="M18,-25 L28,-15 L22,-5 L14,-20" fill={colors.clothes} stroke="black" strokeWidth="2" />

            {/* Graphic Print - Smaller */}
            <text x="0" y="5" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="monospace" style={{filter: 'blur(0.5px)'}}>
                GOTH
            </text>
            <path d="M-6,12 L6,12" stroke="white" strokeWidth="1" />
        </g>

        {/* HEAD - Smaller, Raised to show Neck */}
        <g transform="translate(100, 90)">
            {/* Neck - Visible now */}
            <rect x="-4" y="20" width="8" height="10" fill={colors.skin} stroke="black" strokeWidth="2" />

            {/* Face Shape - Smaller (Girl Size) */}
            <path d="M-28,-22 C-32,10 -15,22 0,22 C15,22 32,10 28,-22 Z" fill={colors.skin} stroke="black" strokeWidth="2.5" />
            
            <ellipse cx="-18" cy="10" rx="3" ry="1.5" fill={colors.blush} opacity="0.4" />
            <ellipse cx="18" cy="10" rx="3" ry="1.5" fill={colors.blush} opacity="0.4" />

            {/* EYES - BEADY EYES (豆豆眼) */}
            {blink || effectiveMood === PetMood.SLEEP ? (
                <g stroke="black" strokeWidth="2" fill="none"><path d="M-18,0 L-8,0" /><path d="M8,0 L18,0" /></g>
            ) : effectiveMood === PetMood.HAPPY || effectiveMood === PetMood.LOVE ? (
                <g stroke="black" strokeWidth="2" fill="none"><path d="M-18,0 L-13,-3 L-8,0" /><path d="M8,0 L13,-3 L18,0" /></g>
            ) : (
                <g>
                    {/* Left Eye - Beady */}
                    <g transform={`translate(${-13 + eyePosition.x * 0.2}, ${eyePosition.y * 0.2})`}>
                        <circle cx="0" cy="0" r="3" fill="black" />
                        <circle cx="1" cy="-1" r="1" fill="white" />
                    </g>
                    {/* Right Eye - Beady */}
                    <g transform={`translate(${13 + eyePosition.x * 0.2}, ${eyePosition.y * 0.2})`}>
                        <circle cx="0" cy="0" r="3" fill="black" />
                        <circle cx="1" cy="-1" r="1" fill="white" />
                    </g>
                </g>
            )}

            {/* MOUTH - Small dot or line */}
            <g transform="translate(0, 14)">
                {effectiveMood === PetMood.SURPRISED ? (
                    <circle r="2" fill="black" />
                ) : effectiveMood === PetMood.HAPPY || effectiveMood === PetMood.LOVE ? (
                     <path d="M-2,0 Q0,2 2,0" fill="none" stroke="black" strokeWidth="1.5" />
                ) : (
                    // Neutral/Bored - Small dot
                    <circle r="1" fill="black" />
                )}
            </g>

            {/* HAIR - FRONT / BANGS - Smaller to fit new head */}
            <path d="M-30,-18 L-22,0 L-12,-8 L0,4 L12,-8 L22,0 L30,-18 L30,-10 L24,12 L32,-10 Q35,-25 0,-35 Q-35,-25 -32,-10 L-24,12 L-30,-10 Z" fill={colors.hair} stroke="black" strokeWidth="2.5" />
            
            {/* Black Headband - Smaller */}
            <path d="M-26,-22 Q0,-38 26,-22" fill="none" stroke="black" strokeWidth="2.5" />
        </g>
        
        {effectiveMood === PetMood.ANGRY && <text x="130" y="60" fontSize="30" fill="red" fontWeight="bold">💢</text>}
        {effectiveMood === PetMood.LOVE && <text x="130" y="60" fontSize="30" fill="#FF69B4">💗</text>}
        {effectiveMood === PetMood.SLEEP && <text x="140" y="70" fontSize="24" fill="#666">...</text>}
    </svg>
  );

  const renderCat = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-xl">
        {renderBubbles()}
        <g className="animate-wiggle origin-bottom" style={{ transformOrigin: '150px 150px' }}>
             <path d="M140,140 Q170,110 160,80" stroke="#FDBA74" strokeWidth="12" fill="none" strokeLinecap="round" />
        </g>
        <path d="M50,70 L40,30 L80,60 Z" fill="#FDBA74" stroke="black" strokeWidth="3" />
        <path d="M150,70 L160,30 L120,60 Z" fill="#FDBA74" stroke="black" strokeWidth="3" />
        <ellipse cx="100" cy="110" rx="60" ry="55" fill="#FDBA74" stroke="black" strokeWidth="3" />
        <path d="M100,60 L90,75 L110,75 Z" fill="#C2410C" opacity="0.5" />
        <path d="M150,110 L135,105 L135,115 Z" fill="#C2410C" opacity="0.5" />
        <path d="M50,110 L65,105 L65,115 Z" fill="#C2410C" opacity="0.5" />
        <ellipse cx="100" cy="130" rx="30" ry="25" fill="#FFF7ED" opacity="0.8" />
        <g transform="translate(100, 100)">
           {blink || effectiveMood === PetMood.SLEEP ? (
               <g fill="none" stroke="black" strokeWidth="3">
                   <path d="M-25,0 L-15,0" />
                   <path d="M15,0 L25,0" />
               </g>
           ) : effectiveMood === PetMood.HAPPY || effectiveMood === PetMood.LOVE ? (
               <g fill="none" stroke="black" strokeWidth="3">
                   <path d="M-25,5 Q-20,-5 -15,5" />
                   <path d="M15,5 Q20,-5 25,5" />
               </g>
           ) : (
             <g>
               <g transform={`translate(${-20 + eyePosition.x}, ${eyePosition.y})`}>
                   <ellipse cx="0" cy="0" rx="8" ry="10" fill="white" stroke="black" strokeWidth="2" />
                   <circle cx="0" cy="0" r="3" fill="black" />
               </g>
               <g transform={`translate(${20 + eyePosition.x}, ${eyePosition.y})`}>
                   <ellipse cx="0" cy="0" rx="8" ry="10" fill="white" stroke="black" strokeWidth="2" />
                   <circle cx="0" cy="0" r="3" fill="black" />
               </g>
             </g>
           )}
           <path d="M-3,8 L3,8 L0,12 Z" fill="pink" stroke="black" strokeWidth="1" />
           <path d="M-3,12 Q-8,18 -15,14 M3,12 Q8,18 15,14" fill="none" stroke="black" strokeWidth="2" />
        </g>
        {effectiveMood === PetMood.ANGRY && <text x="130" y="60" fontSize="30" fill="red" fontWeight="bold">💢</text>}
        {effectiveMood === PetMood.LOVE && <text x="130" y="60" fontSize="30" fill="#FF69B4">💗</text>}
        {effectiveMood === PetMood.SLEEP && <text x="140" y="70" fontSize="24" fill="#666">Zzz</text>}
    </svg>
  );

  const renderAnimeGirl = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-xl">
        <defs><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter></defs>
        {renderBubbles()}
        
        {/* WINGS - Star Envoy Only (Adjusted position) */}
        {isPinkSkin && (
            <g transform="translate(100, 142)">
                <g className="animate-float" style={{animationDuration: '3s'}}>
                    {/* Left Wing - Lowered to waist */}
                    <path d="M-12,0 Q-55,-30 -90,-5 Q-80,45 -25,35 Z" 
                          fill="rgba(255,255,255,0.9)" stroke={colors.acc} strokeWidth="2" />
                    <path d="M-17,5 Q-50,-15 -65,-5" fill="none" stroke={colors.acc} strokeWidth="1" />
                    
                    {/* Right Wing - Lowered to waist */}
                    <path d="M12,0 Q55,-30 90,-5 Q80,45 25,35 Z" 
                          fill="rgba(255,255,255,0.9)" stroke={colors.acc} strokeWidth="2" />
                    <path d="M17,5 Q50,-15 65,-5" fill="none" stroke={colors.acc} strokeWidth="1" />
                </g>
            </g>
        )}

        {/* HAIR - BACK */}
        {!isPinkSkin ? (
           // Girl White (Original) with Hair Sway Animation
           <g stroke="black" strokeWidth="2.5" fill={colors.hair}>
              {/* Left Pigtail */}
              <g style={{ transform: `rotate(${hairSway}deg)`, transformOrigin: '55px 80px', transition: 'transform 0.1s ease-out' }}>
                 <path d="M50,80 Q30,120 20,150 Q15,170 30,175 Q45,170 40,150 Q45,120 60,80 Z" />
              </g>
              {/* Right Pigtail */}
              <g style={{ transform: `rotate(${hairSway}deg)`, transformOrigin: '145px 80px', transition: 'transform 0.1s ease-out' }}>
                 <path d="M150,80 Q170,120 180,150 Q185,170 170,175 Q155,170 160,150 Q155,120 140,80 Z" />
              </g>
              {/* Static Back Hair */}
              <path d="M60,40 Q100,10 140,40 L140,80 Q100,90 60,80 Z" />
           </g>
        ) : (
           // Star Envoy (Updated: Sparser/Thinner Hair Volume)
           <path d="M65,175 Q55,110 55,60 Q100,-10 145,60 Q145,110 135,175 Z" fill={colors.hair} stroke="black" strokeWidth="2.5" />
        )}

        {/* CLOTHES / BODY */}
        {isPinkSkin && (
            // Star Envoy - Slender White Robe with Neck & Outward Arms
            <g transform="translate(100, 130)">
                 {/* Neck */}
                 <rect x="-4" y="-28" width="8" height="15" fill={colors.skin} stroke="black" strokeWidth="2.5" />

                 {/* Main Robe - A-Line Dress */}
                 <path d="M-12,-15 L-35,60 L35,60 L12,-15 Z" fill={colors.clothes} stroke="black" strokeWidth="2.5" />
                 
                 {/* Arms - Outward A-Pose (Angled Away) */}
                 <g>
                    {/* Left Arm - Angled out */}
                    <path d="M-15,-10 Q-35,20 -45,35" stroke={colors.clothes} strokeWidth="10" fill="none" strokeLinecap="round" />
                    <path d="M-15,-10 Q-35,20 -45,35" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <circle cx="-45" cy="35" r="4" fill={colors.skin} stroke="black" strokeWidth="2" />
                    
                    {/* Right Arm - Angled out */}
                    <path d="M15,-10 Q35,20 45,35" stroke={colors.clothes} strokeWidth="10" fill="none" strokeLinecap="round" />
                    <path d="M15,-10 Q35,20 45,35" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <circle cx="45" cy="35" r="4" fill={colors.skin} stroke="black" strokeWidth="2" />
                 </g>

                 {/* Inner Dress Detail */}
                 <path d="M0,0 L0,60" stroke="#E2E8F0" strokeWidth="1" opacity="0.5" />
                 
                 {/* Gold Cross */}
                 <g stroke={colors.acc} strokeWidth="2" strokeLinecap="round">
                    <path d="M0,10 L0,40" />
                    <path d="M-8,20 L8,20" />
                 </g>
                 
                 {/* Stars */}
                 <text x="-15" y="50" fontSize="10" fill={colors.acc}>✦</text>
                 <text x="8" y="50" fontSize="10" fill={colors.acc}>✦</text>
            </g>
        )}

        {!isPinkSkin && (
          // Girl White - Original Body (KEEP EXACTLY AS IS)
          <g transform="translate(100, 135)">
             <rect x="-5" y="-25" width="10" height="20" fill={colors.skin} stroke="black" strokeWidth="0" />
             <g>
               <path d="M-7,-20 Q-28,-5 -28,40 L-20,40 L-20,10 L20,10 L20,40 L28,40 Q28,-5 7,-20 Z" fill={colors.skin} stroke="black" strokeWidth="2.5" />
               <path d="M-14,-20 L-16,40 L16,40 L14,-20 Q0,-10 -14,-20" fill={colors.clothes} stroke="black" strokeWidth="2.5" />
               <path d="M-8,15 L8,30 M8,15 L-8,30" stroke="#FF0055" strokeWidth="3" opacity="0.9" strokeLinecap="round" />
               <path d="M-26,15 L-22,18 M-26,22 L-22,25" stroke="#00E5FF" strokeWidth="2" opacity="0.7" />
             </g>
          </g>
        )}

        {/* HEAD */}
        <g transform="translate(100, 95)">
            <path d="M-38,-25 C-42,15 -20,28 0,28 C20,28 42,15 38,-25 Z" fill={colors.skin} stroke="black" strokeWidth="2.5" />
            <ellipse cx="-25" cy="12" rx="6" ry="3" fill={colors.blush} opacity="0.6" />
            <ellipse cx="25" cy="12" rx="6" ry="3" fill={colors.blush} opacity="0.6" />
            
            {/* EYES */}
            {blink || effectiveMood === PetMood.SLEEP ? (
                <g stroke="black" strokeWidth="2.5" fill="none"><path d="M-28,0 Q-20,5 -12,0" /><path d="M12,0 Q20,5 28,0" /></g>
            ) : effectiveMood === PetMood.HAPPY || effectiveMood === PetMood.LOVE ? (
                <g stroke="black" strokeWidth="2.5" fill="none"><path d="M-28,5 Q-20,-5 -12,5" /><path d="M12,5 Q20,-5 28,5" /></g>
            ) : (
                <g>
                    {isPinkSkin ? (
                        // Star Envoy - Gentle Eyes (Soft Ovals, no staring, eyebrows raised)
                        <g>
                           <g transform={`translate(${-22 + eyePosition.x * 0.3}, ${eyePosition.y * 0.3})`}>
                              <ellipse cx="0" cy="0" rx="4" ry="5" fill={colors.eyes} />
                              {/* Raised Eyebrow */}
                              <path d="M-5,-5 Q0,-8 5,-5" fill="none" stroke="black" strokeWidth="1.5" />
                           </g>
                           <g transform={`translate(${22 + eyePosition.x * 0.3}, ${eyePosition.y * 0.3})`}>
                              <ellipse cx="0" cy="0" rx="4" ry="5" fill={colors.eyes} />
                              {/* Raised Eyebrow */}
                              <path d="M-5,-5 Q0,-8 5,-5" fill="none" stroke="black" strokeWidth="1.5" />
                           </g>
                        </g>
                    ) : (
                        // Girl White - Standard Eyes (Original Code Restored)
                        <g>
                            <g transform={`translate(${-22 + eyePosition.x}, ${eyePosition.y})`}><path d="M-14,-9 Q0,-14 14,-9" stroke="black" strokeWidth="2.5" fill="none" /><ellipse cx="0" cy="1" rx="11" ry="13" fill="#FFFFFF" stroke="black" strokeWidth="1.5" /><ellipse cx="0" cy="3" rx="6" ry="8" fill={colors.eyes} /><circle cx="0" cy="3" r="2.5" fill="#111" /><circle cx="-3" cy="-2" r="3" fill="white" /></g>
                            <g transform={`translate(${22 + eyePosition.x}, ${eyePosition.y})`}><path d="M-14,-9 Q0,-14 14,-9" stroke="black" strokeWidth="2.5" fill="none" /><ellipse cx="0" cy="1" rx="11" ry="13" fill="#FFFFFF" stroke="black" strokeWidth="1.5" /><ellipse cx="0" cy="3" rx="6" ry="8" fill={colors.eyes} /><circle cx="0" cy="3" r="2.5" fill="#111" /><circle cx="-3" cy="-2" r="3" fill="white" /></g>
                        </g>
                    )}
                </g>
            )}

            {/* MOUTH */}
            <g transform="translate(0, 18)">
                {effectiveMood === PetMood.SURPRISED ? (
                    <circle r="3" fill="none" stroke="black" strokeWidth="2" />
                ) : effectiveMood === PetMood.HAPPY || effectiveMood === PetMood.LOVE ? (
                    <path d="M-4,-2 Q0,4 4,-2" fill="none" stroke="black" strokeWidth="2" />
                ) : (
                    // Idle Mouth
                    !isPinkSkin ? 
                    <path d="M-3,0 L3,0" stroke="black" strokeWidth="2" strokeLinecap="round" /> :
                    <path d="M-2,0 Q0,2 2,0" stroke="black" strokeWidth="1.5" fill="none" /> // Gentle smile
                )}
            </g>

            {/* HAIR - FRONT / BANGS */}
            {!isPinkSkin ? (
               // Girl White (Original)
               <path d="M-40,-30 Q-45,-10 -35,20 L-30,5 L-20,-10 L-10,5 L0,-15 L10,5 L20,-10 L30,5 L35,20 Q45,-10 40,-30 Q0,-42 -40,-30" fill={colors.hair} stroke="black" strokeWidth="2.5" />
            ) : (
               // Star Envoy (Updated) - Soft bangs
               <g>
                  <path d="M-38,-20 Q-20,-35 0,-25 Q20,-35 38,-20 L38,-10 Q20,-15 0,-12 Q-20,-15 -38,-10 Z" fill={colors.hair} stroke="black" strokeWidth="2.5" />
                  {/* Clip */}
                  <g transform="translate(25, -25) rotate(15)">
                     <path d="M0,-6 L2,-2 L6,-2 L3,1 L4,5 L0,3 L-4,5 L-3,1 L-6,-2 L-2,-2 Z" fill={colors.highlight} stroke="black" strokeWidth="1.5" />
                  </g>
               </g>
            )}
        </g>

        {effectiveMood === PetMood.ANGRY && <text x="130" y="60" fontSize="30" fill="red" fontWeight="bold">💢</text>}
        {effectiveMood === PetMood.LOVE && <text x="130" y="60" fontSize="30" fill="#FF69B4">💗</text>}
        {effectiveMood === PetMood.SLEEP && <text x="140" y="70" fontSize="24" fill="#666">Zzz</text>}
    </svg>
  );

  // --- Style Configuration based on Skin ID ---
  const uiTheme = React.useMemo(() => {
    switch (skinId) {
        case 'girl-white': // Cyberpunk / Glitch
            return {
                container: 'bg-black/90 border-2 border-[#00E5FF] shadow-[0_0_15px_#00E5FF]',
                headerText: 'text-[#00E5FF] font-mono tracking-widest',
                subText: 'text-gray-400 font-mono',
                barBg: 'bg-gray-800 border border-gray-600',
                font: 'font-mono',
                iconColor: 'text-[#00E5FF]',
                name: 'UNIT-01',
                accent: 'bg-[#FF0055]'
            };
        case 'girl-pink': // Star Envoy / Tarot
            return {
                container: 'bg-[#0F172A]/95 border-[3px] border-[#FACC15] shadow-[0_0_0_4px_#0F172A,0_0_0_6px_#FACC15]',
                headerText: 'text-[#FACC15] font-serif tracking-wide',
                subText: 'text-[#94A3B8] font-serif italic',
                barBg: 'bg-[#1E293B] border border-[#FACC15]',
                font: 'font-serif',
                iconColor: 'text-[#FACC15]',
                name: 'THE STAR',
                accent: 'bg-white'
            };
        case 'goth-bunny': // Goth / Punk
            return {
                container: 'bg-[#18181B] border-4 border-dashed border-[#F43F5E] shadow-[8px_8px_0_#000]',
                headerText: 'text-[#F43F5E] font-anime font-black tracking-tighter',
                subText: 'text-gray-500 font-black',
                barBg: 'bg-black border-2 border-white',
                font: 'font-anime',
                iconColor: 'text-white',
                name: 'DEAD_RABBIT',
                accent: 'bg-[#F43F5E]'
            };
        default: // Doodle / Cat
            return {
                container: 'bg-white border-[3px] border-black shadow-[6px_6px_0_#000]',
                headerText: 'text-black font-anime font-black',
                subText: 'text-gray-500 font-bold',
                barBg: 'bg-gray-100 border-2 border-black',
                font: 'font-anime',
                iconColor: 'text-black',
                name: 'DOODLE CAT',
                accent: 'bg-black'
            };
    }
  }, [skinId]);

  const StatBar = ({ value, max = 100, color, icon: Icon, label }: { value: number, max?: number, color: string, icon: any, label: string }) => (
    <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 flex items-center justify-center ${uiTheme.barBg} rounded shadow-sm`}>
           <Icon size={16} className={uiTheme.iconColor} />
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-end mb-1">
                <span className={`text-xs font-bold ${uiTheme.headerText}`}>{label}</span>
                <span className={`text-xs ${uiTheme.subText}`}>{Math.round(value)}/{max}</span>
            </div>
            <div className={`h-4 ${uiTheme.barBg} relative overflow-hidden rounded-sm`}>
                <div 
                  className={`absolute inset-0 ${color} transition-all duration-500`} 
                  style={{ width: `${(value / max) * 100}%` }}
                >
                    {/* Texture Overlay */}
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.2) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.2) 50%,rgba(255,255,255,.2) 75%,transparent 75%,transparent)', backgroundSize: '8px 8px' }} />
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className={`fixed z-[100] flex flex-col items-center select-none pointer-events-none`}
      style={{ 
        left: x, bottom: 0,
        transform: `translate(0, ${y}px) scale(${scale}) scaleX(${direction})`, 
        transformOrigin: 'bottom center', 
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'left 1s linear, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
      onMouseEnter={() => setShowUI(true)}
      onMouseLeave={() => setShowUI(false)}
    >
      {/* Speech Bubble */}
      <div 
        className={`
          absolute -top-32 right-12
          bg-white border-[3px] border-black px-4 py-3
          shadow-[4px_4px_0px_rgba(0,0,0,1)]
          font-anime text-lg font-bold text-black whitespace-nowrap z-50
          transition-all duration-300 origin-bottom-right pointer-events-none
          ${showBubble ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-12'}
        `}
        style={{ borderRadius: '20px 20px 5px 20px' }}
      >
        <span style={{ display: 'inline-block', transform: `scaleX(${direction})` }}>{message}</span>
      </div>

      {/* Stats Panel - LARGE CHARACTER CARD STYLE */}
      <div 
         className={`
            absolute top-10
            /* Move strictly to the right of the model container (400px wide) */
            left-[300px] 
            w-[240px] h-[380px]
            p-5 rounded-xl
            transition-all duration-300 pointer-events-auto z-40
            ${uiTheme.container}
            ${showUI ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}
         `}
         style={{ 
             // Counter-flip the container so it stays readable when pet flips
             transform: `scaleX(${direction})` 
         }} 
      > 
         {/* Inner Content - Direction safe */}
         <div className="h-full flex flex-col relative" style={{ direction: 'ltr' }}>
             
             {/* Header Section */}
             <div className="flex items-start justify-between border-b-2 border-current pb-3 mb-4 opacity-90" style={{ borderColor: 'inherit' }}>
                <div>
                    <h3 className={`text-xl font-bold leading-none mb-1 ${uiTheme.headerText}`}>{uiTheme.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${uiTheme.accent} text-white font-bold`}>
                            LV.{stats.level}
                        </span>
                        <span className={`text-[10px] ${uiTheme.subText}`}>EXP {Math.floor(stats.experience)}</span>
                    </div>
                </div>
                {skinId === 'goth-bunny' ? <Skull size={24} className={uiTheme.iconColor} /> : 
                 skinId === 'girl-pink' ? <Sparkles size={24} className={uiTheme.iconColor} /> :
                 skinId === 'girl-white' ? <Zap size={24} className={uiTheme.iconColor} /> :
                 <Cat size={24} className={uiTheme.iconColor} />}
             </div>
             
             {/* Stats Bars */}
             <div className="flex-1">
                <StatBar value={stats.hunger} color={skinId === 'goth-bunny' ? "bg-rose-600" : "bg-orange-400"} icon={Utensils} label="HUNGER" />
                <StatBar value={stats.happiness} color={skinId === 'girl-white' ? "bg-[#00E5FF]" : "bg-pink-500"} icon={Heart} label="MOOD" />
                <StatBar value={stats.health} color="bg-green-500" icon={Activity} label="HEALTH" />
             </div>

             {/* Flavor Footer */}
             <div className={`mt-auto pt-3 border-t border-dashed border-current opacity-60 text-center ${uiTheme.subText}`} style={{ borderColor: 'inherit' }}>
                 <p className="text-[10px] leading-tight uppercase tracking-wider">
                     {skinId === 'girl-pink' ? "The stars align..." : 
                      skinId === 'goth-bunny' ? "NO FUTURE" : 
                      skinId === 'girl-white' ? "SYSTEM ONLINE" : 
                      "KEEP DOODLING"}
                 </p>
             </div>
         </div>
      </div>

      {/* Pet Character - Select Renderer */}
      <div 
         className={`
           relative w-[400px] h-[500px] drop-shadow-2xl pointer-events-auto touch-none
           ${isDragging ? 'animate-bounce' : isWalking ? 'animate-bounce' : 'animate-float'}
           ${stats.health < 30 ? 'grayscale-[0.5]' : ''}
         `}
         style={{ animationDuration: isWalking ? '0.5s' : (stats.health < 30 ? '8s' : '4s') }}
         onMouseDown={handleMouseDown}
         onTouchStart={handleTouchStart}
         onClick={(e) => {
           if (!isDragging) {
                e.stopPropagation();
                triggerReaction(PetMood.HAPPY, 'happy');
                playSfx('pet-happy');
                setShowUI(true);
           }
         }}
      >
         {isCat ? renderCat() : isGoth ? renderGothBunny() : renderAnimeGirl()}
      </div>

       {/* Action Buttons */}
       <div 
         className={`
            absolute bottom-10 flex gap-2 pointer-events-auto
            transition-all duration-300
            ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
         `}
         style={{ transform: `scaleX(${direction})` }}
       >
           <button 
             onClick={(e) => { 
               e.stopPropagation(); 
               onFeed();
               triggerReaction(PetMood.HAPPY, 'feed');
             }}
             className="p-2 bg-orange-400 border-2 border-black rounded-full hover:scale-110 transition-transform shadow-[2px_2px_0_#000] hover:-rotate-12"
             title={t('petUI.feed')}
           >
             <Utensils size={20} className="text-white" />
           </button>
           <button 
             onClick={(e) => { 
               e.stopPropagation(); 
               onPlay();
               triggerReaction(PetMood.HAPPY, 'play');
             }}
             className="p-2 bg-jinx-blue border-2 border-black rounded-full hover:scale-110 transition-transform shadow-[2px_2px_0_#000] hover:rotate-12"
             title={t('petUI.play')}
           >
             <Gamepad2 size={20} className="text-black" />
           </button>
           <button 
             onClick={(e) => { 
               e.stopPropagation(); 
               onHeal();
               triggerReaction(PetMood.LOVE, 'heal');
             }}
             className="p-2 bg-green-400 border-2 border-black rounded-full hover:scale-110 transition-transform shadow-[2px_2px_0_#000]"
             title={t('petUI.heal')}
           >
             <Pill size={20} className="text-white" />
           </button>
        </div>
    </div>
  );
};

export default Pet;