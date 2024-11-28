import {Dispatch, FC, ReactElement, SetStateAction} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

import {SectionsEnum} from "@/app/utils/sections";

import {useModal} from "@/app/context/Modal.context";
import {useUser} from "@/app/context/User.context";

import {withSectionLink} from "@/app/hocs/withSectionLink";

import About from "@/app/components/views/About";
import Credo from "@/app/components/views/Credo";
import DocumentationView from "@/app/components/views/Documentation";
import CreationToolView from "@/app/components/views/Services/CreationTool";
import {SubscribeView} from "@/app/components/views/Subscribe";
import {PricingView} from "@/app/components/views/Pricing";

import SVG_INSIGNIA from "@/assets/images/insignia.svg";
import {Button} from "@/app/components/form/Button";
import {useNavigate} from "@/app/hooks/useNavigate";

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
            case 'About':
                Content = <About/>;
                break;
            case 'Home':
                Content = (
                    <div className={'flex flex-col w-[58.625rem] text-left mt-[12.87rem] ml-[5.94rem] gap-[1.5rem]'}>
                        <span className={'text-blue w-0 text-[6.25rem]'}>All Ways</span>
                        <span className={'text-[2.25rem] text-primary font-bold'}>We develop, manufacture, preserve, and enhance fundamental computer software and hardware.</span>
                    </div>
                );
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
            case 'ARCH':
                Content = (
                    <>
                        <div
                            className={'flex flex-grow my-[1.87rem] max-h-[37.69rem] w-full bg-[url("../assets/images/qr.png")] bg-contain bg-no-repeat bg-center cursor-pointer'}/>
                        <Button
                            className={'bg-white text-black rounded-full font-bold px-[2rem] py-[0.1rem] w-fit place-self-center'}
                            onClick={() => navigate(SectionsEnum.CreationTool)}
                        >
                            Create
                        </Button>
                    </>
                );
                break;
            case 'Creation Tool':
                Content = <CreationToolView/>
                break
            case 'Saved Codes':
                if (!userCtx.userData?.planType)
                    navigate(SectionsEnum.Pricing);
                Content = <></>; // TODO
                break;
            case 'Pricing and Plans':
                Content = <PricingView/>
                break;
            case 'Subscribe':
                // if (!userCtx.isLoggedIn)
                //     navigate(SectionsEnum.Home, router);
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
            className={`relative flex flex-col flex-grow w-full p-[--py] overflow-y-scroll justify-center items-center 
                        bg-content bg-cover bg-no-repeat text-primary text-center font-neo text-[1rem]
                        ${isHeadingsHidden ? '' : ''}`}
        >
            <div className={'h-full w-full flex flex-col'}>{Content}</div>
        </div>
    );
}

export default Content;
