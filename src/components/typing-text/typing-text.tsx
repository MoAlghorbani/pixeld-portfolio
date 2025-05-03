import { useEffect, useState, CSSProperties } from "react";
import './typing-text.css';

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  onComplete?: () => void;
  animate?: boolean;
}

export function TypingAnimation({
  text,
  duration = 150,
  className,
  style,
  onComplete,
  animate = true,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [i, setI] = useState<number>(0);

  useEffect(() => {
    if (animate) {
      setDisplayedText(text);
      onComplete?.();
      return;
    }

    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
        onComplete?.();
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [duration, i, text, onComplete, animate]);

  return (
    <span className={`typing-text ${className || ''} `} style={style}>
      {displayedText ? displayedText : text}
    </span>
  );
}