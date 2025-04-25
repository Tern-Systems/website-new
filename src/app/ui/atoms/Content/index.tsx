import { FC, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {}

const Content: FC<Props> = (props: Props) => {
    const { children } = props;
    return (
        <div
            {...props}
            className={'relative pt-[9.375rem] pb-[25.625rem]'}
        >
            <div
                className={
                    'absolute -z-10 inset-0 bg-[linear-gradient(to_bottom,var(--bg-blue)_5rem,transparent_9rem)]'
                }
            />
            {children}
            <div
                className={'absolute -z-10 inset-0 bg-[linear-gradient(to_top,var(--bg-blue)_5rem,transparent_40rem)]'}
            />
        </div>
    );
};
Content.displayName = Content.name;

export { Content };
