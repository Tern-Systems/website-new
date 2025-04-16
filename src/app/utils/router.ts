const getIdName = (route: string | undefined, joinWords = false): string | undefined =>
    route
        ?.split('/')
        .pop()
        ?.split('_')
        ?.filter((value) => value)
        ?.map((value) => value.charAt(0).toUpperCase() + value.slice(1))
        ?.reduce((result, char) => result + ((joinWords ? '' : ' ') + char), '');

const getRouteRoot = (route: string | null): string => '/' + route?.split('/')?.[1];

const getRouteLeave = (route: string | null): string => '/' + route?.split('/')?.pop();

const checkSubRoute = (route: string | null, subRoute: string, checkLeaves = false): boolean =>
    checkLeaves
        ? getRouteLeave(subRoute).toLowerCase() === getRouteLeave(route).toLowerCase()
        : route?.toLowerCase().includes(subRoute?.toLowerCase()) === true;

const sliceRoute = (route: string | null, partsCount: number): string =>
    '/' +
    route
        ?.split('/')
        .slice(2 * partsCount)
        .join('/');

export { getRouteRoot, getIdName, getRouteLeave, checkSubRoute, sliceRoute };
