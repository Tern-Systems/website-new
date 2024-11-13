'use client'

import {useState, useEffect, ReactElement} from "react";
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

const FOOTER_LINKS = ['About', 'TernKey', 'Contact'];
const CONTACT_LINKS :{svg:string, href: string}[]= [
    {svg: SVG_LINKEDIN, href:'https://www.linkedin.com/company/tern-sys/'},
    {svg: SVG_GITHUB, href:'https://github.com/Tern-Systems'},
    {svg: SVG_DISCORD, href:'https://discord.gg/ZkZZmm8k4f'},
]

import SVG_INSIGNIA from '@/assets/images/insignia.svg'


export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isViewChange, setViewChange] = useState<boolean>(false);
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
      setViewChange(true);
      setTimeout(() => {
          setViewChange(false);
          setActiveSection(section);
      }, fadeDuration);

      setMoveInsignia(true);
      setIsReturning(false);

      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, '', newUrl);
  };

  const handleInsigniaClick = () => {
    if (activeSection !== null) {
      setViewChange(true);
      setMoveInsignia(true);
      setIsReturning(false);

      setTimeout(() => {
        setViewChange(false);
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
          </>
        );
      case 'documentation':
        return (
          <>
            <div className={styles.viewTitle}>Documentation</div>
            <div className={`${styles.documentationLinksContent} ${styles.contactContent}`}>
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
            <>
              <div className={styles.viewTitle}>Contact</div>
              <div className={styles.contactContent}>
                <p>Tern Systems</p>
                <p>New York, New York</p>
                <p>info@tern.ac</p>
              </div>
            </>
        );
      case 'ternkey':
        return (
            <>
              <div className={styles.viewTitle}>TernKey</div>
              <a href={"https://www.tern.ac/ternkey/"} target={'_blank'}>
                <Image style={{width:'166.8px',height:'auto'}} src={SVG_INSIGNIA} alt={'insignia'}/>
              </a>
            </>
        );
      default:
        return <div className={styles.contactContent} />;
    }
  };

  // Footer
  const renderFooterContent = (): ReactElement => {
    switch (activeSection) {
      case 'about':
        return <a href={'#'} onClick={() => handleIconClick('credo')}className="font-neo">Our Credo</a>;
      case 'contact':
        const ContactLinks: ReactElement[] = CONTACT_LINKS.map((link, index) => (
            <a key={link.svg + index} href={link.href} target={'_blank'}>
              <Image src={link.svg} alt={link.svg.toString().toLowerCase()} className={'mr-[0.75rem] w-[2.06rem] h-[2.06rem]'}/>
            </a>
        ))
        return <div className={'flex'}>{ContactLinks}</div>;
      case 'ternkey':
        return <p onClick={()=>handleIconClick('documentation')}>Documentation</p>;
      case null:
        const FooterLinks: ReactElement[] = FOOTER_LINKS.map((link:string, index)=> {
          let DelimElem: ReactElement | null = null;
          if (index !== FOOTER_LINKS.length - 1)
            DelimElem = <span className={styles.bullet}>&nbsp;&bull;&nbsp;</span>;

          return (
              <>
                <a href="#" onClick={() => {handleIconClick(link.toLowerCase())}}>{link}</a>
                {DelimElem}
              </>
          );
        })
        return (
            <>
              <div className={'max-w-[575px]'}>
                <div className={`mb-[2.69rem]`}>
                  {FooterLinks}
                </div>
                <p>
                  Tern Systems is a technology company that develops, manufactures, preserves, and enhances fundamental computer software and hardware.
                </p>
              </div>
               <p className={'place-self-end'}>New York, New York</p>
            </>
        );
      default: return <></>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex relative">
        <div
          className={`${styles.insigniaContainer} ${moveInsignia ? (isReturning ? styles.return : styles.move) : ''} ${activeSection !== null ? styles.pointer : ''}`}
          onClick={handleInsigniaClick}
        >
          <Spline
            scene="https://prod.spline.design/DVjbSoDcq5dzLgus/scene.splinecode"
          />
        </div>
      </div>
      <div className={`${styles.contactOverlay} px-[2rem] py-[2.06rem] ${isViewChange ? styles.fadeOut : styles.fadeIn}`}>
        {renderContent()}
      </div>
      <footer className={`${styles.footer} ${minimalLanding ? "justify-center" : "justify-between"}`}>
        {
          minimalLanding
            ? (
                <a href={'#'} className={`${styles.linkMinimalistic} cursor-pointer`} onClick={() => setMinimalLanding(false)}>
                    Tern Systems
                </a>
            )
            : renderFooterContent()
        }
      </footer>
    </div>
  );
}
