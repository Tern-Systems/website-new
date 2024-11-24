import {PropsWithChildren} from "react";
import {Button} from "@/app/components/form/Button";

interface BaseModalProps<T extends boolean> extends PropsWithChildren {
    simple: T;
    title?: string;
    onClick: () => void;
}

function BaseModal<T extends boolean>(props: BaseModalProps<T>) {
    const {simple, children, title, onClick} = props;
    if (simple) {
        return (
            <span
                className={`flex items-center gap-[1rem] px-[0.62rem] py-[0.8rem]
                            bg-control2 rounded-[0.375rem] max-w-[18.09rem] text-left`}
            >
            <span>{children}</span>
            <Button btnType={'close'} onClick={() => onClick()}/>
        </span>
        );
    } else {
        return (
            <div
                className={`p-[--py] rounded-[0.5625rem] border-small border-control3 bg-control
                            text-primary leading-none place-self-center`}>
                <div className={'flex items-center justify-between font-oxygen text-[1.69rem] text-primary'}>
                    <h1 id={'modal-title'}>{title ?? ''}</h1>
                    <Button btnType={'close'} onClick={() => onClick()}/>
                </div>
                <hr className={'scale-[105%] mt-[1.25rem] mb-[1.54rem]'}/>
                <div>{children}</div>
            </div>
        )
    }
}

export {BaseModal}