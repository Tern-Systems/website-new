import { COOKIE_TOKEN_EXPIRE_S, COOKIE_TOKEN_KEY_PREFIX, createCookie } from './auth';

describe('Data utils', () => {
    describe(createCookie.name, () => {
        test('Should return cookie value based on token', () => {
            const token = 'asdasdg3-9g92';
            expect(createCookie(token)).toEqual(
                `${COOKIE_TOKEN_KEY_PREFIX}${token};path=/;max-age=${COOKIE_TOKEN_EXPIRE_S};secure;SameSite=Strict`,
            );
        });

        test('Should return empty cookie', () => {
            expect(createCookie(null)).toEqual(
                `${COOKIE_TOKEN_KEY_PREFIX};path=/;max-age=${new Date(0).toLocaleString()};`,
            );
        });
    });
});
