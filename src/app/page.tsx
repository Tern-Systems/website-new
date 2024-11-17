'use client'

import {useState, useEffect, ReactElement} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import Spline from '@splinetool/react-spline';
import Image from "next/image";

import Credo from "./components/Credo";
import About from "./components/About";
import DocumentationView from "./components/DocumentationView";

import SVG_LINKEDIN from "@/assets/images/icons/linkedin.svg";
import SVG_GITHUB from "@/assets/images/icons/github.svg";
import SVG_DISCORD from "@/assets/images/icons/discord.svg";
import SVG_INSIGNIA from '@/assets/images/insignia.svg'

import styles from './page.module.css';

/// Types ///////////
enum SectionsEnum {
    Start = 'Start', Home = 'Home',
    About = 'About', Credo = 'Credo',
    TernKey = 'TernKey', Documentation = 'Documentation', TernKeyManual = 'TernKey Manual', GHandbook = 'GHandbook',
    Contact = 'Contact',
}

/// Constants ///////////
const FADE_DURATION = 300;
const INIT_INSIGNIA_SECTIONS: SectionsEnum[] = [SectionsEnum.Start, SectionsEnum.Home];
const FOOTER_LINKS: SectionsEnum[] = [SectionsEnum.About, SectionsEnum.TernKey, SectionsEnum.Contact];
const CONTACT_LINKS: { svg: string, href: string }[] = [
    {svg: SVG_LINKEDIN, href: 'https://www.linkedin.com/company/tern-sys/'},
    {svg: SVG_GITHUB, href: 'https://github.com/Tern-Systems'},
    {svg: SVG_DISCORD, href: 'https://discord.gg/ZkZZmm8k4f'},
]

