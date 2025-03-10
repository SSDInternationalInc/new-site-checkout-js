import { Formik } from 'formik';
import { noop } from 'lodash';
import React from 'react';

import { createLocaleContext, LocaleContext, LocaleContextType } from '@bigcommerce/checkout/locale';
import { CreditCardFieldsetValues } from '@bigcommerce/checkout/payment-integration-api';
import { render, screen } from '@bigcommerce/checkout/test-utils'

import { getStoreConfig } from '../../config/config.mock';

import CreditCardFieldset from './CreditCardFieldset';

describe('CreditCardFieldset', () => {
    let initialValues: CreditCardFieldsetValues;
    let localeContext: LocaleContextType;

    beforeEach(() => {
        initialValues = {
            ccCustomerCode: '',
            ccCvv: '',
            ccExpiry: '',
            ccName: '',
            ccNumber: '',
        };

        localeContext = createLocaleContext(getStoreConfig());
    });

    it('shows card code field when configured', () => {
        render(
            <LocaleContext.Provider value={localeContext}>
                <Formik initialValues={initialValues} onSubmit={noop}>
                    <CreditCardFieldset shouldShowCardCodeField={true} shouldShowCustomerCodeField={true}/>
                </Formik>
            </LocaleContext.Provider>,
        );

        screen.debug();

        expect(screen.getByRole('textbox', { name: 'Credit Card Number' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Expiration' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Name on Card' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'CVV' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Customer Code (Optional)' })).toBeInTheDocument();
    });
});
