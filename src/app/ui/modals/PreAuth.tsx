import {FC} from "react";

import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals/Base";
import {AuthModal} from "@/app/ui/modals/Auth";
import {Button} from "@/app/ui/form";


const PreAuthModal: FC = () => {
    const modalCtx = useModal();

    return (
        <BaseModal
            adaptSmScreen
            title={'Tern Account'}
            classNameTitle={'place-self-center -ml-[8rem]'}
            classNameContent={'place-items-center'}
        >
            <div>
                <p>Your Tern account provides you with:</p>
                <ul className={'list-disc list-inside mt-[1.25rem] mb-[1.87rem] gap-y-[1.25rem] flex flex-col'}>
                    <li>Single sign-on to the Tern ecosystem</li>
                    <li>Personalized recommendations</li>
                    <li>Test drives and other trials</li>
                    <li>And many more exclusive benefits</li>
                </ul>
            </div>
            <div className={'px-[0.25rem] font-bold text-small max-w-[19rem] w-full'}>
                <Button
                    onClick={() => modalCtx.openModal(<AuthModal isLoginAction/>)}
                    className={'h-[2.7rem] bg-control-blue rounded-full w-full text-primary mb-[0.94rem]'}
                >
                    Login
                </Button>
                <Button
                    onClick={() => modalCtx.openModal(<AuthModal/>)}
                    className={'h-[2.7rem] border-control-blue border-small rounded-full w-full'}
                >
                    Sign Up
                </Button>
            </div>
        </BaseModal>
    );
}


export {PreAuthModal};
