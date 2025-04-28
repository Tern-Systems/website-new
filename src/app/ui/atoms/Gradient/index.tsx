import { FC } from 'react';

const Gradient: FC = () => (
    <div className={'absolute -z-10 inset-0 h-full  bg-gradient-to-r from-black to-transparent to-50%'} />
);

Gradient.displayName = Gradient.name;

export { Gradient };
