import {FC, ReactElement} from "react";
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";

import {withSectionLink} from "@/app/hocs/withSectionLink";

import About from "@/app/components/About";
import Credo from "@/app/components/Credo";
import DocumentationView from "@/app/components/DocumentationView";

import SVG_INSIGNIA from "@/assets/images/insignia.svg";

interface IContentProps {
    activeSection: SectionsEnum;
    handleLinkClick: (section: SectionsEnum) => void;
}

const Content: FC<IContentProps> = (props: IContentProps): ReactElement => {
    const {activeSection, handleLinkClick} = props;

    // HOC
    const SectionLink = withSectionLink(handleLinkClick);

    // Elements
    let Title: ReactElement | null;
    let Content: ReactElement | null;

    // Title
    switch (activeSection) {
        case 'About':
        case 'Our Credo':
        case 'TernKey':
        case 'Documentation':
        case 'Contact':
            Title = <div
                className={'pb-[--py] text-title font-oxygen text-[2.25rem] leading-none capitalize'}>{activeSection}</div>;
            break;
        default:
            Title = null;
    }

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
        default:
            Content = null;
    }

    if (Title) {
        Content = (
            <div
                className={`overflow-y-scroll m-auto content-center text-primary text-center font-neo text-[1rem]`}>
                {Content}
            </div>
        );
    }

    return (
        <>
            {Title}
            {Content}
        </>
    );
}

export default Content;
