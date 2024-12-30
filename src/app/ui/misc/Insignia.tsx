import React, {FC} from "react";
import Spline from "@splinetool/react-spline";
import {usePathname} from "next/navigation";
import cn from "classnames";

import {Route} from "@/app/static";

import {useNavigate} from "@/app/hooks";


interface Props {
    isInsigniaMoved?: boolean;
    className?: string;
}

const Insignia: FC<Props> = (props: Props) => {
    const {isInsigniaMoved, className} = props;

    const route = usePathname();
    const [navigate] = useNavigate();

    // 2 pre-rendered insignias for moving without flickering
    const insigniaState = (typeof isInsigniaMoved === 'boolean' ? [isInsigniaMoved, !isInsigniaMoved] : [true]);
    return insigniaState.map((state, idx) => (
        <div
            key={state.toString() + idx}
            onClick={() => {
                if (route !== Route.Start)
                    navigate(Route.Home);
            }}
            className={cn(className, 'absolute size-[15rem]', {['hidden']: !state})}
        >
            <Spline scene={"https://prod.spline.design/DVjbSoDcq5dzLgus/scene.splinecode"}
                    className={'pointer-events-none'}/>
        </div>
    ));
}

export {Insignia};
