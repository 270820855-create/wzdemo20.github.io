import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameId } from '../types';
import { BUILT_IN_GAMES } from '../constants';
import { X, RotateCcw, Trash2, MousePointer2, ZoomIn, ZoomOut, Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trophy, Circle, Bomb, Flag } from 'lucide-react';
import { playSfx } from '../utils/audio';

interface GameCenterModalProps {
  gameId: GameId | null;
  onClose: () => void;
}

// --- Nano Builder Constants & Types ---
const CUBE_SIZE = 32; 
const GRID_SIZE = 20;

const PALETTE = [
  { id: 'red', color: '#E11D48', top: '#F43F5E', side: '#BE123C' },
  { id: 'yellow', color: '#FACC15', top: '#FDE047', side: '#EAB308' },
  { id: 'black', color: '#171717', top: '#262626', side: '#000000' },
  { id: 'white', color: '#E5E7EB', top: '#F3F4F6', side: '#D1D5DB' },
  { id: 'skin', color: '#FDBA74', top: '#FED7AA', side: '#FB923C' },
  { id: 'brown', color: '#78350F', top: '#92400E', side: '#451A03' },
  { id: 'pink', color: '#F472B6', top: '#FBCFE8', side: '#DB2777' },
  { id: 'blue', color: '#3B82F6', top: '#60A5FA', side: '#2563EB' },
];

interface BlockData {
  colorIndex: number;
}
type BlockMap = Record<string, BlockData>;

// Cube Component (Memoized)
const Cube = React.memo(({ x, y, z, colorIndex, onClick }: { 
    x: number, y: number, z: number, colorIndex: number, 
    onClick: (e: React.MouseEvent | React.TouchEvent, bx: number, by: number, bz: number, face: string) => void 
}) => {
  const p = PALETTE[colorIndex] || PALETTE[0]; // Safety fallback
  
  const faceStyle = (tr: string, bg: string, isTop: boolean = false) => ({
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    backgroundColor: bg,
    transform: tr,
    border: '1px solid rgba(0,0,0,0.15)',
    boxSizing: 'border-box' as const,
    cursor: 'pointer',
  });

  const handleFaceClick = (e: React.MouseEvent | React.TouchEvent, face: string) => {
      e.stopPropagation();
      onClick(e, x, y, z, face);
  };

  return (
    <div style={{
        position: 'absolute', width: CUBE_SIZE, height: CUBE_SIZE,
        transform: `translate3d(${x * CUBE_SIZE}px, ${-y * CUBE_SIZE}px, ${z * CUBE_SIZE}px)`,
        transformStyle: 'preserve-3d',
    }}>
      <div onClick={(e) => handleFaceClick(e, 'front')} style={faceStyle(`rotateY(0deg) translateZ(${CUBE_SIZE/2}px)`, p.color)} />
      <div onClick={(e) => handleFaceClick(e, 'back')} style={faceStyle(`rotateY(180deg) translateZ(${CUBE_SIZE/2}px)`, p.side)} />
      <div onClick={(e) => handleFaceClick(e, 'right')} style={faceStyle(`rotateY(90deg) translateZ(${CUBE_SIZE/2}px)`, p.side)} />
      <div onClick={(e) => handleFaceClick(e, 'left')} style={faceStyle(`rotateY(-90deg) translateZ(${CUBE_SIZE/2}px)`, p.side)} />
      <div onClick={(e) => handleFaceClick(e, 'top')} style={faceStyle(`rotateX(90deg) translateZ(${CUBE_SIZE/2}px)`, p.top, true)}>
        <div style={{
            position: 'absolute', top: '15%', left: '15%', width: '70%', height: '70%',
            backgroundColor: p.top, borderRadius: '50%', transform: 'translateZ(4px)',
            boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.4), inset -2px -2px 4px rgba(0,0,0,0.2)',
            border: `1px solid ${p.color}`, pointerEvents: 'none',
        }} />
      </div>
      <div onClick={(e) => handleFaceClick(e, 'bottom')} style={faceStyle(`rotateX(-90deg) translateZ(${CUBE_SIZE/2}px)`, p.side)} />
    </div>
  );
}, (prev, next) => prev.colorIndex === next.colorIndex && prev.x === next.x && prev.y === next.y && prev.z === next.z);

