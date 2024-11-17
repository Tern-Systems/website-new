'use client'

import {useState, useEffect, ReactElement} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import Spline from '@splinetool/react-spline';
import Image from "next/image";

import {withSectionLink} from "@/app/hocs/withSectionLink";

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
    'Start' = 'Start', Home = 'Home',
    About = 'About', Credo = 'Our Credo',
    TernKey = 'TernKey', Documentation = 'Documentation', TernKeyManual = 'TernKey Manual', GHandbook = 'G Handbook',
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

  /// Handlers /////
  const handleLinkClick = (section: SectionsEnum) => {
    router.replace(`/?section=${section}`, undefined, {shallow: true});
  };
  const handleInsigniaClick = () => {
    router.replace(`/?section=${SectionsEnum.Home}`, undefined, {shallow: true});
  };

  // HOC
    const SectionLink = withSectionLink(handleLinkClick);

    /// Effects /////
    const section = params.get('section') as SectionsEnum;
    useEffect(() => {
        if (!Object.values(SectionsEnum).includes(section))
            return;

        setViewChange(true);
        if (section !== null)
            setInsigniaMoved(!INIT_INSIGNIA_SECTIONS.includes(section));
        setTimeout(() => {
            setActiveSection(section);
            setMinimalLanding(section === 'Start')
            setViewChange(false);
        }, FADE_DURATION);
    }, [section]);

  /// Render /////
  // Content
  const renderContent = () => {
      let Title: ReactElement | null;
      let Content: ReactElement | null;

      // Title
      switch (activeSection) {
          case 'About':
          case 'Our Credo':
          case 'TernKey':
          case 'Documentation':
          case 'Contact':
              Title = <div className={'text-title font-oxygen text-[2.25rem] leading-none capitalize sm:mb-[--py]'}>{activeSection}</div>;
              break;
          default:
              Title = null;
      }

      // Content
    switch (activeSection) {
       case 'About':
            Content = (
                <div className={styles.content}>
                    <About/>
                </div>
            );
            break;
      case 'Our Credo':
            Content = (
                <div className={styles.content}>
                    <Credo/>
                </div>
            );
            break;
      case 'Documentation':
          Content = (
              <div className={`${styles.content} font-oxygen text-[1.3125rem]`}>
                  <SectionLink section={SectionsEnum.TernKeyManual} className={'mb-[8.88rem]'} />
                  <SectionLink section={SectionsEnum.GHandbook} />
              </div>
          );
          break;
      case 'TernKey Manual':
      case 'G Handbook':
            Content = <DocumentationView view={activeSection}/>;
            break;
      case 'Contact':
          Content = (
              <div className={styles.content}>
                  <p>Tern Systems</p>
                  <p>New York, New York</p>
                  <p className={'mt-[1rem]'}>info@tern.ac</p>
              </div>
          );
          break;
       case 'TernKey':
          Content = (
              <div className={styles.content}>
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
        <div className={`flex flex-col flex-grow max-h-full ${isViewChange ? styles.fadeOut : styles.fadeIn}`}>
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
          SectionContent = <SectionLink section={SectionsEnum.Credo} className={'font-neo'}>Our Credo</SectionLink>
          break;
      case 'Contact':
          const ContactLinks: ReactElement[] = CONTACT_LINKS.map((link, index) => (
              <a key={link.svg + index} href={link.href} target={'_blank'}>
                  <Image
                      src={link.svg}
                      alt={link.svg.toString().toLowerCase()}
                      className={'mr-[0.75rem] w-[1.8125rem] h-[1.8125rem]'}
                  />
              </a>
          ))
          SectionContent = <div className={'flex'}>{ContactLinks}</div>;
          break;
      case 'TernKey':
          SectionContent = <SectionLink section={SectionsEnum.Documentation} />
          break;
      case 'Home':
          const FooterLinks: ReactElement[] = FOOTER_LINKS.map((link: SectionsEnum, index) => {
              let Delim: ReactElement | null = null;
              if (index !== FOOTER_LINKS.length - 1)
                  Delim = <span className={'cursor-default'}>&nbsp;&bull;&nbsp;</span>;

              return (
                <span key={link + index}>
                  <SectionLink section={link} />
                  {Delim}
                </span>
              );
          })
          SectionContent = (
              <div className={'max-w-[575px]'}>
                  <div
                      className={`mb-[2.69rem] sm:landscape:place-self-Home sm:landscape:absolute sm:landscape:top-[--px] sm:landscape:left-[--px]`}>
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
        <p className={`absolute place-self-center sm:landscape:place-self-end lg:bottom-[--py] lg:place-self-end`}>
            New York, New York
        </p>
    );
    const HomeLink = (
        <SectionLink section={SectionsEnum.Home} className={`text-text-primary text-[1.3125rem] cursor-pointer`}>
            Tern Systems
        </SectionLink>
    );

     return (
         <footer
             className={`flex w-full justify-center text-center text-[1rem] font-neo text-primary ${!minimalLanding ? 'lg:justify-start lg:text-left' : ''}`}
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
            className={`
                absolute z-10 size-[11.5rem] bg-transparent
                ${state ? 'hidden' : ''}
                ${isInsigniaMoved ? 'after:absolute after:top-0 after:w-full after:h-full' : ''}
                ${isInsigniaMoved ? 'animate-[insignia_0.3s_ease-in-out_forwards]' : 'animate-[insignia_0.3s_ease-in-out_forwards_reverse]'}
            `}
            onClick={() => handleInsigniaClick()}
        >
            <Spline scene={"https://prod.spline.design/DVjbSoDcq5dzLgus/scene.splinecode"}/>
        </div>
    ));

  return (
     <div className="min-h-screen h-screen flex flex-col px-[--px] py-[--py] relative">
         {Insignia}
         {renderContent()}
         {renderFooter()}
    </div>
  );
}

export {SectionsEnum}
