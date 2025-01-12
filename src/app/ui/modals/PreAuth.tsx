import {FC, useEffect} from "react";
import cn from "classnames";

import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals/Base";
import {AuthModal} from "@/app/ui/modals/Auth";
import {Button} from "@/app/ui/form";
import {useBreakpointCheck} from "@/app/hooks";


const PreAuthModal: FC = () => {
    const modalCtx = useModal();
    const isSmScreen = useBreakpointCheck();

    useEffect(() => {
        if (isSmScreen === false)
            modalCtx.closeModal();
        // eslint-disable-next-line
    }, [isSmScreen]);


    return (
        <BaseModal
            smScreenOnly
            title={'Tern Account'}
            classNameTitle={'justify-self-start text-heading   sm:landscape:ml-0'}
            classNameContent={cn(
                'w-full items-start mx-auto px-[--p-content-xs] py-[--p-content] place-items-center text-basic',
                'max-w-[23rem]',
                'sm:landscape:x-[max-w-[73rem],px-[--p-content-3xl]]'
            )}
        >
            <div className={'flex flex-col w-full  sm:landscape:flex-row sm:landscape:justify-between'}>
                <div>
                    <p>Your Tern account provides you with:</p>
                    <ul className={'flex flex-col   gap-y-[--p-content-xs] mt-[--p-content-xs] mb-[--p-content]   list-disc list-inside'}>
                        <li>Single sign-on to the Tern ecosystem</li>
                        <li>Personalized recommendations</li>
                        <li>Test drives and other trials</li>
                        <li>And many more exclusive benefits</li>
                    </ul>
                </div>
                <div className={'place-self-center max-w-[19rem] w-full sm:portrait:w-[85%] font-bold text-section-s'}>
                    <Button
                        onClick={() => modalCtx.openModal(<AuthModal isLoginAction/>)}
                        className={'mb-[--p-content-xxs] w-full h-[2.7rem]      rounded-full bg-control-blue  text-primary'}
                    >
                        Login
                    </Button>
                    <Button
                        onClick={() => modalCtx.openModal(<AuthModal/>)}
                        className={'w-full h-[2.7rem] border-small rounded-full border-control-blue'}
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
}


export {PreAuthModal};
