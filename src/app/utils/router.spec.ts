import { getRouteRoot, getRouteLeave, getIdName, checkSubRoute, sliceRoute } from '@/app/utils/router';

describe('Router utils test', () => {
    // Unit test case for getRouteRoot funciton

    test(getRouteRoot.name + " - should return route root with prefix '/' when input is /Users/Profile", () => {
        const expected = '/Users';

        expect(getRouteRoot('/Users/Profile')).toEqual(expected);
    });
    test(getRouteRoot.name + " - should return route root with prefix '/' when input is /Users", () => {
        const expected = '/Users';

        expect(getRouteRoot('/Users')).toEqual(expected);
    });
    test(getRouteRoot.name + " - should return route root with prefix '/' when input is /", () => {
        const expected = '/';

        expect(getRouteRoot('/')).toEqual(expected);
    });
    test(getRouteRoot.name + " - should return route root with prefix '/' when input is null", () => {
        const expected = '/undefined';

        expect(getRouteRoot(null)).toEqual(expected);
    });

    // unit test cases for getRouteLeave funciton
    test(getRouteLeave.name + ' - should return /profile for /home/user', () => {
        const expected = '/user';

        expect(getRouteLeave('home/user')).toEqual(expected);
    });
    test(getRouteLeave.name + ' - should return /profile for /home/user', () => {
        const expected = '/';

        expect(getRouteLeave('/')).toEqual(expected);
    });
    test(getRouteLeave.name + ' - should return /profile for /home/user', () => {
        const expected = '/undefined';

        expect(getRouteLeave(null)).toEqual(expected);
    });
    test(getRouteLeave.name + ' - should return /profile for /home/user', () => {
        const expected = '/';

        expect(getRouteLeave('')).toEqual(expected);
    });

    // unit test cases for getIdName funciton
    test('should convert last segment of route to capitalized words with spaces when joinWords is not passed (false by default)', () => {
        const expected = 'Profile Id';

        expect(getIdName('/home/user/profile_id')?.trim()).toEqual(expected);
    });
    test('should convert last segment of route to capitalized words with spaces when joinWords is false', () => {
        const expected = 'Profile Id';

        expect(getIdName('/home/user/profile_id', false)?.trim()).toEqual(expected);
    });
    test('should convert last segment of route to capitalized words without spaces when joinWords is true', () => {
        const expected = 'ProfileId';

        expect(getIdName('/home/user/profile_id', true)).toEqual(expected);
    });
    test('should handle single-word last segment correctly', () => {
        const expected = 'Dashboard';

        expect(getIdName('/dashboard')?.trim()).toEqual(expected);
    });
    test('should handle multiple underscores in last segment', () => {
        expect(getIdName('/multi_part_example')?.trim()).toBe('Multi Part Example');
    });

    test('should handle multiple underscores in last segment with joinWords', () => {
        expect(getIdName('/multi_part_example', true)).toBe('MultiPartExample');
    });

    test('should ignore trailing slashes and process correctly', () => {
        expect(getIdName('/user/details/')).toBe('');
    });
    test('should return undefined for undefined input', () => {
        expect(getIdName(undefined)).toBe(undefined);
    });

    // For unit test cases for checkSubRoute  function

    test('should return true when subRoute exists in route', () => {
        expect(checkSubRoute('home/dashboard', 'dashboard')).toBe(true);
    });
    test('should return false when subRoute does not exist in route', () => {
        expect(checkSubRoute('home/dashboard', 'settings')).toBe(false);
    });
    test('should return false when route is null', () => {
        expect(checkSubRoute(null, 'dashboard')).toBe(false);
    });
    test('should be case-insensitive', () => {
        expect(checkSubRoute('HOME/DASHBOARD', 'dashboard')).toBe(true);
    });

    test('should check leaves when checkLeaves is true', () => {
        expect(checkSubRoute('home/user/profile', 'profile', true)).toBe(true);
    });

    test('should return false if subRoute does not match leaf node', () => {
        expect(checkSubRoute('home/user/profile', 'dashboard', true)).toBe(false);
    });

    test('should handle empty strings', () => {
        expect(checkSubRoute('', '')).toBe(true);
    });

    test('should return false if route is null even with checkLeaves', () => {
        expect(checkSubRoute(null, 'profile', true)).toBe(false);
    });

    // Unit Test cases for sliceRoute function
    test('should remove first 2 parts when partsCount is 1', () => {
        expect(sliceRoute('home/user/profile', 1)).toBe('/profile');
    });
    test('should remove first 4 parts when partsCount is 2', () => {
        expect(sliceRoute('home/user/settings', 2)).toBe('/');
    });

    test('should return "/" when partsCount is too high', () => {
        expect(sliceRoute('home/user/profile', 5)).toBe('/');
    });

    test('should work when partsCount is 0', () => {
        expect(sliceRoute('home/user/profile', 0)).toBe('/home/user/profile');
    });

    test('should handle a single-part route correctly', () => {
        expect(sliceRoute('dashboard', 1)).toBe('/');
    });

    test('should handle an empty route string', () => {
        expect(sliceRoute('', 1)).toBe('/');
    });

    test('should return "/" for root route "/"', () => {
        expect(sliceRoute('/', 1)).toBe('/');
    });

    test('should work with trailing slashes', () => {
        expect(sliceRoute('app/dashboard/admin/', 1)).toBe('/admin/');
    });

    test('should return full route when partsCount is 0', () => {
        expect(sliceRoute('app/dashboard/admin', 0)).toBe('/app/dashboard/admin');
    });
});
