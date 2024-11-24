import {FC, ReactElement} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

import {SectionsEnum} from "@/app/utils/sections";

import {navigate} from "@/app/utils/router";

import {useModal} from "@/app/context/Modal.context";
import {useUser} from "@/app/context/User.context";

import {withSectionLink} from "@/app/hocs/withSectionLink";

import {PricingView} from "@/app/components/views/Pricing";

import About from "@/app/components/views/About";
import Credo from "@/app/components/views/Credo";
import DocumentationView from "@/app/components/views/Documentation";
import CreationToolView from "@/app/components/views/Services/CreationTool";

import SVG_INSIGNIA from "@/assets/images/insignia.svg";

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
    // Content
    let Content: ReactElement | null = null;
    if (!modalCtx.hideContent) {
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
            case 'ARCH':
                Content = (
                    <>
                        <div
                            className={'flex flex-grow my-[1.87rem] max-h-[37.69rem] w-full bg-[url("../assets/images/qr.png")] bg-contain bg-no-repeat bg-center cursor-pointer'}/>
                        <button
                            className={'bg-white text-black rounded-full font-bold px-[2rem] py-[0.1rem]'}
                            onClick={() => navigate(SectionsEnum.CreationTool, router)}
                        >
                            Create
                        </button>
                    </>
                );
                break;
            case 'Creation Tool':
                Content = <CreationToolView/>
                break
            case 'Saved Codes':
                if (!userCtx.userData?.planType)
                    navigate(SectionsEnum.Pricing, router);
                Content = <></>; // TODO
                break;
            case 'Pricing and Plans':
                Content = <PricingView/>
                break;
            default:
                Content = null;
        }
    }

    return (
        <div
            className={`relative flex flex-col flex-grow w-full overflow-y-scroll p-[--py] justify-center items-center bg-content bg-cover
                        bg-no-repeat text-primary text-center font-neo text-[1rem]`}>
            <div className={'h-full w-full flex flex-col'}>{Content}</div>
        </div>
    );
}

export default Content;
