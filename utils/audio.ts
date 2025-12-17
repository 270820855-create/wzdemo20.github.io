// Simple Web Audio API wrapper for doodle sounds

let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export type SoundType = 'click' | 'pop' | 'success' | 'delete' | 'pet-happy' | 'pet-surprised' | 'open' | 'scribble';

export const playSfx = (type: SoundType) => {
  try {
    const ctx = getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    // Oscillator helper
    const playOsc = (
        type: OscillatorType, 
        freqStart: number, 
        freqEnd: number, 
        dur: number, 
        vol: number,
        delay: number = 0
    ) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);

        osc.type = type;
        osc.frequency.setValueAtTime(freqStart, now + delay);
        if (freqStart !== freqEnd) {
            osc.frequency.exponentialRampToValueAtTime(freqEnd, now + delay + dur);
        }
        
        oscGain.gain.setValueAtTime(vol, now + delay);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
        
        osc.start(now + delay);
        osc.stop(now + delay + dur);
    };

    // Noise helper (for paper/scribble sounds)
    const playNoise = (dur: number, filterFreq: number, vol: number) => {
         const bufSize = ctx.sampleRate * dur;
         const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
         const data = buffer.getChannelData(0);
         for(let i=0; i<bufSize; i++) data[i] = Math.random() * 2 - 1;

         const noise = ctx.createBufferSource();
         noise.buffer = buffer;
         const noiseGain = ctx.createGain();
         
         const filter = ctx.createBiquadFilter();
         filter.type = 'lowpass';
         filter.frequency.value = filterFreq;

         noise.connect(filter);
         filter.connect(noiseGain);
         noiseGain.connect(ctx.destination);
         
         noiseGain.gain.setValueAtTime(vol, now);
         noiseGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
         noise.start(now);
    };

    switch (type) {
      case 'click':
        // Sharp woodblock/pen tap
        playOsc('sine', 800, 1200, 0.05, 0.2);
        break;

      case 'pop':
        // Bubble pop
        playOsc('sine', 400, 800, 0.1, 0.3);
        break;

      case 'open':
      case 'scribble':
        // Fast marker stroke / page turn
        playNoise(0.15, 800, 0.2);
        break;

      case 'success':
        // Major arpeggio (C-E-G) - "Ding!"
        playOsc('triangle', 523.25, 523.25, 0.2, 0.1, 0);
        playOsc('triangle', 659.25, 659.25, 0.2, 0.1, 0.05);
        playOsc('triangle', 783.99, 783.99, 0.3, 0.1, 0.1);
        break;

      case 'delete':
        // Crumpling paper / Scratch out
        playNoise(0.2, 300, 0.3);
        break;
      
      case 'pet-happy':
        // High pitched chirp/whistle
        playOsc('sine', 1200, 1500, 0.15, 0.1);
        playOsc('sine', 1500, 1800, 0.15, 0.1, 0.15);
        break;

      case 'pet-surprised':
        // Slide up
        playOsc('square', 300, 800, 0.1, 0.05);
        break;
    }
  } catch (e) {
    // Audio context not ready or blocked
    console.warn("Audio play failed", e);
  }
};