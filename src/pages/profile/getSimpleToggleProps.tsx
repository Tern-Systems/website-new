import { Dispatch, SetStateAction } from 'react';

import { EditableProps } from '@/app/ui/form/Editable';

const getSimpleToggleProps = (
    setEditId?: Dispatch<SetStateAction<string | null>>,
    isEditState?: string | null,
): Pick<EditableProps, 'wrapper' | 'classNameToggle' | 'setParentEditId' | 'parentEditId'> => ({
    wrapper: 'w-[min(100%,21.625rem)]',
    classNameToggle: 'col-start-3',
    setParentEditId: setEditId,
    parentEditId: isEditState,
});

export { getSimpleToggleProps };
