import {FC, ReactElement} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

import {SectionsEnum} from "@/app/utils/sections";

import {handleLinkClick} from "@/app/utils/router";

import {useModal} from "@/app/context/Modal.context";
import {useUser} from "@/app/context/User.context";

import {withSectionLink} from "@/app/hocs/withSectionLink";

import {PricingModal} from "@/app/components/modals/PricingModal";

import About from "@/app/components/views/About";
import Credo from "@/app/components/views/Credo";
import DocumentationView from "@/app/components/views/Documentation";
import CreationToolView from "@/app/components/views/Services/CreationTool";

import SVG_INSIGNIA from "@/assets/images/insignia.svg";
import PNG_AR_LOGO from "@/assets/images/icons/ar-hosting-logo.png";

interface IContentProps {
    activeSection: SectionsEnum;
}

const Content: FC<IContentProps> = (props: IContentProps): ReactElement => {
    const {activeSection} = props;

    const router = useRouter();
    const modalCtx = useModal();
    const userCtx = useUser();

    // HOC
    const SectionLink = withSectionLink(router);

    // Elements
    const renderARHostingLogo = () => (
        <div
            className={'grid grid-rows-2 grid-cols-2 items-center text-left gap-x-[0.75rem] gap-y-[0.4rem] text-[1rem] leading-none'}>
            <Image
                src={PNG_AR_LOGO}
                alt={'ar hosting logo'}
                className={'row-span-2 max-h-[4.375rem] w-auto place-self-end self-center'}
            />
            <span className={'col-start-2'}>Code</span>
            <span className={'col-start-2'}>Hosting</span>
        </div>
    );

    // Content
    let Content: ReactElement | null = null;
    if (!modalCtx.isModalVisible) {
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
                        {renderARHostingLogo()}
                        <div
                            className={'flex flex-grow my-[1.87rem] max-h-[37.69rem] w-full bg-[url("../assets/images/qr.png")] bg-contain bg-no-repeat bg-center cursor-pointer'}/>
                        <button
                            className={'bg-white text-black rounded-full font-bold px-[2rem] py-[0.1rem]'}
                            onClick={() => handleLinkClick(SectionsEnum.CreationTool, router)}
                        >
                            Create
                        </button>
                    </>
                );
                break;
            case 'Creation Tool':
                Content = <CreationToolView arLogo={renderARHostingLogo()}/>
                break
            case 'Saved Codes':
                if (!userCtx.userData?.planType)
                    modalCtx.openModal(PricingModal);
                Content = <></>; // TODO
                break;
            default:
                Content = null;
        }
    }

    return (
        <div
            className={`relative flex flex-col flex-grow w-full overflow-y-scroll m-auto p-[--py] justify-center items-center bg-content bg-cover
                        bg-no-repeat text-primary text-center font-neo text-[1rem]`}>
            {Content}
        </div>
    );
}

export default Content;
