const modal = {
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
    resetPassword: {
        modal: 'reset-password-modal',
        emailSent: {
            modal: 'reset-password-email-sent-modal',
            message: 'reset-password-email-sent-message',
        },
        form: {
            input: {
                email: 'reset-password-email-input',
                password: 'create-password-password-input',
                passwordConfirm: 'create-password-password-confirm-input',
            },
            submitButton: 'reset-password-submit-button',
        },
        message: 'reset-password-message-label',
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
        tidal: {
            plans: {
                recurrencySwitch: {
                    monthly: 'tidal-plan-recurrency-switch-monthly',
                    annual: 'tidal-plan-recurrency-switch-annual',
                },
                card: {
                    container: 'tidal-plan-card-container',
                    name: 'tidal-plan-card-plan-name-label',
                    price: 'tidal-plan-card-plan-price-label',
                    subscribeButton: 'tidal-plan-card-subscribe-button',
                    extension: 'tidal-plan-card-plan-extension-name-label',
                    benefit: 'tidal-plan-card-plan-benefit-label',
                    yearlyLabel: 'tidal-plan-card-plan-yearly-label',
                    links: {
                        limits: 'tidal-plan-card-link-limits',
                        brc: {
                            simple: 'tidal-plan-card-link-brc-simple',
                            related: 'tidal-plan-card-link-brc',
                        },
                        manage: 'tidal-plan-card-link-manage',
                    },
                },
            },
        },
        subscribe: {
            paymentInfo: {
                heading: 'payment-info-heading',
                price: 'payment-info-price',
                subscription: 'payment-info-subscription',
                subtotal: 'payment-info-subtotal',
                due: 'payment-info-due',
            },
            paymentForm: {
                input: {
                    savedCardIdx: 'form-saved-card-index',

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

                    termsCheckbox: 'form-terms-checkbox',
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
