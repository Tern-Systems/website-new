'use client'

import { useState } from "react";
import Image from "next/image";
import IconWithCyclingLetters from './IconWithCyclingLetters';
import styles from './page.module.css';


export default function Home() {

  const [showContact, setShowContact] = useState(false);
  const [showFooterText, setShowFooterText] = useState(true);
  const [moveInsignia, setMoveInsignia] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const handleContactClick = () => {
    console.log("Contact button clicked");

    if (moveInsignia) {
      // If the insignia is moving to the upper right, set the return state
      setIsReturning(true);

      setShowContact(false);
      setShowFooterText(true);
      setTimeout(() => {
        setMoveInsignia(false);
        setIsReturning(false);
      }, 500); // Adjust this timeout to match the transition duration
    } else {
      // If the insignia is moving back to the center
      setMoveInsignia(true);
      setShowContact(true);
      setShowFooterText(false);
      setIsReturning(false);
    }
  };




  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex relative">
        <aside className="m-[54px] flex-shrink-0 flex items-center z-10">
          <div className="text-[36px] flex flex-col gap-[40px]">
            <div className={styles.icon}>
              <span className={styles.iconSymbol}>-</span>
              <IconWithCyclingLetters text="About" />
            </div>
            <div className={styles.icon}>
              <span className={styles.iconSymbol}>0</span>
              <IconWithCyclingLetters text="TernKey" />
            </div>
            <div className={styles.icon} onClick={handleContactClick}>
              <span className={styles.iconSymbol}>+</span>
              <IconWithCyclingLetters text="Contact" />
            </div>
          </div>
        </aside>
        <div className={`${styles.insigniaContainer} ${moveInsignia ? (isReturning ? styles.return : styles.move) : ''}`}>
          <Image
            src="/images/Tern_Systems_Logo_Insignia.png"
            alt="Tern Systems Logo"
            width={100}
            height={100}
          />
        </div>
      </div>

      <div className={`${styles.contactOverlay} ${showContact ? styles.show : styles.hide}`}>
        <div className={`${styles.contactContent} ${showContact ? styles.show : styles.hide}`}>
          <p>Tern Systems</p>
          <p>New York, New York</p>
          <p>General correspondence: info@tern.ac</p>
        </div>
      </div>

      <footer className={`${styles.footer} text-[14px] text-white w-full flex justify-between px-[54px] pb-[50px]`}>
        <div className={`max-w-[500px] ${showFooterText ? styles.fadeIn : styles.fadeOut}`}>
          <p>
            Develop, manufacture, preserve, and enhance fundamental computer
            software and hardware, emphasizing universal efficiency across all
            processes.
          </p>
        </div>
        <div className={`self-end ${showFooterText ? styles.fadeIn : styles.fadeOut}`}>
          <p>New York, New York</p>
        </div>
      </footer>
    </div>
  );
}
