import {
    LineItemMap,
    ShopperCurrency as ShopperCurrencyType,
    StoreCurrency,
} from '@bigcommerce/checkout-sdk';
import React, { cloneElement, FunctionComponent, isValidElement, ReactNode } from 'react';

import { preventDefault } from '@bigcommerce/checkout/dom-utils';
import { TranslatedString } from '@bigcommerce/checkout/locale';
import { Button, IconCloseWithBorder } from '@bigcommerce/checkout/ui';

import { ShopperCurrency } from '../currency';
import { Modal, ModalHeader } from '../ui/modal';
import { isSmallScreen } from '../ui/responsive';

import OrderModalSummarySubheader from './OrderModalSummarySubheader';
import OrderSummaryItems from './OrderSummaryItems';
import OrderSummaryPrice from './OrderSummaryPrice';
import OrderSummarySection from './OrderSummarySection';
import OrderSummarySubtotals, { OrderSummarySubtotalsProps } from './OrderSummarySubtotals';
import OrderSummaryTotal from './OrderSummaryTotal';

export interface OrderSummaryDrawerProps {
    additionalLineItems?: ReactNode;
    items: LineItemMap;
    total: number;
    storeCurrency: StoreCurrency;
    shopperCurrency: ShopperCurrencyType;
    isOpen: boolean;
    headerLink?: ReactNode & React.HTMLProps<HTMLDivElement>;
    onRequestClose?(): void;
    onAfterOpen?(): void;
}

const OrderSummaryModal: FunctionComponent<
    OrderSummaryDrawerProps & OrderSummarySubtotalsProps
> = ({
    additionalLineItems,
    children,
    isTaxIncluded,
    taxes,
    onRequestClose,
    onAfterOpen,
    storeCurrency,
    shopperCurrency,
    isOpen,
    headerLink,
    items,
    total,
    ...orderSummarySubtotalsProps
}) => {
        const displayInclusiveTax = isTaxIncluded && taxes && taxes.length > 0;

        const subHeaderText = <OrderModalSummarySubheader
            amountWithCurrency={<ShopperCurrency amount={total} />}
            items={items}
            shopperCurrencyCode={shopperCurrency.code}
            storeCurrencyCode={storeCurrency.code}
        />;

        const continueButton = isSmallScreen() && <Button
            className='cart-modal-continue'
            data-test="manage-instrument-cancel-button"
            onClick={preventDefault(onRequestClose)}>
            <TranslatedString id="cart.return_to_checkout" />
        </Button>;

        return <Modal
            additionalBodyClassName="cart-modal-body optimizedCheckout-orderSummary"
            additionalHeaderClassName="cart-modal-header optimizedCheckout-orderSummary with-continue-button"
            additionalModalClassName="optimizedCheckout-cart-modal"
            footer={continueButton}
            header={renderHeader({
                headerLink,
                subHeaderText,
                onRequestClose,
            })}
            isOpen={isOpen}
            onAfterOpen={onAfterOpen}
            onRequestClose={onRequestClose}
        >
            <OrderSummarySection>
                <OrderSummaryItems displayLineItemsCount={false} items={items} />
            </OrderSummarySection>
            <OrderSummarySection>
                <OrderSummarySubtotals isTaxIncluded={isTaxIncluded} taxes={taxes} {...orderSummarySubtotalsProps} />
                {additionalLineItems}
            </OrderSummarySection>
            <OrderSummarySection>
                <div
                    style={{
                        backgroundColor: '#fffbe6',
                        border: '1px solid #ffe58f',
                        borderRadius: '0',
                        padding: '16px 20px',
                        margin: '20px auto',
                        maxWidth: '600px',
                        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                        color: '#614700',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        fontSize: '14px',
                        lineHeight: '1.6',
                    }}
                >
                    <strong style={{ display: 'block', fontSize: '16px', marginBottom: '8px' }}>
                        Important Notice
                    </strong>
                    To complete your order, you will need to submit the required credentials via email. Detailed instructions will be provided to you after checkout. If you do not send your credentials, your order will not be processed.
                    <div style={{ marginTop: '12px' }}>
                        <strong>Note:</strong> If your order includes <strong>ammunition</strong>, you must also include a scan or photo of a valid government-issued photo ID.
                    </div>
                </div>


                <OrderSummaryTotal
                    orderAmount={total}
                    shopperCurrencyCode={shopperCurrency.code}
                    storeCurrencyCode={storeCurrency.code}
                />
            </OrderSummarySection>
            {displayInclusiveTax && <OrderSummarySection>
                <h5
                    className="cart-taxItem cart-taxItem--subtotal optimizedCheckout-contentPrimary"
                    data-test="tax-text"
                >
                    <TranslatedString
                        id="tax.inclusive_label"
                    />
                </h5>
                {(taxes || []).map((tax, index) => (
                    <OrderSummaryPrice
                        amount={tax.amount}
                        key={index}
                        label={tax.name}
                        testId="cart-taxes"
                    />
                ))}
            </OrderSummarySection>}
        </Modal>
    };

const renderHeader: FunctionComponent<{
    headerLink?: ReactNode & React.HTMLProps<HTMLDivElement>;
    subHeaderText: ReactNode;
    onRequestClose?(): void;
}> = ({ onRequestClose, headerLink, subHeaderText }) => {
    let newHeaderLink;

    if (isValidElement(headerLink)) {
        newHeaderLink = cloneElement(headerLink, { className: 'modal-header-link cart-modal-link test' });
    }

    return <>
        {newHeaderLink ?? headerLink}
        <ModalHeader additionalClassName="cart-modal-title">
            <div>
                <TranslatedString id="cart.cart_heading" />
                <div className='cart-heading-subheader'>{subHeaderText}</div>
            </div>
        </ModalHeader>
        <a className="cart-modal-close" href="#" onClick={preventDefault(onRequestClose)}>
            <span className="is-srOnly">
                <TranslatedString id="common.close_action" />
            </span>
            <IconCloseWithBorder />
        </a>
    </>
};

export default OrderSummaryModal;
