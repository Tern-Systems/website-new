import React, {Dispatch, FC, ReactElement, SetStateAction} from "react";
import Image from "next/image";

import {SectionsEnum} from "@/app/utils/sections";

import {useModal, useUser} from "@/app/context";
import {useNavigate} from "@/app/hooks/useNavigate";

import {withSectionLink} from "@/app/hocs";

import {Button} from "@/app/components/form";

import {FullscreenViewWrapper} from "@/app/components/FullscreenViewWrapper";

import {
    ARCodeToolView,
    BillingView,
    ContactView,
    CookieView,
    CredoView,
    DocumentationView,
    ManageSubscriptionsView,
    PricingView,
    PrivacyView,
    PurchasingInformationView,
    SavedARCodes,
    SubscribeView,
    TermsView,
    PaymentMethodToolView
} from "@/app/components/views";

import styles from '../page.module.css';

import SVG_INSIGNIA from "@/assets/images/insignia.svg";
import SVG_QR from "@/assets/images/qr.png";
import SVG_MENU_FALLBACK from "@/assets/images/icons/menu-fallback.svg";
import SVG_FULLSCREEN from "@/assets/images/icons/fullscreen.svg";
import SVG_VIEW_VIEW from "@/assets/images/icons/view-view.svg";

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
            case 'Cookies':
                Content = <CookieView/>
                break;
            case 'Privacy':
                Content = <PrivacyView/>
                break;
            case 'Terms':
                Content = <TermsView/>
                break;
            case 'Home':
                Content = (
                    <div className={`${styles.highlight} w-[58.625rem] gap-[1.5rem]`}>
                        <h1 className={'text-blue text-[6.25rem]'}>All Ways</h1>
                        <span className={'text-[2.25rem] text-primary font-bold'}>
                            We develop, manufacture, preserve, and enhance fundamental computer software and hardware.
                        </span>
                    </div>
                );
                break;
            case 'About':
                Content = (
                    <div
                        className={`${styles.highlight} w-[62.5625rem]`}>
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
                            className={`rounded-full border-small border-control5 px-[0.91rem] h-[1.4375rem] w-fit
                                        mt-[3.31rem] text-[0.875rem]`}
                        />
                    </div>
                )
                break;
            case 'Our Credo':
                Content = <CredoView/>;
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
                Content = <ContactView/>;
                break;
            case 'TernKey':
                Content = (
                    <div
                        className={`${styles.highlight} w-[33.875rem] place-items-center [&&]:mx-auto [&&]:text-center`}>
                        <span
                            className={'text-[3.75rem] font-oxygen font-bold'}>TernKey</span>
                        <a href={"https://www.tern.ac/ternkey/"} target={'_blank'}>
                            <Image src={SVG_INSIGNIA} alt={'insignia'}
                                   className={'h-[23.6dvh] max-h-[15.937rem] my-[3.15rem]'}/>
                        </a>
                        <span className={'text-[2.25rem]'}>Unlocking the potential of ternary programming.</span>
                    </div>
                );
                break;
            case 'ARCH':
                Content = (
                    <div className={'my-auto'}>
                        <Image src={SVG_QR} alt={'qr'}
                               className={'mb-[1.87rem] max-w-[37.69rem] cursor-pointer place-self-center'}/>
                        <Button
                            className={'bg-white text-black rounded-full font-bold px-[2rem] py-[0.1rem] w-fit place-self-center'}
                            onClick={() => navigate(SectionsEnum.ARCodeTool)}
                        >
                            Create
                        </Button>
                    </div>
                );
                break;
            case 'Creation Tool':
                Content = <ARCodeToolView/>
                break
            case 'Saved Codes':
                // if (!userCtx.userData?.planType) {
                //     navigate(SectionsEnum.Pricing);
                //     break;
                // }
                Content = <SavedARCodes/>;
                break;
            case 'Pricing and Plans':
                Content = <PricingView/>
                break;
            case 'Subscribe':
                // if (!userCtx.isLoggedIn) {
                //     navigate(SectionsEnum.Home);
                //     break;
                // }
                Content = (
                    <FullscreenViewWrapper
                        setHeadingsHidden={setHeadingsHidden}
                        backButtonSection={SectionsEnum.Pricing}
                    >
                        <SubscribeView/>
                    </FullscreenViewWrapper>
                )
                break;
            case 'Billing':
                // if (!userCtx.isLoggedIn || !userCtx.userData?.isPurchased) {
                //     navigate(SectionsEnum.Home);
                //     break;
                // }
                Content = <BillingView/>;
                break;
            case 'Manage Subscriptions':
                // if (!userCtx.isLoggedIn || !userCtx.userData?.isPurchased) {
                //     navigate(SectionsEnum.Home);
                //     break;
                // }
                Content = (
                    <FullscreenViewWrapper
                        setHeadingsHidden={setHeadingsHidden}
                        backButtonSection={SectionsEnum.Billing}
                    >
                        <ManageSubscriptionsView/>
                    </FullscreenViewWrapper>
                )
                break;
            case 'Payment Method Edit':
                // if (!userCtx.isLoggedIn || !userCtx.userData?.isPurchased) {
                //     navigate(SectionsEnum.Home);
                //     break;
                // }
                Content = (
                    <FullscreenViewWrapper
                        setHeadingsHidden={setHeadingsHidden}
                        backButtonSection={SectionsEnum.PurchasingInformation}
                    >
                        <PaymentMethodToolView/>
                    </FullscreenViewWrapper>
                )
                break;
            case 'User Manual':
                Content = (
                    <div
                        className={`relative flex place-self-center my-auto px-[4.31rem] w-[78.375rem] h-[49.25rem] bg-section 
                                    border-small border-control2 rounded-small text-[5rem] text-center place-items-center`}
                    >
                        <span className={'mx-auto'}>Coming soon</span>
                        <Image src={SVG_MENU_FALLBACK} alt={'menu-fallback'} className={'absolute top-[1.25rem] left-[1.25rem]'}/>
                        <Image src={SVG_FULLSCREEN} alt={'fullscreen'} className={'absolute top-[1.25rem] right-[1.25rem]'}/>
                        <Image src={SVG_VIEW_VIEW} alt={'view-view'} className={'absolute bottom-[1.25rem] right-[1.25rem]'}/>
                    </div>
                )
                break;
            case 'Purchasing Information':
                // if (!userCtx.isLoggedIn || !userCtx.userData?.isPurchased) {
                //     navigate(SectionsEnum.Home);
                //     break;
                // }
                Content = (
                    <FullscreenViewWrapper
                        setHeadingsHidden={setHeadingsHidden}
                        backButtonSection={SectionsEnum.Billing}
                    >
                        <PurchasingInformationView/>
                    </FullscreenViewWrapper>
                )
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
                <span className={'block pt-[--py]'}/>
            </div>
        </div>
    );
}

export default Content;