const NanoBuilder: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockMap>({});
  const [selectedColorIdx, setSelectedColorIdx] = useState(0); 
  const [tool, setTool] = useState<'build' | 'delete'>('build');
  
  const blocksRef = useRef(blocks);
  const toolRef = useRef(tool);
  const colorRef = useRef(selectedColorIdx);

  useEffect(() => { blocksRef.current = blocks; }, [blocks]);
  useEffect(() => { toolRef.current = tool; }, [tool]);
  useEffect(() => { colorRef.current = selectedColorIdx; }, [selectedColorIdx]);

  const sceneRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const camera = useRef({ rotX: -30, rotY: 45, zoom: 0.8 });

  useEffect(() => {
    const newMap: BlockMap = {};
    const add = (x: number, y: number, z: number, cIdx: number) => { newMap[`${x},${y},${z}`] = { colorIndex: cIdx }; };
    for(let x=-2; x<=2; x++) for(let z=-2; z<=2; z++) add(x, 0, z, 0); 
    for(let y=1; y<=4; y++) for(let x=-3; x<=3; x++) for(let z=-2; z<=2; z++) {
        if(Math.abs(x)===3 && Math.abs(z)===2) continue; add(x, y, z, 5); 
    }
    for(let x=-2; x<=2; x++) { add(x, 2, 2, 4); add(x, 3, 2, 4); }
    add(-1, 3, 3, 2); add(1, 3, 3, 2); add(0, 2, 3, 2); 
    add(-4, 5, 0, 5); add(-4, 5, 1, 6); add(4, 5, 0, 5); add(4, 5, 1, 6);  
    for(let x=-2; x<=2; x++) for(let z=-2; z<=1; z++) add(x, 5, z, 0); 
    add(0, 6, -1, 1); 
    setBlocks(newMap);
    updateCameraTransform();
  }, []);

  const updateCameraTransform = () => {
    if (sceneRef.current) {
        sceneRef.current.style.transform = `scale(${camera.current.zoom}) rotateX(${camera.current.rotX}deg) rotateY(${camera.current.rotY}deg)`;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
     if (e.button === 0 && !e.altKey) { 
         isDragging.current = true;
         lastMouse.current = { x: e.clientX, y: e.clientY };
     }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
        rotateCamera(e.clientX - lastMouse.current.x, e.clientY - lastMouse.current.y);
        lastMouse.current = { x: e.clientX, y: e.clientY };
    }
  };
  const handleTouchStart = (e: React.TouchEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchMove = (e: React.TouchEvent) => {
      if (isDragging.current) {
        rotateCamera(e.touches[0].clientX - lastMouse.current.x, e.touches[0].clientY - lastMouse.current.y);
        lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
  };
  const rotateCamera = (dx: number, dy: number) => {
      camera.current.rotY += dx * 0.5;
      camera.current.rotX -= dy * 0.5;
      camera.current.rotX = Math.max(-90, Math.min(0, camera.current.rotX));
      requestAnimationFrame(updateCameraTransform);
  };
  const zoom = (delta: number) => {
      camera.current.zoom = Math.max(0.3, Math.min(3, camera.current.zoom + delta));
      requestAnimationFrame(updateCameraTransform);
  };

  const handleBlockClick = useCallback((e: React.MouseEvent | React.TouchEvent, bx: number, by: number, bz: number, face: string) => {
      const isAlt = (e as React.MouseEvent).altKey;
      if (toolRef.current === 'delete' || isAlt) {
          playSfx('delete');
          setBlocks(prev => { const n={...prev}; delete n[`${bx},${by},${bz}`]; return n; });
          return;
      }
      let nx = bx, ny = by, nz = bz;
      if (face === 'top') ny++; else if (face === 'bottom') ny--;
      else if (face === 'left') nx--; else if (face === 'right') nx++;
      else if (face === 'front') nz++; else if (face === 'back') nz--;

      const key = `${nx},${ny},${nz}`;
      if (!blocksRef.current[key]) {
          playSfx('click');
          setBlocks(prev => ({ ...prev, [key]: { colorIndex: colorRef.current } }));
      }
  }, []); 

  const handleBasePlateClick = (x: number, z: number) => {
      if (toolRef.current === 'delete') return;
      const key = `${x},0,${z}`;
      if (!blocksRef.current[key]) {
        playSfx('click');
        setBlocks(prev => ({ ...prev, [key]: { colorIndex: colorRef.current } }));
      }
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-gray-50 select-none overflow-hidden">
        <div className="absolute top-4 left-4 right-4 z-40 bg-white border-[3px] border-black p-2 md:p-3 shadow-[4px_4px_0_#000] flex flex-col gap-2 rounded-lg max-w-sm">
             <div className="flex gap-2">
                 <button onClick={() => setTool('build')} className={`flex-1 py-2 font-bold border-2 border-black flex items-center justify-center gap-2 ${tool === 'build' ? 'bg-neon-green' : 'bg-gray-100'}`}><MousePointer2 size={16} /> BUILD</button>
                 <button onClick={() => setTool('delete')} className={`flex-1 py-2 font-bold border-2 border-black flex items-center justify-center gap-2 ${tool === 'delete' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}><Trash2 size={16} /> ERASE</button>
             </div>
             <div className="grid grid-cols-8 gap-1">
                 {PALETTE.map((p, idx) => (
                     <button key={p.id} onClick={() => { setSelectedColorIdx(idx); playSfx('pop'); }} className={`w-8 h-8 rounded-full border-2 border-black ${selectedColorIdx === idx ? 'ring-2 ring-black scale-110' : ''}`} style={{ backgroundColor: p.color }} />
                 ))}
             </div>
             <div className="flex gap-2 justify-between">
                <button onClick={() => setBlocks({})} className="px-2 py-1 border-2 border-black bg-gray-200 text-xs flex items-center"><RotateCcw size={12} className="mr-1"/> RESET</button>
                <div className="flex gap-1 md:hidden">
                    <button onClick={() => zoom(0.2)} className="p-1 border-2 border-black bg-white"><ZoomIn size={16}/></button>
                    <button onClick={() => zoom(-0.2)} className="p-1 border-2 border-black bg-white"><ZoomOut size={16}/></button>
                </div>
             </div>
        </div>
        <div className="flex-1 cursor-move relative perspective-container touch-none"
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={() => isDragging.current=false} onMouseLeave={() => isDragging.current=false}
            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => isDragging.current=false} onWheel={(e) => zoom(-Math.sign(e.deltaY)*0.1)}
            style={{ perspective: '1200px', overflow: 'hidden' }}>
            <div ref={sceneRef} className="absolute left-1/2 top-1/2 w-0 h-0" style={{ transformStyle: 'preserve-3d' }}>
                <div style={{ 
                        transform: `rotateX(90deg) translateZ(${-CUBE_SIZE/2}px)`, width: GRID_SIZE * CUBE_SIZE, height: GRID_SIZE * CUBE_SIZE,
                        position: 'absolute', top: -(GRID_SIZE * CUBE_SIZE)/2, left: -(GRID_SIZE * CUBE_SIZE)/2,
                        backgroundColor: 'rgba(255,255,255,0.4)', border: '4px solid #000',
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                        backgroundSize: `${CUBE_SIZE}px ${CUBE_SIZE}px`
                    }}>
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                        <div key={i} onClick={(e) => { e.stopPropagation(); handleBasePlateClick((i % GRID_SIZE) - GRID_SIZE/2, Math.floor(i / GRID_SIZE) - GRID_SIZE/2); }} 
                             style={{position:'absolute', left: `${(i%GRID_SIZE)*CUBE_SIZE}px`, top: `${Math.floor(i/GRID_SIZE)*CUBE_SIZE}px`, width:CUBE_SIZE, height:CUBE_SIZE}} />
                    ))}
                </div>
                {Object.entries(blocks).map(([key, data]) => {
                    const blockData = data as BlockData;
                    const [x, y, z] = key.split(',').map(Number);
                    return <Cube key={key} x={x} y={y} z={z} colorIndex={blockData.colorIndex} onClick={handleBlockClick} />;
                })}
            </div>
        </div>
    </div>
  );
};

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState([{x: 10, y: 10}]);
  const [food, setFood] = useState({x: 15, y: 15});
  const [dir, setDir] = useState({x: 1, y: 0});
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('snake-highscore') || '0'));
  const [isPlaying, setIsPlaying] = useState(false);
  const moveRef = useRef(dir);

  useEffect(() => { moveRef.current = dir; }, [dir]);
  useEffect(() => { localStorage.setItem('snake-highscore', highScore.toString()); }, [highScore]);

  const resetGame = () => {
    setSnake([{x: 10, y: 10}]); setFood({x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)});
    setDir({x: 1, y: 0}); setGameOver(false); setScore(0); setIsPlaying(true); playSfx('click');
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const tick = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + moveRef.current.x, y: prev[0].y + moveRef.current.y };
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true); playSfx('delete'); return prev;
        }
        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
           playSfx('pop'); setScore(s => { const ns = s + 10; if (ns > highScore) setHighScore(ns); return ns; });
           setFood({x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)});
        } else { newSnake.pop(); }
        return newSnake;
      });
    }, 150);
    return () => clearInterval(tick);
  }, [isPlaying, gameOver, food, highScore]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-4 relative">
       <div className="absolute top-4 flex gap-8 font-anime text-xl font-black">
          <div className="flex items-center gap-2"><Trophy size={20} className="text-yellow-500" /><span>HI: {highScore}</span></div>
          <div>SCORE: {score}</div>
       </div>
       <div className="relative bg-white border-4 border-black w-full max-w-[400px] aspect-square shadow-[4px_4px_0_#000]">
          <div className="absolute bg-red-500 border border-black rounded-full animate-pulse" style={{ left: `${food.x * 5}%`, top: `${food.y * 5}%`, width: '5%', height: '5%' }} />
          {snake.map((part, i) => (
             <div key={i} className={`absolute border border-black ${i === 0 ? 'bg-neon-green z-10' : 'bg-black'}`} style={{ left: `${part.x * 5}%`, top: `${part.y * 5}%`, width: '5%', height: '5%', borderRadius: i === 0 ? '2px' : '0' }} />
          ))}
          {(!isPlaying || gameOver) && (
             <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm z-20">
                 <h3 className="font-anime text-4xl mb-4">{gameOver ? 'GAME OVER' : 'SNAKE'}</h3>
                 <button onClick={resetGame} className="bg-neon-green text-black px-6 py-2 font-black border-2 border-white hover:scale-110">{gameOver ? 'TRY AGAIN' : 'START'}</button>
             </div>
          )}
       </div>
       <div className="mt-6 grid grid-cols-3 gap-2 md:hidden">
          <div /><button onClick={() => { if (moveRef.current.y === 0) setDir({x: 0, y: -1}) }} className="p-4 bg-white border-2 border-black"><ArrowUp /></button><div />
          <button onClick={() => { if (moveRef.current.x === 0) setDir({x: -1, y: 0}) }} className="p-4 bg-white border-2 border-black"><ArrowLeft /></button>
          <button onClick={() => { if (moveRef.current.y === 0) setDir({x: 0, y: 1}) }} className="p-4 bg-white border-2 border-black"><ArrowDown /></button>
          <button onClick={() => { if (moveRef.current.x === 0) setDir({x: 1, y: 0}) }} className="p-4 bg-white border-2 border-black"><ArrowRight /></button>
       </div>
    </div>
  );
};

const TicTacToe: React.FC = () => {
    const [board, setBoard] = useState<(string|null)[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState<string|null>(null);

    const handleClick = (i: number) => {
        if (board[i] || winner) return;
        const next = [...board]; next[i] = xIsNext ? 'X' : 'O';
        setBoard(next); setXIsNext(!xIsNext); playSfx('pop');
        
        const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for(let l of lines) { if(next[l[0]] && next[l[0]] === next[l[1]] && next[l[0]] === next[l[2]]) setWinner(next[l[0]]); }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="font-anime text-4xl font-black mb-8 flex items-center gap-4">
                {winner ? `Winner: ${winner}` : board.every(Boolean) ? "Draw!" : `Next: ${xIsNext ? 'X' : 'O'}`}
                {(winner || board.every(Boolean)) && <button onClick={() => {setBoard(Array(9).fill(null)); setWinner(null); playSfx('delete');}} className="p-2 bg-black text-white rounded-full"><RotateCcw size={20} /></button>}
            </div>
            <div className="grid grid-cols-3 gap-2 bg-black p-2 rounded-lg shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
                {board.map((cell, i) => (
                    <button key={i} onClick={() => handleClick(i)} className="w-20 h-20 md:w-24 md:h-24 bg-white hover:bg-gray-100 font-anime font-black text-5xl flex items-center justify-center">
                        {cell === 'X' && <X size={48} className="text-red-500" strokeWidth={4} />}
                        {cell === 'O' && <Circle size={40} className="text-blue-500" strokeWidth={4} />}
                    </button>
                ))}
            </div>
        </div>
    );
};

const Game2048: React.FC = () => {
  const [grid, setGrid] = useState<number[]>(Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initGame = () => {
    const g = Array(16).fill(0);
    const add = (gr: number[]) => {
       const empty = gr.map((v,i)=>v===0?i:-1).filter(i=>i!==-1);
       if(empty.length) gr[empty[Math.floor(Math.random()*empty.length)]] = Math.random()<0.9?2:4;
    };
    add(g); add(g); setGrid(g); setScore(0); setGameOver(false); playSfx('click');
  };

  useEffect(() => { initGame(); }, []);

  const move = useCallback((dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      if (gameOver) return;
      let moved = false; const newGrid = [...grid]; let newScore = score;
      
      const process = (indices: number[]) => {
          const vals = indices.map(i => newGrid[i]).filter(v => v);
          for(let i=0; i<vals.length-1; i++) {
              if(vals[i] === vals[i+1]) { vals[i]*=2; vals[i+1]=0; newScore+=vals[i]; moved=true; }
          }
          const final = vals.filter(v => v);
          while(final.length < 4) final.push(0);
          indices.forEach((idx, i) => { if(newGrid[idx] !== final[i]) { newGrid[idx] = final[i]; moved=true; } });
      };

      if (dir==='LEFT') [0,4,8,12].forEach(r => process([r,r+1,r+2,r+3]));
      else if (dir==='RIGHT') [0,4,8,12].forEach(r => process([r+3,r+2,r+1,r]));
      else if (dir==='UP') [0,1,2,3].forEach(c => process([c,c+4,c+8,c+12]));
      else if (dir==='DOWN') [0,1,2,3].forEach(c => process([c+12,c+8,c+4,c]));

      if (moved) {
          playSfx('pop');
          const empty = newGrid.map((v,i)=>v===0?i:-1).filter(i=>i!==-1);
          if(empty.length) newGrid[empty[Math.floor(Math.random()*empty.length)]] = Math.random()<0.9?2:4;
          setGrid(newGrid); setScore(newScore);
          // Check game over simply
          if (!newGrid.includes(0)) {
             let canMove = false;
             for(let i=0; i<16; i++) {
                 if ((i+1)%4!==0 && newGrid[i]===newGrid[i+1]) canMove=true;
                 if (i+4<16 && newGrid[i]===newGrid[i+4]) canMove=true;
             }
             if(!canMove) setGameOver(true);
          }
      }
  }, [grid, gameOver, score]);

  useEffect(() => {
      const h = (e: KeyboardEvent) => {
          if(e.key==='ArrowUp') move('UP'); else if(e.key==='ArrowDown') move('DOWN');
          else if(e.key==='ArrowLeft') move('LEFT'); else if(e.key==='ArrowRight') move('RIGHT');
      };
      window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [move]);

  const getColor = (v: number) => {
     if(!v) return 'bg-gray-200'; if(v===2) return 'bg-white text-black'; if(v===4) return 'bg-yellow-100 text-black';
     if(v===8) return 'bg-orange-300 text-white'; if(v===16) return 'bg-orange-500 text-white';
     if(v>=2048) return 'bg-jinx-pink text-white'; return 'bg-black text-white';
  };

  return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-4 relative">
          <div className="flex justify-between w-full max-w-[400px] mb-4">
              <div className="bg-black text-white p-2 rounded shadow-[4px_4px_0_#CCFF00]"><span className="text-xs text-gray-400">SCORE</span><div className="font-anime font-black text-2xl">{score}</div></div>
              <button onClick={initGame} className="p-2 border-2 border-black bg-white rounded"><RotateCcw size={24} /></button>
          </div>
          <div className="relative bg-[#BBADA0] border-4 border-black p-2 rounded-lg shadow-[8px_8px_0_#000]">
               <div className="grid grid-cols-4 gap-2 w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                   {grid.map((cell, idx) => (
                       <div key={idx} className={`rounded flex items-center justify-center font-black text-3xl font-anime transition-all ${getColor(cell)}`}>{cell||''}</div>
                   ))}
               </div>
               {gameOver && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10 text-white"><h2 className="text-5xl font-anime font-black mb-4">GAME OVER</h2><button onClick={initGame} className="bg-neon-green text-black px-6 py-2 font-black border-2 border-white">TRY AGAIN</button></div>}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 md:hidden">
              <div /><button onClick={()=>move('UP')} className="p-4 bg-white border-2 border-black"><ArrowUp/></button><div />
              <button onClick={()=>move('LEFT')} className="p-4 bg-white border-2 border-black"><ArrowLeft/></button>
              <button onClick={()=>move('DOWN')} className="p-4 bg-white border-2 border-black"><ArrowDown/></button>
              <button onClick={()=>move('RIGHT')} className="p-4 bg-white border-2 border-black"><ArrowRight/></button>
          </div>
      </div>
  );
};

// Minesweeper
const Minesweeper: React.FC = () => {
   const ROWS=9, COLS=9, MINES=10;
   interface Cell { isMine: boolean; isOpen: boolean; isFlagged: boolean; count: number; }
   const [grid, setGrid] = useState<Cell[]>([]);
   const [gameOver, setGameOver] = useState(false);
   const [win, setWin] = useState(false);
   const [flags, setFlags] = useState(MINES);

   const initGame = () => {
       const g: Cell[] = Array(ROWS*COLS).fill(null).map(() => ({ isMine: false, isOpen: false, isFlagged: false, count: 0 }));
       let m = 0; while(m<MINES) { const i=Math.floor(Math.random()*ROWS*COLS); if(!g[i].isMine) { g[i].isMine=true; m++; } }
       for(let i=0; i<ROWS*COLS; i++) {
           if(g[i].isMine) continue;
           const r=Math.floor(i/COLS), c=i%COLS;
           let cnt=0;
           for(let dr=-1; dr<=1; dr++) for(let dc=-1; dc<=1; dc++) {
               const nr=r+dr, nc=c+dc; if(nr>=0 && nr<ROWS && nc>=0 && nc<COLS && g[nr*COLS+nc].isMine) cnt++;
           }
           g[i].count = cnt;
       }
       setGrid(g); setGameOver(false); setWin(false); setFlags(MINES); playSfx('click');
   };

   useEffect(() => { initGame(); }, []);

   const reveal = (idx: number, g: Cell[]) => {
       if(idx<0 || idx>=ROWS*COLS || g[idx].isOpen || g[idx].isFlagged) return;
       g[idx].isOpen = true;
       if(g[idx].count===0 && !g[idx].isMine) {
           const r=Math.floor(idx/COLS), c=idx%COLS;
           for(let dr=-1; dr<=1; dr++) for(let dc=-1; dc<=1; dc++) {
               const nr=r+dr, nc=c+dc; if(nr>=0 && nr<ROWS && nc>=0 && nc<COLS) reveal(nr*COLS+nc, g);
           }
       }
   };

   const handleClick = (idx: number) => {
       if(gameOver||win||grid[idx].isOpen||grid[idx].isFlagged) return;
       playSfx('pop');
       if(grid[idx].isMine) {
           playSfx('delete'); setGameOver(true);
           const ng=[...grid]; ng[idx].isOpen=true; ng.forEach(c=>{if(c.isMine)c.isOpen=true}); setGrid(ng);
       } else {
           const ng=JSON.parse(JSON.stringify(grid)); reveal(idx, ng); setGrid(ng);
           if(ng.filter((c:Cell)=>!c.isOpen).length===MINES) { setWin(true); playSfx('success'); }
       }
   };
   
   const handleRightClick = (e: React.MouseEvent, idx: number) => {
       e.preventDefault(); if(gameOver||win||grid[idx].isOpen) return;
       playSfx('click'); const ng=[...grid]; ng[idx].isFlagged = !ng[idx].isFlagged;
       setGrid(ng); setFlags(MINES - ng.filter(c=>c.isFlagged).length);
   };

   return (
       <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
           <div className="flex justify-between w-full max-w-[350px] mb-4 bg-gray-200 border-2 border-gray-400 p-2 shadow-inner">
               <div className="bg-black text-red-500 font-mono text-2xl font-bold px-2">{String(flags).padStart(3,'0')}</div>
               <button onClick={initGame} className="border-2 border-gray-400 bg-gray-200 p-1">{gameOver?'😵':win?'😎':'🙂'}</button>
               <div className="bg-black text-red-500 font-mono text-2xl font-bold px-2">{gameOver||win?'000':'000'}</div>
           </div>
           <div className="bg-gray-300 p-2 border-4 border-gray-400 border-t-white border-l-white">
               <div className="grid grid-cols-9 gap-[1px] bg-gray-400">
                   {grid.map((c, i) => (
                       <div key={i} onClick={()=>handleClick(i)} onContextMenu={(e)=>handleRightClick(e,i)}
                          className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-xl cursor-default select-none ${c.isOpen?'bg-gray-200 border border-gray-300':'bg-gray-200 border-4 border-gray-200 border-t-white border-l-white border-b-gray-500 border-r-gray-500'} ${c.isMine&&c.isOpen?'bg-red-500':''}`}>
                           {c.isOpen ? (c.isMine?<Bomb size={20}/>:(c.count>0?<span className={['','text-blue-600','text-green-600','text-red-600','text-purple-600'][c.count]||'text-black'}>{c.count}</span>:'')) : (c.isFlagged?<Flag size={18} className="text-red-600" fill="currentColor"/>:'')}
                       </div>
                   ))}
               </div>
           </div>
           <div className="mt-4 text-xs text-gray-500 md:hidden">Tap to reveal • Long press/Right click to flag</div>
       </div>
   );
};

