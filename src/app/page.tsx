'use client'

import { useState } from "react";
import IconWithCyclingLetters from './IconWithCyclingLetters';
import styles from './page.module.css';
import PrivacyParagraph from "./components/PrivacyParagraph";
import TermsParagraph from "./components/TermsParagraph";
import Cookies from "./components/Cookies";
import Spline from '@splinetool/react-spline';
import TernKeyModal from './components/ternKeyModal/TernKeyModal'

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [moveInsignia, setMoveInsignia] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const fadeDuration = 500; 

  const handleIconClick = (section: string) => {
    if (activeSection === section) {
 
      setMoveInsignia(true);
      setIsReturning(false);


      setTimeout(() => {
        setActiveSection(null);
        setMoveInsignia(false);
      }, fadeDuration); 
    } else {

      setMoveInsignia(true);
      setActiveSection(section);
      setIsReturning(false);
    }
  };

  const handleInsigniaClick = () => {
    if (activeSection !== null) {
      setMoveInsignia(true);
      setIsReturning(false);

      setTimeout(() => {
        setActiveSection(null);
        setMoveInsignia(false);
      }, fadeDuration); 

      setTimeout(() => {
        setIsReturning(true);
      }, fadeDuration);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return (
          <div className={`${styles.contactContent} ${activeSection === 'about' ? styles.fadeIn : styles.fadeOut}`}>
            <p>We are a technology company based out of the United States.</p>
            <p>Vision: Ushering in the era of efficient computing, equipping all legacy devices with advanced microprocessors.</p>
            <p>Mission: Revolutionize computing by harnessing the power of ternary microprocessors.</p>
            <p>Purpose: Develop, manufacture, preserve, and enhance fundamental computer software and hardware, emphasizing universal efficiency across all processes.</p>
          </div>
        );
      case 'contact':
        return (
          <div className={`${styles.contactContent} ${activeSection === 'contact' ? styles.fadeIn : styles.fadeOut}`}>
            <p>Tern Systems</p>
            <p>New York, New York</p>
            <p>General correspondence: info@tern.ac</p>
          </div>
        );
      case 'ternkey':
        return (
          <div className={`${styles.contactContent} ${activeSection === 'ternkey' ? styles.fadeIn : styles.fadeOut}`}>
            <TernKeyModal isOpen={activeSection === 'ternkey'} onClose={() => handleIconClick('ternkey')} />
          </div>
        );
      case 'cookies':
        return (
          <div className={`${styles.contactContent}  ${styles.cookieSection} ${activeSection === 'cookies' ? styles.fadeIn : styles.fadeOut}`}>
            <Cookies />
          </div>
        );
      case 'privacy':
        return (
          <div className={`${styles.contactContent} ${styles.privacySection} ${activeSection === 'privacy' ? styles.fadeIn : styles.fadeOut}`}>
            <PrivacyParagraph />
          </div>
        );
      case 'terms':
        return (
          <div className={`${styles.contactContent} ${styles.termSection} ${activeSection === 'terms' ? styles.fadeIn : styles.fadeOut}`}>
            <TermsParagraph />
          </div>
        );
      default:
        return <div className={styles.contactContent} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex relative">
        <aside className="m-[54px] flex-shrink-0 flex z-10">
          <div className="text-[36px] flex flex-col gap-[40px]">
            <div className={styles.icon} onClick={() => handleIconClick('about')}>
              <span className={styles.iconSymbol}>-</span>
              <IconWithCyclingLetters text="About" symbols={['-', '0', '+']} />
            </div>
            <div className={styles.icon} onClick={() => handleIconClick('ternkey')}>
              <span className={styles.iconSymbol}>0</span>
              <IconWithCyclingLetters text="TernKey" symbols={['-', '0', '+']} />
            </div>
            <div className={styles.icon} onClick={() => handleIconClick('contact')}>
              <span className={styles.iconSymbol}>+</span>
              <IconWithCyclingLetters text="Contact" symbols={['-', '0', '+']} />
            </div>
          </div>
        </aside>
        <div className={`absolute right-[54px] top-[50px] text-white text-[14px]  ${activeSection ? styles.fadeOut : styles.fadeIn}`}>
          <p>New York, New York</p>
        </div>
        <div 
          className={`${styles.insigniaContainer} ${moveInsignia ? (isReturning ? styles.return : styles.move) : ''} ${activeSection !== null ? styles.pointer : ''}`} 
          onClick={handleInsigniaClick}
        >
          <Spline 
            scene="https://prod.spline.design/DVjbSoDcq5dzLgus/scene.splinecode" 
          />
        </div>
      </div>

      <div className={`${styles.contactOverlay} ${activeSection ? styles.show : styles.hide}`}>
        {renderContent()}
      </div>
      <footer className={`${styles.footer} text-[14px] text-white w-full flex justify-between px-[54px] pb-[50px]`}>
        <div className={`max-w-[500px] ${activeSection ? styles.fadeOut : styles.fadeIn}`}>
          <p>
            Develop, manufacture, preserve, and enhance fundamental computer
            software and hardware, emphasizing universal efficiency across all
            processes.
          </p>
        </div>
        <div className={`self-end flex items-center space-x-4 ${activeSection ? styles.fadeOut : styles.fadeIn}`}>
          <a
            href="#"
            onClick={(e) => {
              if (!activeSection) handleIconClick('cookies');
              else e.preventDefault();
            }}
            className={activeSection ? styles.disabled : ''}
          >
            Cookies
          </a>
          <span className={styles.bullet}>&bull;</span>
          <a
            href="#"
            onClick={(e) => {
              if (!activeSection) handleIconClick('privacy');
              else e.preventDefault();
            }}
            className={activeSection ? styles.disabled : ''}
          >
            Privacy
          </a>
          <span className={styles.bullet}>&bull;</span>
          <a
            href="#"
            onClick={(e) => {
              if (!activeSection) handleIconClick('terms');
              else e.preventDefault();
            }}
            className={activeSection ? styles.disabled : ''}
          >
            Terms
          </a>
        </div>
      </footer>
    </div>
  );
}
