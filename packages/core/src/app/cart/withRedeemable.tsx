import React, { ComponentType, FunctionComponent } from 'react';

import { OrderSummaryProps, OrderSummarySubtotalsProps } from '../order';

import { WithCheckoutCartSummaryProps } from './CartSummary';
import mapToOrderSummarySubtotalsProps from './mapToOrderSummarySubtotalsProps';
import Redeemable from './Redeemable';

export default function withRedeemable(
    OriginalComponent: ComponentType<OrderSummaryProps & OrderSummarySubtotalsProps>,
): FunctionComponent<WithCheckoutCartSummaryProps & { headerLink?: any }> {
    return (props) => {
        const {
            checkout,
            storeCurrency,
            shopperCurrency,
            headerLink,
            onRemovedCoupon,
            onRemovedGiftCertificate,
            storeCreditAmount,
            isShippingDiscountDisplayEnabled,
            ...redeemableProps
        } = props;

        return (
            <OriginalComponent
                {...mapToOrderSummarySubtotalsProps(checkout, isShippingDiscountDisplayEnabled)}
                additionalLineItems={
                    <Redeemable
                        {...{
                            ...redeemableProps,
                            onRemovedCoupon,
                            onRemovedGiftCertificate,
                        }}
                    />
                }
                headerLink={headerLink}
                lineItems={checkout.cart.lineItems}
                onRemovedCoupon={onRemovedCoupon}
                onRemovedGiftCertificate={onRemovedGiftCertificate}
                shopperCurrency={shopperCurrency}
                storeCreditAmount={storeCreditAmount}
                storeCurrency={storeCurrency}
                total={checkout.outstandingBalance}
            />
        );
    };
}
