const COOKIE_TOKEN_KEY_PREFIX = 'bearer-token=';
const COOKIE_TOKEN_EXPIRE_S = 900; // 15 mins

const createCookie = (token: string | null) =>
    token
        ? `${COOKIE_TOKEN_KEY_PREFIX}${token};path=/;max-age=${COOKIE_TOKEN_EXPIRE_S};secure;SameSite=Strict`
        : `${COOKIE_TOKEN_KEY_PREFIX};path=/;max-age=${new Date(0).toLocaleString()};`;

export { createCookie, COOKIE_TOKEN_KEY_PREFIX, COOKIE_TOKEN_EXPIRE_S };
