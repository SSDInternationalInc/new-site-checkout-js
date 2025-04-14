import { StoreConfig } from '@bigcommerce/checkout-sdk';

export function getStoreConfig(): StoreConfig {
    return {
        cdnPath: 'https://cdn.bcapp.dev/rHEAD',
        inputDateFormat: 'dd/MM/yyyy',
        displayDateFormat: 'dd/MM/yyyy',
        formFields: {
            shippingAddress: [],
            billingAddress: [],
            customerAccount: [],
        },
        checkoutSettings: {
            checkoutBillingSameAsShippingEnabled: true,
            checkoutUserExperienceSettings: {
                walletButtonsOnTop: false,
                floatingLabelEnabled: false,
            },
            enableOrderComments: true,
            enableTermsAndConditions: false,
            googleRecaptchaSitekey: 'sitekey',
            googleMapsApiKey: '',
            hasMultiShippingEnabled: true,
            guestCheckoutEnabled: true,
            isAnalyticsEnabled: true,
            isAccountCreationEnabled: true,
            isCardVaultingEnabled: true,
            isExpressPrivacyPolicy: false,
            isPaymentRequestEnabled: false,
            isPaymentRequestCanMakePaymentEnabled: false,
            isSpamProtectionEnabled: false,
            isStorefrontSpamProtectionEnabled: false,
            isCouponCodeCollapsed: true,
            isTrustedShippingAddressEnabled: true,
            isSignInEmailEnabled: false,
            orderTermsAndConditions: '',
            orderTermsAndConditionsLink: '',
            orderTermsAndConditionsType: '',
            privacyPolicyUrl: '',
            providerWithCustomCheckout: null,
            shippingQuoteFailedMessage: `Unfortunately one or more items in your cart can't be shipped to your \
            location.Please choose a different delivery address.`,
            realtimeShippingProviders: ['Fedex', 'UPS', 'USPS'],
            requiresMarketingConsent: false,
            features: {},
            remoteCheckoutProviders: [],
            shouldRedirectToStorefrontForAuth: false,
        },
        currency: {
            code: 'USD',
            decimalPlaces: '2',
            decimalSeparator: '.',
            symbolLocation: 'left',
            symbol: '$',
            thousandsSeparator: ',',
        },
        links: {
            cartLink: 'https://store-k1drp8k8.bcapp.dev/cart.php',
            checkoutLink: 'https://store-k1drp8k8.bcapp.dev/checkout',
            createAccountLink: 'https://store-k1drp8k8.bcapp.dev/login.php?action=create_account',
            forgotPasswordLink: 'https://store-k1drp8k8.bcapp.dev/login.php?action=reset_password',
            loginLink: 'https://store-k1drp8k8.bcapp.dev/login.php',
            logoutLink: 'https://store-k1drp8k8.bcapp.dev/login.php?action=logout',
            siteLink: 'https://store-k1drp8k8.bcapp.dev',
            orderConfirmationLink: 'https://store-k1drp8k8.bcapp.dev/checkout/order-confirmation',
        },
        paymentSettings: {
            bigpayBaseUrl: 'https://bigpay.integration.zone',
            clientSidePaymentProviders: [
                'migs',
                'eway',
                'securenet',
                'usaepay',
                'elavon',
                'hps',
                'quickbooks',
                'orbital',
                'stripe',
                'authorizenet',
                'firstdatae4v14',
                'nmi',
                'braintree',
                'braintreepaypal',
                'paypal',
                'sagepay',
                'squarev2',
                'afterpay',
                'vantiv',
            ],
        },
        shopperConfig: {
            defaultNewsletterSignup: false,
            passwordRequirements: {
                alpha: '/[A-Za-z]/',
                numeric: '/[0-9]/',
                minlength: 7,
                error: 'Passwords must be at least 7 characters and contain both alphabetic and numeric characters.',
            },
            showNewsletterSignup: true,
        },
        storeProfile: {
            orderEmail: 's1504098821@example.com',
            shopPath: 'https://store-k1drp8k8.bcapp.dev',
            storeCountry: 'United States',
            storeCountryCode: 'US',
            storeHash: 'k1drp8k8',
            storeId: '1504098821',
            storeName: 's1504098821',
            storePhoneNumber: '987654321',
            storeLanguage: 'en_US',
        },
        imageDirectory: 'product_images',
        isAngularDebuggingEnabled: false,
        shopperCurrency: {
            code: 'USD',
            symbolLocation: 'left',
            symbol: '$',
            decimalPlaces: '2',
            decimalSeparator: '.',
            isTransactional: true,
            thousandsSeparator: ',',
            exchangeRate: 1.12,
        },
        displaySettings: {
            hidePriceFromGuests: false,
        },
    };
}
