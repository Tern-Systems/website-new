import { act } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';

import { DataTestID, TIMEOUT } from '@/__tests__/static';
import {
    AuthTestUtil,
    AuthTestUtilImpl,
    conditionExpect,
    findAllByTestId,
    findByTestId,
    render,
    waitFor,
} from '@/__tests__/utils';

// App
import { AuthService, AuthServiceImpl } from '@/app/services/auth.service';

import { createCookie } from '@/app/utils';

import HomePage from '@/pages/index.page';

const { modal, layout } = DataTestID;
const { profile } = layout;
const { login } = modal;

describe('E2E related to ' + AuthServiceImpl.name, () => {
    const UseUserMock = jest.requireMock('@/app/hooks/context/useUser');

    const { dummyEmail, wrongEmail, dummyPassword } = AuthTestUtilImpl.DATA;

    beforeAll(async () => await AuthTestUtil.clean());
    beforeEach(() => {
        AuthTestUtil.mockRouter();
        AuthTestUtil.mockPathName('/');
    });
    afterAll(async () => await AuthTestUtil.clean());

    describe(AuthService.postForgotPassword.name, () => {
        const { forgotPassword } = modal;

        afterEach(async () => await AuthTestUtil.clean());

        const requestReset = async (email: string) => {
            // Preparation
            await AuthTestUtil.signupUser(email);

            await act(() => render(<HomePage />));

            // Main
            await act(async () => fireEvent.click(await findByTestId(profile.loginButton)));

            await act(async () => fireEvent.click(await findByTestId(login.resetLink)));

            expect(await findByTestId(forgotPassword.modal)).toBeInTheDocument();

            await act(async () =>
                fireEvent.change(await findByTestId(forgotPassword.emailInput), {
                    target: { value: dummyEmail },
                }),
            );

            await act(async () => fireEvent.click(await findByTestId(forgotPassword.submitButton)));
        };

        it(
            'Should successfully request email with reset link',
            async () => {
                await requestReset(dummyEmail);
                expect(await findByTestId(forgotPassword.message)).toHaveTextContent(
                    `An email has been sent to ${dummyEmail} with further instructions.`,
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
                expect(await findByTestId(forgotPassword.message)).toHaveTextContent(
                    'User with this email does not exist',
                );

                // Cleanup
                await AuthTestUtil.deleteUser(wrongEmail);
            },
            TIMEOUT.testMs,
        );
    });

    describe(AuthService.postLogout.name, () => {
        afterEach(async () => await AuthTestUtil.clean(true));

        it(
            'Should successfully log out',
            async () => {
                // Preparation
                const { useUserSpy } = await AuthTestUtil.renderLoggedIn(<HomePage />);
                jest.useFakeTimers();

                // Main
                const [profileToggle] = await findAllByTestId(profile.menu);
                await act(() => fireEvent.click(profileToggle));

                await act(async () => fireEvent.click(await findByTestId(profile.logoutButton)));

                await waitFor(() =>
                    expect(useUserSpy).toHaveLastReturnedWith(expect.objectContaining({ userData: null })),
                );

                expect(document.cookie).toEqual(createCookie(null));

                expect(await findByTestId(profile.loginButton)).toBeInTheDocument();

                expect(profileToggle).not.toBeInTheDocument();
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

            const LoginModal = await findByTestId(login.modal);
            expect(LoginModal).toBeInTheDocument();

            await act(async () =>
                fireEvent.change(await findByTestId(login.emailInput), {
                    target: { value: dummyEmail },
                }),
            );
            await act(async () =>
                fireEvent.change(await findByTestId(login.passwordInput), {
                    target: { value: dummyPassword + (success || twoFA ? '' : 'wrong') },
                }),
            );

            await act(async () => fireEvent.click(await findByTestId(login.submitButton)));

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
                expect(await findByTestId(login.message)).toHaveTextContent('Invalid credentials');
            },
            TIMEOUT.testMs,
        );
    });

    // describe(AuthService.postCreatePassword.name, () => {
    //     let token: string;
    //
    //     beforeEach(async () => await AuthTestUtil.signupUser());
    //     afterEach(async () => await AuthTestUtil.clean(true));
    //
    //     const verify = async (expected: string) => {
    //         // Preparation
    //         // Add token request
    //         AuthTestUtil.mockSearchParams({ success: 'email_verified', token });
    //
    //         render(<HomePage />);
    //         jest.useFakeTimers();
    //
    //         // Main
    //         expect(await findByTestId(modal.createPassword.modal)).toBeInTheDocument();
    //
    //         await act(async () =>
    //             fireEvent.change(await findByTestId(modal.createPassword.passwordInput), {
    //                 target: { value: dummyPassword },
    //             }),
    //         );
    //         await act(async () =>
    //             fireEvent.change(await findByTestId(modal.createPassword.passwordConfirmInput), {
    //                 target: { value: dummyPassword },
    //             }),
    //         );
    //
    //         await act(async () => fireEvent.click(await findByTestId(modal.createPassword.submitButton)));
    //         expect(await findByTestId(modal.createPassword.resultModal)).toHaveTextContent(expected);
    //     };
    //
    //     it(
    //         'Should successfully set a new password after email verification',
    //         async () => {
    //             await verify(token, 'Successfully set new password');
    //             expect(await findByTestId(login.modal)).toBeInTheDocument();
    //         },
    //         TIMEOUT.testMs,
    //     );
    //
    //     it(
    //         'Should show error message because of not existing token',
    //         async () => await verify(token + 'wrong-token', 'Token not found'),
    //         TIMEOUT.testMs,
    //     );
    // });

    describe(AuthService.postSignup.name, () => {
        const { signUp, emailSent } = modal;

        beforeEach(() => render(<HomePage />));
        afterEach(async () => await AuthTestUtil.clean(true));

        const doSignUp = async () => {
            await act(async () => fireEvent.click(await findByTestId(profile.signUpButton)));
            expect(await findByTestId(signUp.modal)).toBeInTheDocument();

            await act(async () =>
                fireEvent.change(await findByTestId(signUp.emailInput), {
                    target: { value: dummyEmail },
                }),
            );
            await act(async () => fireEvent.click(await findByTestId(signUp.submitButton)));
        };

        it(
            'Should successfully register a new user',
            async () => {
                await doSignUp();
                expect(await findByTestId(emailSent.modal)).toBeInTheDocument();
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
                expect(await findByTestId(signUp.message)).toHaveTextContent('Email already exists');
            },
            TIMEOUT.testMs,
        );
    });
});
