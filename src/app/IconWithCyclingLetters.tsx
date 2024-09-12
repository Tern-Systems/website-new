import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

interface IconWithCyclingLettersProps {
  text: string;
  symbols: string[];
}

const IconWithCyclingLetters: React.FC<IconWithCyclingLettersProps> = ({ text, symbols }) => {
  const [displayedText, setDisplayedText] = useState<string[]>(Array(text.length).fill(''));
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating) return;

    text.split('').forEach((finalLetter, index) => {
      let currentSymbolIndex = 0;

      // Create a new interval for each letter
      const cycleInterval = setInterval(() => {
        setDisplayedText((prev) => {
          const newText = [...prev];
          newText[index] = symbols[currentSymbolIndex];
          return newText;
        });
        currentSymbolIndex = (currentSymbolIndex + 1) % symbols.length;
      }, 50); // Speed of cycling

      // Clear interval and set final letter after delay
      setTimeout(() => {
        clearInterval(cycleInterval);
        setDisplayedText((prev) => {
          const newText = [...prev];
          newText[index] = finalLetter;
          return newText;
        });
      }, (index + 1) * 300); // Delay based on position

    });

    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, text.length * 300); // Total duration

  }, [isAnimating, symbols, text]);

  return (
    <div
      className={styles.icon}
      onMouseEnter={() => setIsAnimating(true)}
    >
      <div className={styles.iconSymbol}>
        {/* Your symbol content */}
      </div>
      <div className={styles.iconText}>
        {displayedText.map((letter, index) => (
          <span
            key={index}
            className={`${styles.letter} ${styles[letter === text[index] ? 'finalLetter' : '']}`}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default IconWithCyclingLetters;

