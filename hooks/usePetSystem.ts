import { useState, useEffect, useCallback } from 'react';
import { PetStats, PetMood } from '../types';
import { playSfx } from '../utils/audio';

const DEFAULT_STATS: PetStats = {
  hunger: 80,
  happiness: 80,
  health: 100,
  level: 1,
  experience: 0,
  maxExp: 100,
  lastUpdate: Date.now(),
};

// Decay configuration
const DECAY_INTERVAL = 60000; // Run every minute
const HUNGER_DECAY = 2;       // -2 hunger per min
const HAPPINESS_DECAY = 1;    // -1 happiness per min
const HEALTH_DECAY_PENALTY = 5; // -5 health if starving

export const usePetSystem = (initialMoodSetter: (m: PetMood) => void) => {
  const [stats, setStats] = useState<PetStats>(() => {
    const saved = localStorage.getItem('doodle-pet-stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Calculate offline decay
        const now = Date.now();
        const diffMinutes = Math.floor((now - parsed.lastUpdate) / 60000);
        
        if (diffMinutes > 0) {
           const hungerLoss = Math.min(parsed.hunger, diffMinutes * HUNGER_DECAY); // Slower offline decay?
           const happinessLoss = Math.min(parsed.happiness, diffMinutes * HAPPINESS_DECAY);
           
           // If hunger dropped to 0 during offline, penalize health
           let healthLoss = 0;
           if (parsed.hunger - hungerLoss <= 0) {
               healthLoss = Math.min(parsed.health, Math.floor(diffMinutes * 0.5));
           }

           return {
             ...parsed,
             hunger: parsed.hunger - hungerLoss,
             happiness: parsed.happiness - happinessLoss,
             health: parsed.health - healthLoss,
             lastUpdate: now
           };
        }
        return parsed;
      } catch (e) {
        return DEFAULT_STATS;
      }
    }
    return DEFAULT_STATS;
  });

  // Persist
  useEffect(() => {
    localStorage.setItem('doodle-pet-stats', JSON.stringify(stats));
  }, [stats]);

  // Game Loop (Decay)
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => {
        const newHunger = Math.max(0, prev.hunger - HUNGER_DECAY);
        const newHappiness = Math.max(0, prev.happiness - HAPPINESS_DECAY);
        
        // Health logic: if starving or very sad, health drops
        let healthDecay = 0;
        if (newHunger === 0) healthDecay += 2;
        if (newHappiness === 0) healthDecay += 1;
        // Auto heal slightly if well fed and happy
        let healthRegen = 0;
        if (newHunger > 80 && newHappiness > 80 && prev.health < 100) healthRegen = 1;

        return {
          ...prev,
          hunger: newHunger,
          happiness: newHappiness,
          health: Math.min(100, Math.max(0, prev.health - healthDecay + healthRegen)),
          lastUpdate: Date.now()
        };
      });
    }, DECAY_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  // Helper to check level up
  const checkLevelUp = (currentStats: PetStats, expGain: number): PetStats => {
      let newExp = currentStats.experience + expGain;
      let newLevel = currentStats.level;
      let newMaxExp = currentStats.maxExp;

      if (newExp >= newMaxExp) {
          playSfx('success');
          newExp -= newMaxExp;
          newLevel += 1;
          newMaxExp = Math.floor(newMaxExp * 1.5);
          initialMoodSetter(PetMood.LOVE); // Trigger visual reaction
      }

      return {
          ...currentStats,
          level: newLevel,
          experience: newExp,
          maxExp: newMaxExp
      };
  };

  // Interactions
  const feed = useCallback(() => {
      playSfx('pop');
      initialMoodSetter(PetMood.HAPPY);
      setStats(prev => {
          const s = checkLevelUp(prev, 15);
          return {
              ...s,
              hunger: Math.min(100, prev.hunger + 20),
              health: Math.min(100, prev.health + 2)
          };
      });
  }, [initialMoodSetter]);

  const play = useCallback(() => {
      playSfx('pet-happy');
      initialMoodSetter(PetMood.HAPPY);
      setStats(prev => {
          // Playing costs a bit of hunger but gives happiness and XP
          const s = checkLevelUp(prev, 25);
          return {
              ...s,
              happiness: Math.min(100, prev.happiness + 20),
              hunger: Math.max(0, prev.hunger - 5)
          };
      });
  }, [initialMoodSetter]);

  const heal = useCallback(() => {
      playSfx('success');
      initialMoodSetter(PetMood.LOVE);
      setStats(prev => ({
          ...prev,
          health: Math.min(100, prev.health + 30),
          happiness: Math.min(100, prev.happiness - 5) // Medicine tastes bad?
      }));
  }, [initialMoodSetter]);

  return { stats, feed, play, heal };
};