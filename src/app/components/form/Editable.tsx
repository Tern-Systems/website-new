import {FC, useState} from "react";
import Image from "next/image";

import {Input} from "@/app/components/form";

import SVG_EDIT from "@/assets/images/icons/edit.svg";

interface Props {
    title?: string;
    initialValue: string;
    customEdit?: () => void;
    onEdit?: () => Promise<void>;
    className?: string;
}

const Editable: FC<Props> = (props: Props) => {
    const {initialValue, customEdit, onEdit, title, className} = props;

    const [isEditState, setEditState] = useState(false);
    const [value, setValue] = useState<string>(initialValue);

    const handleEdit = async () => {
        if (customEdit)
            customEdit();
        else {
            if (isEditState)
                await onEdit?.();
            setEditState(prevState => !prevState);
        }
    }

    return (
        <div className={'flex w-full justify-between items-center'}>
            {
                isEditState
                    ? (
                        <Input
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                        />
                    )
                    : <span className={className}>{value}</span>
            }
            <span
                className={'cursor-pointer font-neo text-[0.875rem] flex gap-[0.39rem] items-center'}
                onClick={() => handleEdit()}
            >
                {isEditState ? 'Save' : (title ?? 'Change')}
                <Image src={SVG_EDIT} alt={'edit'} className={'size-[0.8125rem]'}/>
            </span>
        </div>
    );
}

export {Editable}