import { act } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';

import { DataTestID, TIMEOUT } from '@/__tests__/static';
import {
    AuthTestUtil,
    AuthTestUtilImpl,
    change,
    checkTextContent,
    checkToBeInDocument,
    click,
    conditionExpect,
    findAllByTestId,
    findByTestId,
    render,
    waitFor,
} from '@/__tests__/utils';

// App
import { SearchParamsEnum } from '@/app/static';

import { AuthService, AuthServiceImpl } from '@/app/services/auth.service';

import { createCookie } from '@/app/utils';

import HomePage from '@/pages/index.page';

const { modal, layout } = DataTestID;
const { profile } = layout;
const { auth, resetPassword } = modal;

describe('E2E related to ' + AuthServiceImpl.name, () => {
    const UseUserMock = jest.requireMock('@/app/hooks/context/useUser');

    const { dummyEmail, wrongEmail, dummyPassword, newPassword } = AuthTestUtilImpl.DATA;

    beforeAll(async () => await AuthTestUtil.clean());
    beforeEach(() => {
        AuthTestUtil.mockRouter();
        AuthTestUtil.mockPathName('/');
    });
    afterAll(async () => await AuthTestUtil.clean());

    const openProfileMenu = async () => {
        await click(profile.toggle);
        await checkToBeInDocument(profile.menuUnlogged);
    };

    const openLoginModal = async () => {
        await openProfileMenu();
        await click(profile.loginButton);
        expect(await findByTestId(auth.modal)).toBeInTheDocument();
    };

    describe(AuthService.postForgotPassword.name, () => {
        afterEach(async () => await AuthTestUtil.clean());

        const requestReset = async (email: string) => {
            // Preparation
            await AuthTestUtil.signupUser(email);
            await render(<HomePage />);
            await openLoginModal();

            // Main
            await click(auth.resetLink);
            await checkToBeInDocument(resetPassword.modal);

            await change(resetPassword.form.input.email, dummyEmail);
            await click(resetPassword.form.submitButton);
        };

        it(
            'Should successfully request email with reset link',
            async () => {
                await requestReset(dummyEmail);

                await checkToBeInDocument(resetPassword.emailSent.modal);
                await checkTextContent(
                    resetPassword.emailSent.message,
                    `To reset your password, please click the link provided in the email sent to your registered email address.`,
                );

                // Cleanup
                await AuthTestUtil.deleteUser(dummyEmail);
            },
            TIMEOUT.testMs,
        );

        it(
            "Should inform user that entered email doesn't exist",
            async () => {
                // Pre-cleanup
                try {
                    await AuthTestUtil.deleteUser(wrongEmail);
                } catch (_) {
                    // Empty block
                }

                await requestReset(wrongEmail);
                await checkTextContent(resetPassword.message, 'User with this email does not exist');

                // Cleanup
                await AuthTestUtil.deleteUser(wrongEmail);
            },
            TIMEOUT.testMs,
        );
    });

    describe(AuthService.postResetPassword.name, () => {
        beforeEach(async () => await AuthTestUtil.signupUser());
        afterEach(async () => await AuthTestUtil.clean(true));

        const verify = async (token: string, expected: string) => {
            // Preparation
            AuthTestUtil.mockSearchParams({ success: SearchParamsEnum.token, token });
            await render(<HomePage />);

            // Main
            await checkToBeInDocument(resetPassword.modal);

            await change(resetPassword.form.input.password, newPassword);
            await change(resetPassword.form.input.passwordConfirm, newPassword);

            await click(resetPassword.form.submitButton);

            await checkTextContent(resetPassword.message, expected);
        };

        it(
            'Should successfully set a new password after email verification',
            async () => {
                const token = await AuthTestUtil.requestPasswordReset();
                await verify(token, 'Password has been updated successfully');
                await checkToBeInDocument(auth.modal);
            },
            TIMEOUT.testMs,
        );

        it(
            'Should show error message because of not existing token',
            async () => {
                const token = await AuthTestUtil.requestPasswordReset();
                await verify(token + 'wrong-token', 'Invalid or expired token');
            },
            TIMEOUT.testMs,
        );
    });

    describe(AuthService.postLogout.name, () => {
        afterEach(async () => await AuthTestUtil.clean(true));

        it(
            'Should successfully log out',
            async () => {
                const { useUserSpy } = await AuthTestUtil.renderLoggedIn(<HomePage />);

                await click(profile.toggle);

                await checkToBeInDocument(profile.menu);

                await click(profile.logoutButton);

                expect(useUserSpy).toHaveLastReturnedWith(expect.objectContaining({ userData: null }));

                expect(document.cookie).toEqual(createCookie(null));
            },
            TIMEOUT.testMs,
        );
    });

    describe(AuthService.postLogin.name + ' ' + AuthService.postLoginVerifyOTP.name + ' related', () => {
        const { otp: otpModal } = modal;

        beforeEach(async () => AuthTestUtil.mockCookie());
        afterEach(async () => await AuthTestUtil.clean(true));

        const doLogin = async (success: boolean, twoFA?: true) => {
            // Preparation
            await AuthTestUtil.signupUser();

            if (twoFA) await AuthTestUtil.setup2FA();

            const useUserSpy = jest.spyOn(UseUserMock, 'useUser');

            render(<HomePage />);

            // Main
            const loginButton = await findByTestId(profile.loginButton);
            await act(() => fireEvent.click(loginButton));

            const LoginModal = await findByTestId(auth.modal);
            expect(LoginModal).toBeInTheDocument();

            await act(async () =>
                fireEvent.change(await findByTestId(auth.form.input.email), {
                    target: { value: dummyEmail },
                }),
            );
            await act(async () =>
                fireEvent.change(await findByTestId(auth.form.input.password), {
                    target: {
                        value: dummyPassword + (success || twoFA ? '' : 'wrong'),
                    },
                }),
            );

            await act(async () => fireEvent.click(await findByTestId(auth.form.submitButton)));

            let TwoFAModal: HTMLElement | null = null;
            if (twoFA) {
                // Acts like 'resend code'
                const { payload } = await AuthService.postSendOTP(dummyEmail);
                const { otp } = payload;

                TwoFAModal = await findByTestId(otpModal.modal);
                expect(TwoFAModal).toBeInTheDocument();

                await act(async () =>
                    fireEvent.change(await findByTestId(otpModal.codeInput), {
                        target: { value: success ? otp : '000000' },
                    }),
                );

                await act(async () => fireEvent.click(await findByTestId(otpModal.submitButton)));
            }

            await waitFor(() => {
                if (twoFA && TwoFAModal) conditionExpect(TwoFAModal, !success).toBeInTheDocument();
                conditionExpect(useUserSpy, !success).toHaveLastReturnedWith(
                    expect.objectContaining({ userData: null }),
                );
            });

            if (success) {
                expect(document.cookie.length).toBeGreaterThan(0);
                await waitFor(() => conditionExpect(loginButton, !success).toBeInTheDocument());
            }

            await waitFor(() => conditionExpect(LoginModal, !success && !twoFA).toBeInTheDocument());
        };

        it(
            'Should successfully login an existing user with 2FA',
            async () => await doLogin(true, true),
            TIMEOUT.testMs,
        );

        it(
            'Should show error message because of wrong OTP',
            async () => {
                await doLogin(false, true);
                expect(await findByTestId(otpModal.message)).toHaveTextContent('Incorrect OTP');
            },
            TIMEOUT.testMs,
        );

        it(
            'Should successfully login an existing user without 2FA',
            async () => await doLogin(true),
            TIMEOUT.requestMs,
        );

        it(
            'Should show error message because of wrong password',
            async () => {
                await doLogin(false);
                expect(await findByTestId(auth.message)).toHaveTextContent('Invalid credentials');
            },
            TIMEOUT.testMs,
        );
    });

    describe(AuthService.postSignup.name, () => {
        const { auth } = modal;

        afterEach(async () => await AuthTestUtil.clean(true));

        const doSignUp = async () => {
            // Preparation
            await render(<HomePage />);
            await openProfileMenu();

            // Test
            await click(profile.signUpButton);
            await checkToBeInDocument(auth.modal);

            await change(auth.form.input.email, dummyEmail);
            await change(auth.form.input.password, dummyPassword);
            await change(auth.form.input.passwordConfirm, dummyPassword);

            await click(auth.form.submitButton);
        };

        it(
            'Should successfully register a new user',
            async () => {
                await doSignUp();
                await checkTextContent(auth.successModal, 'Account is created');
            },
            TIMEOUT.testMs,
        );

        it(
            'Should show error because email is already exists',
            async () => {
                // Preparation
                await AuthService.postSignup(dummyEmail, dummyPassword);

                // Main
                await doSignUp();
                await checkTextContent(auth.message, 'Email already exists');
            },
            TIMEOUT.testMs,
        );
    });
});
