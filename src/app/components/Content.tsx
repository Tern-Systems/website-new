import {FC, ReactElement} from "react";
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";

import {withSectionLink} from "@/app/hocs/withSectionLink";

import About from "@/app/components/About";
import Credo from "@/app/components/Credo";
import DocumentationView from "@/app/components/DocumentationView";

import SVG_INSIGNIA from "@/assets/images/insignia.svg";
import PNG_AR_LOGO from "@/assets/images/icons/ar-hosting-logo.png";
import PNG_QR from "@/assets/images/qr.png";

interface IContentProps {
    activeSection: SectionsEnum;
    handleLinkClick: (section: SectionsEnum) => void;
}

const Content: FC<IContentProps> = (props: IContentProps): ReactElement => {
    const {activeSection, handleLinkClick} = props;

    // HOC
    const SectionLink = withSectionLink(handleLinkClick);

    // Elements
    let Content: ReactElement | null;

    // Content
    switch (activeSection) {
        case 'About':
            Content = <About/>;
            break;
        case 'Our Credo':
            Content = <Credo/>;
            break;
        case 'Documentation':
            Content = (
                <>
                    <SectionLink section={SectionsEnum.TernKey}
                                 className={'block mb-[8.88rem] sm:landscape:mb-[4.44em] font-oxygen text-primary'}/>
                    <SectionLink section={SectionsEnum.GHandbook} className={'block font-oxygen text-primary'}/>
                </>
            );
            break;
        case 'TernKey Manual':
        case 'G Handbook':
            Content = <DocumentationView view={activeSection}/>;
            break;
        case 'Contact':
            Content = (
                <>
                    <p>Tern Systems</p>
                    <p>New York, New York</p>
                    <p className={'mt-[1rem]'}>info@tern.ac</p>
                </>
            );
            break;
        case 'TernKey':
            Content = (
                <a href={"https://www.tern.ac/ternkey/"} target={'_blank'}>
                    <Image src={SVG_INSIGNIA} alt={'insignia'} className={'h-[33.6dvh] max-h-[10.42rem]'}/>
                </a>
            );
            break;
        case 'AR Code Hosting':
            Content = (
                <>
                    <div className={'grid grid-rows-2 grid-cols-2 items-center text-left gap-x-[0.75rem] mb-[1.87rem]'}>
                        <Image src={PNG_AR_LOGO} alt={'ar hosting logo'} className={'row-span-2 h-[4.375dvh] max-h-[10.42rem]'}/>
                        <span className={'col-start-2'}>Code</span>
                        <span className={'col-start-2'}>Hosting</span>
                    </div>
                    <Image src={PNG_QR} alt={'qr'} className={'size-[37.69dvh] cursor-pointer'}/>
                </>
            );
            break;
        default:
            Content = null;
    }

    return (
        <div
            className={`flex flex-col flex-grow w-full overflow-y-scroll m-auto justify-center items-center bg-content bg-cover
                        bg-no-repeat text-primary text-center font-neo text-[1rem]`}>
            {Content}
        </div>
    );
}

export default Content;
