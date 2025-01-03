import {FC} from "react";

import {useModal} from "@/app/context";

import {BaseModal} from "@/app/ui/modals/Base";
import {AuthModal} from "@/app/ui/modals/Auth";
import {Button} from "@/app/ui/form";


const PreAuthModal: FC = () => {
    const modalCtx = useModal();

    return (
        <BaseModal
            smScreenOnly
            title={'Tern Account'}
            classNameTitle={'place-self-start   sm:landscape:place-self-start sm:landscape:ml-0'}
            classNameContent={'place-items-center p-[1.25rem]'}
        >
            <div className={'place-items-center     w-full     sm:landscape:flex sm:landscape:justify-between'}>
                <div>
                    <p>Your Tern account provides you with:</p>
                    <ul className={'flex flex-col   gap-y-[1.25rem] mt-[1.25rem] mb-[1.87rem]   list-disc list-inside'}>
                        <li>Single sign-on to the Tern ecosystem</li>
                        <li>Personalized recommendations</li>
                        <li>Test drives and other trials</li>
                        <li>And many more exclusive benefits</li>
                    </ul>
                </div>
                <div className={'px-[1rem] max-w-[19rem] w-full     font-bold text-small'}>
                    <Button
                        onClick={() => modalCtx.openModal(<AuthModal isLoginAction/>)}
                        className={'mb-[0.94rem] w-full h-[2.7rem]      rounded-full bg-control-blue  text-primary'}
                    >
                        Login
                    </Button>
                    <Button
                        onClick={() => modalCtx.openModal(<AuthModal/>)}
                        className={'w-full h-[2.7rem]   border-small rounded-full border-control-blue'}
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
}


export {PreAuthModal};
