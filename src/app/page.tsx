'use client'

import {useState, useEffect, ReactElement} from "react";
import IconWithCyclingLetters from './IconWithCyclingLetters';
import styles from './page.module.css';

import Credo from "./components/Credo";
import About from "./components/About";
import DocumentationView from "./components/DocumentationView";

import Spline from '@splinetool/react-spline';
import Image from "next/image";
import Link from "next/link";

import SVG_LINKEDIN from "@/assets/images/icons/linkedin.svg";
import SVG_GITHUB from "@/assets/images/icons/github.svg";
import SVG_DISCORD from "@/assets/images/icons/discord.svg";

const MENU_BTNS = ['About', 'TernKey', 'Contact'];
const SECTIONS_WITH_MENU = ['about', 'documentation', 'ternkey', 'contact'];

import SVG_INSIGNIA from '@/assets/images/insignia.svg'


export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [moveInsignia, setMoveInsignia] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [message, setMessage] = useState('');
  const [minimalLanding, setMinimalLanding] = useState(true);
  const [showCredo, setShowCredo] = useState(false);
  const fadeDuration = 500;

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    if (queryParams.get('success') === 'email_verified')   {
      setMoveInsignia(true);
      setActiveSection('ternkey');
      setIsReturning(false);
      setMessage("Successfully signed up. Please log in.");
    } else if ( queryParams.get('error') === 'Internal_server_error') {
      setMoveInsignia(true);
      setActiveSection('ternkey');
      setIsReturning(false);
      setMessage('An error has occurred. Please try again');
    }
  }, []);


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

      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, '', newUrl);
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
          <>
          <div className={`${styles.contactContent} ${styles.fadeIn}`}>
          {showCredo ? <Credo /> : <About />}
        </div>
          <div className="fixed bottom-1 left-0 p-12">
          <button onClick={() => setShowCredo(!showCredo)} className="text-white text-sm">
              {showCredo ? '' : 'Our Credo'}
            </button>
          </div>
          </>
        );
      case 'documentation':
        return (
          <>
            <div className={`${styles.documentationLinksContent} ${styles.contactContent} ${activeSection === 'documentation' ? styles.fadeIn : styles.fadeOut}`}>
              <a href={'#'} className={'mb-[8.88rem]'} onClick={()=> handleIconClick('TernKey Manual')}>TernKey Manual</a>
              <a href={'#'} onClick={()=> handleIconClick('GHandbook')}>G Handbook</a>
            </div>
          </>
        );
      case 'TernKey Manual':
      case 'GHandbook':
        return <DocumentationView view={activeSection}/>;
      case 'contact':
        return (
          <div className={`${styles.contactContent} ${activeSection === 'contact' ? styles.fadeIn : styles.fadeOut}`}>
            <p>Tern Systems</p>
            <p>New York, New York</p>
            <p>info@tern.ac</p>
          </div>
        );
      case 'ternkey':
        return (
            <a href={"https://www.tern.ac/ternkey/"} target={'_blank'}>
              <Image style={{width:'166.8px',height:'auto'}} src={SVG_INSIGNIA} alt={'insignia'}/>
            </a>
        );
      case 'credo':
        return (
          <div className={`${styles.contactContent} ${styles.credoSection} ${activeSection === 'credo' ? styles.fadeIn : styles.fadeOut}`}>
              <Credo />
          </div>
        );  
      default:
        return <div className={styles.contactContent} />;
    }
  };

  const MenuBtns: ReactElement[] = MENU_BTNS.map((text,idx) =>
      <IconWithCyclingLetters key={text + idx} text={text} symbols={['-', '0', '+']} symbolIdx={idx} activeSection={activeSection} handleIconClick={handleIconClick}/>);

  // Footer
  const renderFooterContent = (): ReactElement => {
    switch (activeSection) {
      case 'about':
        return <a href={'#'} onClick={() => handleIconClick('credo')}>Our Credo</a>;
      case 'contact':
        return (
            <>
              <a href="https://www.linkedin.com/company/tern-sys/" target={'_blank'}>
                <Image style={{marginRight: '20px'}} width={33} height={33} src={SVG_LINKEDIN}
                       alt={'linkedin-icon'}/>
              </a>
              <a href="https://github.com/Tern-Systems" target={'_blank'}>
                <Image style={{marginRight: '20px'}} width={33} height={33} src={SVG_GITHUB}
                       alt={'github-icon'}/>
              </a>
              <a href="https://discord.gg/ZkZZmm8k4f" target={'_blank'}>
                <Image style={{marginRight: '20px'}} width={33} height={33} src={SVG_DISCORD}
                       alt={'discord-icon'}/>
              </a>
            </>
        );
      case 'ternkey':
        return <p onClick={()=>handleIconClick('documentation')}>Documentation</p>;
      default:
        return (
            <p>
              Develop, manufacture, preserve, and enhance fundamental computer
              software and hardware, emphasizing universal efficiency across all
              processes.
            </p>
        );
    }
  };
  const footerAnimationStyle = activeSection === null || ['about', 'contact', 'ternkey'].includes(activeSection) ? styles.fadeIn : styles.fadeOut;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex relative">
        <aside className="relative m-[2.06rem] flex-shrink-0 flex z-10">
          <div className={`text-[36px] flex flex-col gap-[40px] ${minimalLanding ? "hidden" : "flex"}`}>
            {activeSection === null || SECTIONS_WITH_MENU.includes(activeSection)? MenuBtns : null}
          </div>
        </aside>
        <div className={`absolute top-[2.06rem] right-[2.06rem] text-white text-[14px]  ${activeSection ? styles.fadeOut : styles.fadeIn} ${minimalLanding ? "hidden" : "flex"}`}>
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
      <footer
          className={`${styles.footer} text-[14px] text-white w-full flex ${footerAnimationStyle} ${minimalLanding ? "justify-center" : "justify-between"} px-[54px] pb-[50px]`}>
        <div
            className={`max-w-[500px] ${minimalLanding ? "hidden" : "flex"}`}>
          {renderFooterContent()}
        </div>
        <div
            className={`self-end flex items-center space-x-4 ${minimalLanding ? "hidden" : "flex"}`}>
          <a href="#" onClick={() => {handleIconClick('cookies')}}
          >
            Cookies
          </a>
          <span className={styles.bullet}>&bull;</span>
          <a href="#" onClick={() => {handleIconClick('cookies')}}
          >
            Privacy
          </a>
          <span className={styles.bullet}>&bull;</span>
          <a href="#" onClick={() => {handleIconClick('cookies')}}
          >
            Terms
          </a>
          
        </div>
        <a onClick={() => setMinimalLanding(false)}
           className={`${minimalLanding ? "flex" : "hidden"} cursor-pointer`}>Tern Systems</a>
      </footer>
    </div>
  );
}
