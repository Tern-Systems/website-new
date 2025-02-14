import { FC, useState } from 'react';
import cn from 'classnames';

import { Button } from '@/app/ui/form';
import { Menu } from '@/app/ui/layout/Menu';

const useMenu = (singleSubLink?: boolean): [FC, boolean, FC] => {
    const [opened, setOpened] = useState(false);

    const MenuControlled: FC = () =>
        opened ? (
            <Menu
                singleSubLink={singleSubLink}
                openedState={[opened, setOpened]}
            />
        ) : null;

    const MenuToggle: FC = () => (
        <Button
            onClick={() => setOpened((prevState) => !prevState)}
            icon={opened ? 'close' : 'burger'}
            className={cn(`px-s`, { ['bg-gray-d0']: opened })}
            classNameIcon={'!size-heading-icon h-auto'}
        />
    );

    return [MenuToggle, opened, MenuControlled];
};

export { useMenu };
