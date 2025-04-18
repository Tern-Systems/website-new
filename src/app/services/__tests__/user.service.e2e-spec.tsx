import { UserTestUtil } from '@/tests/utils';

// App
import { UserService, UserServiceImpl } from '@/app/services';

import ProfilePage from '@/pages/profile/index.page';

describe('E2E related to ' + UserServiceImpl.name, () => {
    describe(UserService.postUpdateUserName.name, () => {
        afterEach(async () => await UserTestUtil.clean(true));

        it('Should successfully change username', async () => {
            // Preparation
            await UserTestUtil.renderLoggedIn(<ProfilePage />);

            // Test
        });
    });
});
