'use client'

import React, { useEffect } from 'react';
import styles from './page.module.css';

interface IconWithCyclingLettersProps {
  text: string;
}

const IconWithCyclingLetters: React.FC<IconWithCyclingLettersProps> = ({ text }) => {
  useEffect(() => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const container = document.getElementById(`iconText-${text}`);
    const parentIcon = container?.closest(`.${styles.icon}`); // Get the parent icon div

    if (container && parentIcon) {
      // Function to create a letter cycling effect for each position
      const createLetterCycler = (finalLetter: string, delay: number) => {
        console.log('Creating letter cycler for:', finalLetter);
        const letterElement = document.createElement('div');
        letterElement.classList.add(styles.letter);

        // Create span elements for each letter of the alphabet
        letters.split('').forEach((char, index) => {
          const spanElement = document.createElement('span');
          spanElement.textContent = char;
          spanElement.classList.add(styles.letterSpan);
          letterElement.appendChild(spanElement);

          console.log(`Creating span for: ${char}`);

          // Set timeout to control the timing of each letter fade-in
          setTimeout(() => {
            spanElement.style.opacity = '1';
          }, delay + index * 40); // 40ms between letter transitions

          // Fade-out after 40ms
          setTimeout(() => {
            spanElement.style.opacity = '0';
          }, delay + index * 40 + 35); // fade out just before the next one appears
        });

        // After all alphabet transitions, show the final letter and keep it there
        setTimeout(() => {
          const finalSpan = document.createElement('span');
          finalSpan.textContent = finalLetter;
          finalSpan.classList.add(styles.finalLetter);
          letterElement.innerHTML = ''; // Clear previous spans
          letterElement.appendChild(finalSpan); // Set final letter that remains visible
          console.log(`Final letter: ${finalLetter}`);
        }, delay + 26 * 40); // Show final letter after all transitions are done

        container.appendChild(letterElement);
      };

      // Add event listener for hover
      const handleMouseEnter = () => {
        console.log('Mouse entered');
        container.innerHTML = ''; // Clear any existing content before starting
        text.split('').forEach((letter, index) => {
          createLetterCycler(letter, index * 300); // 0.3 seconds delay between each letter
        });
      };

      parentIcon.addEventListener('mouseenter', handleMouseEnter);

      // Clean up the event listener when the component unmounts
      return () => {
        parentIcon.removeEventListener('mouseenter', handleMouseEnter);
      };
    }
  }, [text]);



  return <div id={`iconText-${text}`} className={styles.iconText}></div>

};

export default IconWithCyclingLetters;