const GameCenterModal: React.FC<GameCenterModalProps> = ({ gameId, onClose }) => {
  if (!gameId) return null;
  const game = BUILT_IN_GAMES.find(g => g.id === gameId);
  return (
    <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-6 animate-fade-in">
       <div className="w-full h-full max-w-5xl bg-white border-[3px] border-black shadow-[8px_8px_0_#CCFF00] relative overflow-hidden flex flex-col animate-pop">
          <div className="bg-black text-white p-3 flex justify-between items-center z-50 shrink-0">
             <span className="font-anime font-bold text-xl ml-2 flex items-center gap-2"><Gamepad2 className="text-neon-green" size={24} /> {game?.name || 'GAME CENTER'}</span>
             <button onClick={() => { onClose(); playSfx('click'); }} className="bg-white text-black p-1 rounded hover:bg-red-500 hover:text-white"><X size={20} strokeWidth={3} /></button>
          </div>
          <div className="flex-1 relative overflow-hidden">
             {gameId === 'tetris3d' && <NanoBuilder />}
             {gameId === 'snake' && <SnakeGame />}
             {gameId === 'tictactoe' && <TicTacToe />}
             {gameId === '2048' && <Game2048 />}
             {gameId === 'minesweeper' && <Minesweeper />}
             {!['tetris3d', 'snake', 'tictactoe', '2048', 'minesweeper'].includes(gameId) && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                    <div className="text-6xl mb-4 animate-bounce">{game?.icon}</div>
                    <p className="font-anime text-4xl font-black mb-2 uppercase">Coming Soon</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default GameCenterModal;