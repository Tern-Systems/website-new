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
    cancelSubscription: {
        modal: 'cancel-subscription-modal',
        submitButton: 'cancel-subscription-submit-button',
    },
    exportHistory: {
        modal: 'export-invoice-history-modal',
        rangeSelect: 'export-invoice-history-range-select',
        exportButton: 'export-invoice-history-export-button',
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
                    savedCardIdx: 'form-saved-card-idx',

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
        profile: {
            page: {
                section: {
                    account: {
                        twoFA: {
                            toggle: 'profile-section-account-2fa-toggle',
                            input: 'profile-section-account-2fa-input',
                        },
                    },
                },
            },
            billing: {
                page: {
                    invoice: {
                        row: 'billing-invoice-table-row',
                        id: 'billing-invoice-table-row-id',
                        date: 'billing-invoice-table-row-date',
                        price: 'billing-invoice-table-row-price',
                        status: 'billing-invoice-table-row-status',
                        name: 'billing-invoice-table-row-name',
                    },
                },
                manageSubscription: {
                    subscriptionIdxSelect: 'manage-subscription-subscription-select',
                    info: {
                        currentPlan: {
                            cancel: {
                                toggle: 'manage-subscription-cancel-toggle',
                                modal: modal.cancelSubscription,
                            },
                            details: {
                                block: 'manage-subscription-details-block',
                                toggle: 'manage-subscription-details-toggle',
                            },
                        },
                        paymentMethod: {
                            entry: {
                                row: 'manage-subscription-payment-entry-row',
                                nickname: 'manage-subscription-payment-entry-nickname',
                            },
                        },
                    },
                },
                purchasingInformation: {
                    page: {
                        savedCards: {
                            addButton: 'purchasing-info-add-payment-method-button',
                            editButton: 'purchasing-info-add-payment-method-button',
                            entry: {
                                nickname: 'purchasing-info-saved-card-nickname',
                                preferred: 'purchasing-info-saved-card-preferred',
                            },
                            noEntries: 'purchasing-info-no-saved-cards',
                        },
                        billing: {
                            name: 'purchasing-info-billing-name',
                            address: 'purchasing-info-billing-address',
                        },
                        history: {
                            exporting: {
                                toggle: 'purchasing-info-invoice-history-export-toggle',
                                modal: modal.exportHistory,
                            },
                            entry: {
                                row: 'purchasing-info-invoice-history-entry-row',
                                id: 'purchasing-info-invoice-history-entry-id',
                                date: 'purchasing-info-invoice-history-entry-date',
                                price: 'purchasing-info-invoice-history-entry-price',
                                status: 'purchasing-info-invoice-history-entry-status',
                                card: 'purchasing-info-invoice-history-entry-card',
                                plan: 'purchasing-info-invoice-history-entry-plan',
                            },
                        },
                    },
                    paymentMethodTool: {
                        form: {
                            input: {
                                cardSelect: 'payment-method-tool-card-select',
                                cardNumber: 'payment-method-tool-card-number-input',
                                expirationDate: 'payment-method-tool-expiration-date-input',
                                cvc: 'payment-method-tool-cvc-input',
                                nickname: 'payment-method-tool-nickname-input',
                                cardholderName: 'payment-method-tool-fullName-input',
                                addressLine1: 'payment-method-tool-address-1-input',
                                addressLine2: 'payment-method-tool-address-2-input',
                                city: 'payment-method-tool-city-input',
                                state: 'payment-method-tool-state-input',
                                zip: 'payment-method-tool-zip-input',
                                country: 'payment-method-tool-country-input',
                                preferredCheckbox: 'payment-method-tool-preferred-checkbox',
                            },
                            submitButton: 'payment-method-tool-submit-button',
                        },
                        successModal: 'payment-method-tool-success-modal',
                        errorModal: 'payment-method-tool-error-modal',
                        removeCard: {
                            toggle: 'payment-method-tool-remove-card-toggle',
                            modal: 'payment-method-tool-remove-card-modal',
                            submitButton: 'payment-method-tool-remove-card-button',
                        },
                    },
                },
            },
        },
    },
    modal,
} as const;

export { DataTestID };
