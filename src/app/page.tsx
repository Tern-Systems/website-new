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

const FADE_DURATION = 500;

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isViewChange, setViewChange] = useState<boolean>(false);
  const [isInsigniaMoved, setInsigniaMoved] = useState(false);
  const [isInsigniaMoving, setInsigniaMoving] = useState(false);
  const [message, setMessage] = useState('');
  const [minimalLanding, setMinimalLanding] = useState(true);
  const [showCredo, setShowCredo] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    if (queryParams.get('success') === 'email_verified')   {
      setActiveSection('ternkey');
      setMessage("Successfully signed up. Please log in.");
    } else if ( queryParams.get('error') === 'Internal_server_error') {
      setActiveSection('ternkey');
      setMessage('An error has occurred. Please try again');
    }
  }, []);


  const handleIconClick = (section: string) => {
    setViewChange(true);
    setTimeout(() => {
      setViewChange(false);
      setActiveSection(section);
    }, FADE_DURATION);

    if (activeSection !== null)
      return;

    setInsigniaMoving(true);
    setTimeout(() => {
      setInsigniaMoving(false);
      setInsigniaMoved(true);
    }, 0)

    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  };

  const handleInsigniaClick = () => {
    if (activeSection === null)
      return;

    setViewChange(true);
    setInsigniaMoving(true);

    setTimeout(() => {
      setViewChange(false);
      setActiveSection(null);
    }, FADE_DURATION);

    setTimeout(() => {
      setInsigniaMoved(false);
      setInsigniaMoving(false);
    }, 0)
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
        return <a href={'#'} onClick={() => handleIconClick('credo')} className="font-neo">Our Credo</a>;
      case 'contact':
        const ContactLinks: ReactElement[] = CONTACT_LINKS.map((link, index) => (
            <a key={link.svg + index} href={link.href} target={'_blank'}>
              <Image src={link.svg} alt={link.svg.toString().toLowerCase()} className={'mr-[0.75rem] w-[2.06rem] h-[2.06rem]'}/>
            </a>
        ))
        return <div className={'flex'}>{ContactLinks}</div>;
      case 'ternkey':
        return <a href={'#'} onClick={()=>handleIconClick('documentation')}>Documentation</a>;
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
          className={`${styles.insigniaContainer} text-white '] ${isInsigniaMoved ? styles.moved  : styles.return}`}
          onClick={() => handleInsigniaClick()}
        >
          {
            isInsigniaMoving ? null : (
              <Spline
                className={isInsigniaMoved ? styles.eventsDisabled : ''}
                scene={"https://prod.spline.design/DVjbSoDcq5dzLgus/scene.splinecode"}
              />
          )}
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
