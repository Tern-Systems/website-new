import { AuthTestUtilImpl } from '@/tests/utils/auth.util';

class UserTestUtilImpl extends AuthTestUtilImpl {
    public static readonly DATA = {
        ...AuthTestUtilImpl.DATA,
    };
}

const UserTestUtil = new UserTestUtilImpl();

export { UserTestUtil, UserTestUtilImpl };
