import { AuthTestUtilImpl } from '@/__tests__/utils/auth.util';

class UserTestUtilImpl extends AuthTestUtilImpl {
    public static readonly DATA = {
        ...AuthTestUtilImpl.DATA,
    };
}

const UserTestUtil = new UserTestUtilImpl();

export { UserTestUtil, UserTestUtilImpl };
