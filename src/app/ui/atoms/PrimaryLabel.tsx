import React, {FC} from "react";
import cn from "classnames";


const PrimaryLabel: FC = () => (
    <span
        className={cn(
            `col-start-2 bg-control-white-d0 rounded-smallest1 w-[4.15rem] py-[0.1rem] block`,
            `text-gray text-center text-section-xxs mt-[0.62rem]`
        )}
    >
            Primary
    </span>
);


export {PrimaryLabel};
