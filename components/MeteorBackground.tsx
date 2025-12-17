import React, { useEffect, useRef } from 'react';

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  color: string;
  width: number;
}

interface MeteorBackgroundProps {
  darkMode: boolean;
}

const MeteorBackground: React.FC<MeteorBackgroundProps> = ({ darkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const darkModeRef = useRef(darkMode);

  // Keep ref in sync for the animation loop
  useEffect(() => {
    darkModeRef.current = darkMode;
  }, [darkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let meteors: Meteor[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Palette: Mostly black (ink), with rare theme colors
    const colors = ['#000000', '#000000', '#000000', '#FF0055', '#00E5FF', '#CCFF00'];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      meteors = [];
      // Initial population
      for (let i = 0; i < 20; i++) {
        createMeteor(true);
      }
    };

    const createMeteor = (randomY = false) => {
      const isFast = Math.random() > 0.8; // Some meteors are very fast
      meteors.push({
        x: Math.random() * width + (width * 0.5), // Start mostly from right side
        y: randomY ? Math.random() * height : -100,
        length: Math.random() * 80 + 40,
        speed: (Math.random() * 5 + 5) * (isFast ? 1.5 : 1),
        color: colors[Math.floor(Math.random() * colors.length)],
        width: Math.random() * 2 + 1
      });
    };

    const draw = () => {
      const isDark = darkModeRef.current;

      // Clear transparently so the CSS background div shows through
      ctx.clearRect(0, 0, width, height);

      // Draw static noise/stars (Doodle style dots)
      // In dark mode: dim white stars. In light mode: light gray paper noise.
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB';
      
      for (let i = 0; i < 50; i++) {
         // Use a pseudo-random deterministic position based on index to keep stars static-ish
         const noiseX = (Math.sin(Date.now() * 0.00001 + i) * width + width) % width;
         const noiseY = (Math.cos(i * 123) * height + height) % height;
         ctx.beginPath();
         // In dark mode, stars are slightly smaller and sharper
         ctx.arc(noiseX, noiseY, Math.random() * (isDark ? 1.5 : 2), 0, Math.PI * 2);
         ctx.fill();
      }

      // Draw Meteors
      ctx.lineCap = 'round';
      
      for (let i = 0; i < meteors.length; i++) {
        const m = meteors[i];
        
        // Dynamic color adjustment
        // If the meteor is 'black' (default ink), turn it white in dark mode.
        // Keep accent colors (Pink, Blue, Green) as they are visible on both.
        let renderColor = m.color;
        if (m.color === '#000000' && isDark) {
            renderColor = '#FFFFFF';
        }

        ctx.strokeStyle = renderColor;
        ctx.lineWidth = m.width;
        
        // Adjust opacity based on mode
        let alpha = 1.0;
        if (m.color === '#000000') {
             // Ink is heavy in light mode, White is ghost-like in dark mode
             alpha = isDark ? 0.4 : 0.8;
        } else {
             // Accents
             alpha = 0.6;
        }
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        // Angle: 45 degrees (Top-Right to Bottom-Left)
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x + m.length, m.y - m.length); 
        ctx.stroke();

        // Update position (Move Down-Left)
        m.x -= m.speed;
        m.y += m.speed;

        // Reset if out of bounds
        if (m.x < -100 || m.y > height + 100) {
           meteors.splice(i, 1);
           i--;
           // Chance to respawn
           if (meteors.length < 25) {
               createMeteor();
           }
        }
      }

      ctx.globalAlpha = 1.0;

      // Randomly add new meteors
      if (Math.random() < 0.1 && meteors.length < 30) {
        createMeteor();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    init();
    draw();

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
        {/* Background Layer with smooth color transition */}
        <div 
          className={`
            fixed inset-0 transition-colors duration-1000 ease-in-out -z-10
            ${darkMode ? 'bg-[#0F172A]' : 'bg-[#F8F9FA]'}
          `} 
        />
        {/* Canvas Layer for Stars/Meteors */}
        <canvas 
          ref={canvasRef} 
          className="fixed inset-0 w-full h-full pointer-events-none z-0"
        />
    </>
  );
};

export default MeteorBackground;