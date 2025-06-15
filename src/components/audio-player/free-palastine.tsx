import { motion, type Variants } from 'framer-motion';
import { useScreen } from '../../context/ScreenContext';
import './free-palastine.css';

const MovingText = () => {
  const { isScreenOn } = useScreen();

  const textVariants:Variants = {
    initial: { x: '-100%' },
    animate: {
      x: '140%',
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 5,
          ease: 'linear'
        }
      }
    }
  };

  return (
    <div className={`${!isScreenOn && 'screen-off'} bg-screens`}>
      <div className='moving-text-container'>
        {isScreenOn && <motion.span
          className="moving-text"
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          FREE PALESTINE 🇵🇸
        </motion.span> }
      </div>
    </div>
  );
};

export default MovingText;