jest.mock('@fortawesome/react-fontawesome', () => ({ FontAwesomeIcon: (props: any) => <div {...props} /> }));
jest.mock('react-svg', () => ({ ReactSVG: (props: any) => <div {...props} /> }));
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <div {...props} />,
}));

export {};
