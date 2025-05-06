import React from 'react';
import { motion } from 'framer-motion';
import './free-palastine.css';

const MovingText = () => {
  // Animation configuration
  const textVariants = {
    initial: { x: '-100%' },
    animate: { 
      x: '140%',
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
        //   duration: 12,
          duration: 5,
          ease: 'linear'
        }
      }
    }
  };

  return (
    <div className="moving-text-container">
      <motion.div 
        className="moving-text"
        variants={textVariants}
        initial="initial"
        animate="animate"
      >
        FREE PALESTINE 🇵🇸
      </motion.div>
    </div>
  );
};

export default MovingText;