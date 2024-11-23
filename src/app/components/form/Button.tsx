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
                    className={`border-small border-control3 rounded-full p-[0.5rem] text-[1.3125rem] text-primary ${props.className}`}
                >
                    {props.children}
                </button>
            )
        default:
            return <button {...props} type={'button'}>{props.children}</button>;
    }
}
export {Button}