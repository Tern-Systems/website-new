const modal = {
    createPassword: {
        modal: 'create-password-modal',
        submitButton: 'create-password-submit-button',
        passwordInput: 'create-password-password-input',
        passwordConfirmInput: 'create-password-password-confirm-input',
        message: 'create-password-message-label',
        resultModal: 'create-password-result-modal',
    },
    auth: {
        modal: 'auth-modal',
        successModal: 'auth-success-modal',
        message: 'auth-modal-message-label',
        resetLink: 'auth-modal-reset-link',
        form: {
            submitButton: 'auth-modal-submit-button',
            input: {
                email: 'auth-modal-email-input',
                password: 'auth-modal-password-input',
                passwordConfirm: 'auth-modal-password-confirm-input',
            },
        },
    },
    otp: {
        modal: 'otp-modal',
        submitButton: 'otp-submit-button',
        codeInput: 'otp-code-input',
        message: 'otp-message-label',
    },
    forgotPassword: {
        modal: 'forgot-password-modal',
        emailInput: 'forgot-password-email-input',
        submitButton: 'forgot-password-submit-button',
        message: 'forgot-password-message-label',
    },
    emailSent: {
        modal: 'email-sent-modal',
    },
} as const;

const DataTestID = {
    layout: {
        profile: {
            toggle: 'profile-menu-toggle',
            menuUnlogged: 'profile-menu-unlogged',
            menu: 'profile-menu',
            signUpButton: 'profile-menu-auth-button',
            loginButton: 'profile-menu-login-button',
            logoutButton: 'profile-menu-logout-button',
        },
    },
    page: {
        subscribe: {
            paymentForm: {
                input: {
                    cardNumber: 'form-card-number',
                    expirationDate: 'form-expiration-date',
                    cvc: 'form-cvc',
                    cardholderName: 'form-cardholder-name',

                    country: 'form-country',
                    billingAddress: 'form-address-full',

                    addressLine1: 'form-address-line-1',
                    addressLine2: 'form-address-line-2',
                    city: 'form-city',
                    zip: 'form-zip',
                    state: 'form-state',
                },
                expandButton: 'form-expand-address-button',
                submitButton: 'form-submit-button',
                errorModal: 'form-error-modal',
                successModal: 'form-success-modal',
            },
        },
    },
    modal,
} as const;

export { DataTestID };
