'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const 礼炮动画 = ({ isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const duration = 1000; // 1秒
      const animationEnd = Date.now() + duration;
      const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: 0,
        particleCount: 100,
        origin: { y: 0.8 }
      };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // 从左侧迸出
        confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          angle: randomInRange(45, 75),
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']
        }));
        
        // 从右侧迸出
        confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          angle: randomInRange(105, 135),
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']
        }));
      }, 250);
    }
  }, [isVisible]);

  return null;
};

export default 礼炮动画; 