/// Home ///////////
export default function Home() {
  const router = useRouter();
  const params = useSearchParams()

  const [activeSection, setActiveSection] = useState<SectionsEnum>(SectionsEnum.Start);
  const [isViewChange, setViewChange] = useState<boolean>(false);
  const [isInsigniaMoved, setInsigniaMoved] = useState(false);
  const [minimalLanding, setMinimalLanding] = useState(true);

  /// Effects /////
  const section = params.get('section') as SectionsEnum.Home;
  useEffect(() => {
    setViewChange(true);
  if (section !== null)
      setInsigniaMoved(!INIT_INSIGNIA_SECTIONS.includes(section));
    setTimeout(() => {
      setActiveSection(section);
      setMinimalLanding(section === null)
      setViewChange(false);
    }, FADE_DURATION);
  }, [section]);

  /// Handlers /////
  const handleIconClick = (section: SectionsEnum) => {
    router.replace(`/?section=${section}`, undefined, {shallow: true});
  };
  const handleInsigniaClick = () => {
    router.replace(`/?section=Home`, undefined, {shallow: true});
  };

  /// Render /////
  // Content
  const renderContent = () => {
      let Title: ReactElement | null;
      let Content: ReactElement | null;

      // Title
      switch (activeSection) {
          case 'About':
          case 'Credo':
          case 'TernKey':
          case 'Documentation':
          case 'Contact':
              Title = <div className={styles.viewTitle}>{activeSection}</div>;
              break;
          default:
              Title = null;
      }

      // Content
    switch (activeSection) {
       case 'About':
            Content = (
                <div className={styles.contactContent}>
                    <About/>
                </div>
            );
            break;
      case 'Credo':
            Content = (
                <div className={styles.contactContent}>
                    <Credo/>
                </div>
            );
            break;
      case 'Documentation':
          Content = (
              <div className={`${styles.documentationLinksContent} ${styles.contactContent}`}>
                  <a href={'#'} className={'mb-[8.88rem]'} onClick={() => handleIconClick( SectionsEnum.TernKeyManual)}>
                      TernKey Manual
                  </a>
                  <a href={'#'} onClick={() => handleIconClick(SectionsEnum.GHandbook)}>G Handbook</a>
              </div>
          );
          break;
      case 'TernKey Manual':
      case 'GHandbook':
            Content = <DocumentationView view={activeSection}/>;
            break;
      case 'Contact':
          Content = (
              <div className={styles.contactContent}>
                  <p>Tern Systems</p>
                  <p>New York, New York</p>
                  <p className={'mt-[1rem]'}>info@tern.ac</p>
              </div>
          );
          break;
       case 'TernKey':
          Content = (
              <div className={styles.contactContent}>
                  <a href={"https://www.tern.ac/ternkey/"} target={'_blank'}>
                      <Image style={{width: '166.8px', height: 'auto'}} src={SVG_INSIGNIA} alt={'insignia'}/>
                  </a>
              </div>
          );
          break;
      default:
        Content = null;
    }

    return (
        <div className={`${styles.contactOverlay} max-h-full ${isViewChange ? styles.fadeOut : styles.fadeIn}`}>
            {Title}
            {Content}
        </div>
    );
  };

  // Footer
  const renderFooter = (): ReactElement => {
      let SectionContent: ReactElement | null;

    switch (activeSection) {
      case 'About':
          SectionContent = <a href={'#'} onClick={() => handleIconClick(SectionsEnum.Credo)} className="font-neo">Our Credo</a>;
          break;
      case 'Contact':
          const ContactLinks: ReactElement[] = CONTACT_LINKS.map((link, index) => (
              <a key={link.svg + index} href={link.href} target={'_blank'}>
                  <Image src={link.svg} alt={link.svg.toString().toLowerCase()}
                         className={'mr-[0.75rem] w-[1.8125rem] h-[1.8125rem]'}/>
              </a>
          ))
          SectionContent = <div className={'flex'}>{ContactLinks}</div>;
          break;
      case 'TernKey':
          SectionContent = <a href={'#'} onClick={() => handleIconClick(SectionsEnum.Documentation)}>Documentation</a>;
          break;
      case 'Home':
          const FooterLinks: ReactElement[] = FOOTER_LINKS.map((link: SectionsEnum, index) => {
              let Delim: ReactElement | null = null;
              if (index !== FOOTER_LINKS.length - 1)
                  Delim = <span className={styles.bullet}>&nbsp;&bull;&nbsp;</span>;

              return (
                <span key={link + index}>
                  <a href={"#"} onClick={() => handleIconClick(link)}>{link}</a>
                  {Delim}
                </span>
              );
          })
          SectionContent = (
              <div className={'max-w-[575px]'}>
                  <div
                      className={`mb-[2.69rem] sm:landscape:place-self-Home sm:landscape:absolute sm:landscape:top-[2.06rem] sm:landscape:left-[2rem]`}>
                      {FooterLinks}
                  </div>
                  <p>
                      Tern Systems is a technology company that develops, manufactures, preserves, and enhances
                      fundamental computer software and hardware.
                  </p>
              </div>
          );
          break;
        default:
            SectionContent = null;
    }

    // Misc
    const LocationTitle = (
        <p className={`absolute place-self-center sm:landscape:place-self-end ${styles.footer} lg:bottom-[2.06rem] lg:place-self-end`}>
            New York, New York
        </p>
    );
    const HomeLink = (
        <a href={'#'} className={`${styles.linkMinimalistic} cursor-pointer`} onClick={() => handleIconClick(SectionsEnum.Home)}>
            Tern Systems
        </a>
    );

     return (
         <footer
             className={`flex w-full justify-center text-center ${styles.footer} ${!minimalLanding ? 'lg:justify-Home lg:text-left' : ''}`}
         >
             {minimalLanding ? HomeLink : SectionContent}
             {activeSection || minimalLanding ? null : LocationTitle}
         </footer>
     );
  };

    // Insignia
    // 2 pre-rendered insignias for moving without flickering
    const Insignia: ReactElement[] = [isInsigniaMoved, !isInsigniaMoved].map((state, index) => (
        <div
            key={index}
            className={`${styles.insigniaContainer} text-white ${state ? 'hidden' : ''} ${isInsigniaMoved ? styles.moved : styles.return}`}
            onClick={() => handleInsigniaClick()}
        >
            <Spline scene={"https://prod.spline.design/DVjbSoDcq5dzLgus/scene.splinecode"}/>
        </div>
    ));

  return (
     <div className="min-h-screen h-screen flex flex-col px-[2rem] py-[2.06rem] relative">
         {Insignia}
         {renderContent()}
         {renderFooter()}
    </div>
  );
}
