import {ButtonHTMLAttributes, FC} from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    btnType: 'close' | ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

const Button: FC<ButtonProps> = (props: ButtonProps) => {
    const {btnType} = props;
    switch (btnType) {
        case 'close':
            return (
                <button
                    {...props}
                    type={'button'}
                    className={`size-[0.9375rem] bg-[url("../assets/images/icons/close.svg")] bg-contain ${props.className}`}
                />
            );
        case 'submit':
            return (
                <button
                    {...props}
                    type={'submit'}
                    className={`p-[1.13rem] w-full border-small border-control3 rounded-full text-[1.3125rem] text-primary leading-none ${props.className}`}
                >
                    {props.children}
                </button>
            )
        default:
            return (
                <button
                    {...props}
                    type={'button'}
                    className={`w-full rounded-full p-[1.13rem] text-[1.3125rem] text-primary leading-none ${props.className}`}
                >
                    {props.children}
                </button>);
    }
}
export {Button}