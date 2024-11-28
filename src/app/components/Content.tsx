import React, {Dispatch, FC, ReactElement, SetStateAction} from "react";
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";

import {useModal} from "@/app/context/Modal.context";
import {useUser} from "@/app/context/User.context";
import {useNavigate} from "@/app/hooks/useNavigate";

import {withSectionLink} from "@/app/hocs/withSectionLink";

import {Button} from "@/app/components/form/Button";

import {Credo} from "@/app/components/views/Credo";
import {DocumentationView} from "@/app/components/views/Documentation";
import {ARCodeToolView} from "@/app/components/views/Services/ARCodeTool";
import {SubscribeView} from "@/app/components/views/Subscribe";
import {PricingView} from "@/app/components/views/Pricing";
import {Contact} from "@/app/components/views/Contact";
import {SavedARCodes} from "@/app/components/views/Services/SavedARCodes";

import SVG_INSIGNIA from "@/assets/images/insignia.svg";
import SVG_QR from "@/assets/images/qr.png";

interface IContentProps {
    activeSection: SectionsEnum;
    headingsHiddenState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const Content: FC<IContentProps> = (props: IContentProps): ReactElement => {
    const {activeSection, headingsHiddenState} = props;
    const [isHeadingsHidden, setHeadingsHidden] = headingsHiddenState;

    const [navigate, router] = useNavigate();
    const modalCtx = useModal();
    const userCtx = useUser();

    // HOC
    const SectionLink = withSectionLink(router);

    // Elements
    let Content: ReactElement | null = null;
    if (!modalCtx.hideContent) {
        switch (activeSection) {
            case 'Home':
                Content = (
                    <div className={'flex flex-col w-[58.625rem] text-left mt-[5.87rem] ml-[5.94rem] gap-[1.5rem]'}>
                        <h1 className={'text-blue w-0 text-[6.25rem]'}>All Ways</h1>
                        <span className={'text-[2.25rem] text-primary font-bold'}>We develop, manufacture, preserve, and enhance fundamental computer software and hardware.</span>
                    </div>
                );
                break;
            case 'About':
                Content = (
                    <div
                        className={'w-[58.625rem] text-left my-auto ml-[5.94rem]'}>
                        <div className={'leading-normal text-[2.25rem] font-bold'}>
                            <h1 className={'text-[3.75rem]'}>We are Tern.</h1>
                            <p className={"mb-4"}>A technology company based out of the United States.</p>
                            <p className={"mb-4"}>
                                Ushering in the era of efficient computing, equiping all legacy devices with advanced
                                microprocessors.
                            </p>
                            <p className={"mb-4"}>
                                On a mission to revolutionize computing by harnessing the power of ternary
                                microprocessors.
                            </p>
                        </div>
                        <SectionLink
                            section={SectionsEnum.Credo}
                            className={`text-primary rounded-full border-small border-control5 font-bold px-[0.91rem]
                                        h-[1.4375rem] w-fit mt-[3.31rem]`}
                        />
                    </div>
                )
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
                Content = <Contact/>;
                break;
            case 'TernKey':
                Content = (
                    <a href={"https://www.tern.ac/ternkey/"} target={'_blank'}>
                        <Image src={SVG_INSIGNIA} alt={'insignia'} className={'h-[33.6dvh] max-h-[10.42rem]'}/>
                    </a>
                );
                break;
            case 'ARCH':
                Content = (
                    <>
                        <Image src={SVG_QR} alt={'qr'}
                               className={'mb-[1.87rem] max-w-[37.69rem] cursor-pointer place-self-center'}/>
                        <Button
                            className={'bg-white text-black rounded-full font-bold px-[2rem] py-[0.1rem] w-fit place-self-center'}
                            onClick={() => navigate(SectionsEnum.ARCodeTool)}
                        >
                            Create
                        </Button>
                    </>
                );
                break;
            case 'Creation Tool':
                Content = <ARCodeToolView/>
                break
            case 'Saved Codes':
                if (!userCtx.userData?.planType)
                    navigate(SectionsEnum.Pricing);
                Content = <SavedARCodes/>;
                break;
            case 'Pricing and Plans':
                Content = <PricingView/>
                break;
            case 'Subscribe':
                if (!userCtx.isLoggedIn)
                    navigate(SectionsEnum.Home);
                setHeadingsHidden(true);
                Content = <SubscribeView/>
                break;
            default:
                Content = null;
        }
    }

    if (isHeadingsHidden)
        return <>{Content}</>

    return (
        <div
            id={'content'}
            className={`relative flex flex-col flex-grow w-full overflow-y-scroll justify-center items-center 
                        bg-content bg-cover bg-no-repeat text-primary text-center font-neo text-[1rem]
                        ${isHeadingsHidden ? '' : ''}`}
        >
            <div className={'h-full w-full flex flex-col p-[--py] pb-0'}>
                {Content}
                <span className={'pb-[1rem]'}/>
            </div>
        </div>
    );
}

export default Content;
