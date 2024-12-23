const getRouteName = (route: string | undefined, joinWords = false): string | undefined => route
    ?.split('/')
    .pop()
    ?.match(/([A-Z][a-z]*)/g)
    ?.map(route => route)
    ?.reduce(
        (result, char) => result + (char.match(/[A-Z][a-z]+/g) ? (joinWords ? '' : ' ') + char : char)
        , ''
    )
    .split('And')
    .join(' and ');

const getRouteRoot = (route: string | null): string => '/' + route?.split('/')?.[1];

const getRouteLeave = (route: string | null): string => '/' + route?.split('/')?.pop();

const checkSubRoute = (route: string | null, subRoute: string, checkLeaves = false): boolean => checkLeaves
    ? getRouteLeave(subRoute).toLowerCase().includes(getRouteLeave(route).toLowerCase())
    : route?.toLowerCase().includes(subRoute.toLowerCase()) === true;

const sliceRoute = (route: string | null, partsCount: number): string => '/' + route?.split('/').slice(2 * partsCount).join('/');


export {getRouteRoot, getRouteName, getRouteLeave, checkSubRoute, sliceRoute};
