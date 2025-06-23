import React, { useState, useEffect, useRef } from 'react';
import {
  Customer,
  Cart,
  CheckoutSelectors,
  ConsignmentsRequestBody,
  ConsignmentCreateRequestBody,
  Address,
  Consignment,
  CheckoutRequestBody

} from '@bigcommerce/checkout-sdk';
import { withCheckout } from '../checkout';
import { CheckoutContextProps } from '@bigcommerce/checkout/payment-integration-api';

import './CustomShippingStep.scss';
import PickupLocationSection from './PickupLocationSection';
import CustomFFLSection from './CustomFFLSection';
import FFLSelectorSection from './FFLSelectorSection';
import ManualAddressSection from './ManualAddressSection';
import ContinueButtonSection from './ContinueButtonSection';

export type FFL = {
  id: number;
  address: Address;
};

export interface WithCheckoutCustomShippingProps {
  cart: Cart;
  customer: Customer;
  consignments: Consignment[];
  createConsignments: (consignments: ConsignmentsRequestBody) => Promise<CheckoutSelectors>;
  selectConsignmentShippingOption: (consignmentId: string, shippingOptionId: string) => Promise<CheckoutSelectors>;
  updateCheckout(payload: CheckoutRequestBody): Promise<CheckoutSelectors>;

}

interface CustomShippingProps {
  onContinue: () => void;
}

const CustomShipping: React.FC<WithCheckoutCustomShippingProps & CustomShippingProps> = ({
  cart,
  customer,
  createConsignments,
  onContinue,
  selectConsignmentShippingOption,
}) => {
  const lineItemAllocations = useRef<{
    fflitems: { itemId: number | string; quantity: number }[];
    homeItems: { itemId: number | string; quantity: number }[];
  } | null>(null);

  // State only
  const [selectedFFL, setSelectedFFL] = useState<FFL | null>(null);
  const [validationError, setValidationError] = useState(false);
  const [pickupAtSS, setPickupAtSS] = useState<boolean>(true);
  const [fflLocations, setFFLLocations] = useState<FFL[] | null>(null);
  const [customFFL, setCustomFFL] = useState<boolean>(false);
  const [customFFLData, setCustomFFLData] = useState<any>({ company: '', phone: '' });
  const [homeAddress, setHomeAddress] = useState<Address>({
    firstName: '', lastName: '', company: '', address1: '', address2: '', city: '',
    stateOrProvince: '', stateOrProvinceCode: '', postalCode: '', country: '', countryCode: 'US',
    phone: '', customFields: [], shouldSaveAddress: false,
  });
  const [shootStraightLocations, setShootStraightLocations] = useState<FFL[]>([]);
  const [shootStraightIds, setShootStraightIds] = useState<number[]>([]);

  // Prefill home address if customer has saved addresses
  useEffect(() => {
    if (customer?.addresses && customer.addresses.length > 0) {
      const defaultAddress = customer.addresses[0];
      setHomeAddress({
        firstName: defaultAddress.firstName || '',
        lastName: defaultAddress.lastName || '',
        company: defaultAddress.company || '',
        address1: defaultAddress.address1 || '',
        address2: defaultAddress.address2 || '',
        city: defaultAddress.city || '',
        stateOrProvince: defaultAddress.stateOrProvince || '',
        stateOrProvinceCode: defaultAddress.stateOrProvinceCode || 'FL',
        postalCode: defaultAddress.postalCode || '',
        country: defaultAddress.country || '',
        countryCode: defaultAddress.countryCode || 'US',
        phone: defaultAddress.phone || '',
        customFields: defaultAddress.customFields || [],
        shouldSaveAddress: false,
      });
    }
  }, [customer?.addresses]);

  // Fetch Shoot Straight locations on mount
  useEffect(() => {
    const fetchShootStraightLocations = async () => {
      try {
        const response = await fetch('http://ffl.ssdinternationalinc.com/shootstraight');
        if (!response.ok) throw new Error('Failed to fetch Shoot Straight locations');
        const locations = await response.json();
        setShootStraightLocations(locations);
        // Extract and set the ids
        setShootStraightIds(locations.map((loc: FFL) => Number(loc.id)));
      } catch (error) {
        console.error('Error fetching Shoot Straight locations:', error);
        setShootStraightLocations([]);
        setShootStraightIds([]);
      }
    };
    fetchShootStraightLocations();
  }, []);

  const hasFirearms = cart.lineItems.physicalItems.some(item =>
    item.categoryNames?.includes('Firearms')
  );

  const showManualAddressInputs = cart.lineItems.physicalItems.some(
    item => !item.categoryNames?.includes('Firearms')
  ) && !pickupAtSS;



  useEffect(() => {
    lineItemAllocations.current = getFFLItemIDs(cart);
  }, [cart]);


  interface FflSearchParams {
    searchTerms: string;
    state: string;
  }

  const getFfls = async (params: FflSearchParams) => {
    try {
      const response = await fetch(`http://ffl.ssdinternationalinc.com/search?term=${encodeURIComponent(params.searchTerms)}&state=${params.state}`);
      if (!response.ok) throw new Error('Failed to fetch FFL locations');
      const locations = await response.json();
      setFFLLocations(locations);
    } catch (error) {
      console.error('Error fetching FFL locations:', error);
      setFFLLocations([]);  
    }


  }

  // Utility: Get empty required fields for validation
  const getEmptyRequiredFields = ({
    hasFirearms,
    pickupAtSS,
    customFFL,
    customFFLData,
    selectedFFL,
    homeAddress,
  }: {
    hasFirearms: boolean;
    pickupAtSS: boolean;
    customFFL: boolean;
    customFFLData: any;
    selectedFFL: FFL | null;
    homeAddress: Address;
  }) => {
    const requiredFields = [];
    const customFFLFields = [
      { label: 'FFL Business Name', value: customFFLData.company || '' },
      { label: 'FFL Phone Number', value: customFFLData.phone || '' },
    ];
    const fflFields = [
      { label: 'FFL First Name', value: selectedFFL?.address?.firstName || '' },
      { label: 'FFL Last Name', value: selectedFFL?.address?.lastName || '' },
      { label: 'FFL Address 1', value: selectedFFL?.address?.address1 || '' },
      { label: 'FFL City', value: selectedFFL?.address?.city || '' },
      { label: 'FFL State Code', value: selectedFFL?.address?.stateOrProvinceCode || '' },
      { label: 'FFL Postal Code', value: selectedFFL?.address?.postalCode || '' },
    ];
    const homeFields = [
      { label: 'Home First Name', value: homeAddress?.firstName },
      { label: 'Home Last Name', value: homeAddress?.lastName },
      { label: 'Home Address 1', value: homeAddress?.address1 },
      { label: 'Home City', value: homeAddress?.city },
      { label: 'Home State Code', value: homeAddress?.stateOrProvinceCode },
      { label: 'Home Postal Code', value: homeAddress?.postalCode },
    ];
    if (hasFirearms) requiredFields.push(...fflFields);
    if (!pickupAtSS) requiredFields.push(...homeFields);
    if (customFFL) requiredFields.push(...customFFLFields);
    return requiredFields.filter(field => !field.value.trim());
  };

  // Utility: Build consignments array
  const buildConsignments = ({
    pickupAtSS,
    selectedFFL,
    homeAddress,
    lineItemAllocations,
    hasFirearms,
  }: {
    pickupAtSS: boolean;
    selectedFFL: FFL | null;
    homeAddress: Address;
    lineItemAllocations: React.MutableRefObject<any>;
    hasFirearms: boolean;
  }): ConsignmentCreateRequestBody[] => {
    const consignments: ConsignmentCreateRequestBody[] = [];
    const fflItems = lineItemAllocations.current?.fflitems ?? [];
    const homeItems = lineItemAllocations.current?.homeItems ?? [];
    if (fflItems.length > 0 && selectedFFL) {
      const itemsToFFL = pickupAtSS ? [...fflItems, ...homeItems] : fflItems;
      consignments.push({
        address: { ...selectedFFL.address, customFields: [] },
        lineItems: itemsToFFL,
      });
    }
    if (homeItems.length > 0 && (!pickupAtSS || !hasFirearms)) {
      consignments.push({
        address: { ...homeAddress, customFields: homeAddress.customFields || [] },
        lineItems: homeItems,
      });
    }
    return consignments;
  };

  // Utility: Select shipping options for consignments
  const selectShippingOptionsForConsignments = async ({
    consignments,
    pickupAtSS,
    lineItemAllocations,
    selectConsignmentShippingOption,
  }: {
    consignments: Consignment[];
    pickupAtSS: boolean;
    lineItemAllocations: React.MutableRefObject<any>;
    selectConsignmentShippingOption: (consignmentId: string, shippingOptionId: string) => Promise<CheckoutSelectors>;
  }) => {
    for (const consignment of consignments) {
      const isFFL = consignment.lineItemIds.some(id =>
        lineItemAllocations.current?.fflitems?.some((item: any) => item.itemId === id)
      );

      const shipAmmoOptionId = consignment.availableShippingOptions?.find(
        (option) => option.description === "Ship Ammo"
      )?.id;

      const pickupAtSSOptionId = consignment.availableShippingOptions?.find(
        (option) => option.description === "In-Store Pickup"
      )?.id;

      const shipToFFLOptionId = consignment.availableShippingOptions?.find(
        (option) => option.description === "Ship to FFL"
      )?.id;

      const optionId = pickupAtSS
        ? String(pickupAtSSOptionId)
        : isFFL
          ? String(shipToFFLOptionId)
          : String(shipAmmoOptionId);


      if (typeof optionId === 'string') {
        await selectConsignmentShippingOption(consignment.id, optionId);
      } else {
        throw new Error('No valid shipping option ID found for consignment.');
      }
    }
  };

  // Validates and submits shipping selections
  const handleContinue = async () => {
    const emptyFields = getEmptyRequiredFields({
      hasFirearms,
      pickupAtSS,
      customFFL,
      customFFLData,
      selectedFFL,
      homeAddress,
    });
    if (emptyFields.length > 0) {
      setValidationError(true);
      return;
    }
    const consignments = buildConsignments({
      pickupAtSS,
      selectedFFL,
      homeAddress,
      lineItemAllocations,
      hasFirearms,
    });
    if (consignments.length === 0) return;
    try {
      const response = await createConsignments(consignments);
      const currentConsignments = response.data.getConsignments() ?? [];
      await selectShippingOptionsForConsignments({
        consignments: currentConsignments,
        pickupAtSS,
        lineItemAllocations,
        selectConsignmentShippingOption,
      });
      setValidationError(false);
      onContinue();
    } catch (error) {
      setValidationError(true);
    }
  };

  // UI logic for FFLSelectorSection
  const showFFLSelector = (
    (customFFL && pickupAtSS) ||
    (hasFirearms && pickupAtSS && !customFFL) ||
    (hasFirearms && !customFFL && !pickupAtSS) ||
    (pickupAtSS && !hasFirearms && !customFFL)
  );

  return (
    <div>
      <PickupLocationSection
        hasFirearms={hasFirearms}
        pickupAtSS={pickupAtSS}
        setPickupAtSS={setPickupAtSS}
        setCustomFFL={setCustomFFL}
        setSelectedFFL={setSelectedFFL}
      />

      <p className=''>{!hasFirearms && !pickupAtSS
        ? ''
        : pickupAtSS
          ? 'All products will be sent to your selected Shoot Straight location.'
          : 'Only firearms will be sent to your selected FFL.'}
      </p>

      <FFLSelectorSection
        show={showFFLSelector}
        fflLocations={fflLocations}
        selectedFFL={selectedFFL}
        setSelectedFFL={setSelectedFFL}
        setPickupAtSS={setPickupAtSS}
        shootStraightIds={shootStraightIds}
        pickupAtSS={pickupAtSS}
        shootStraightLocations={shootStraightLocations}
        getFfls={getFfls}
      />


      {!pickupAtSS && hasFirearms && (
        <CustomFFLSection
          customFFL={customFFL}
          setCustomFFL={setCustomFFL}
          customFFLData={customFFLData}
          setCustomFFLData={setCustomFFLData}
          setSelectedFFL={setSelectedFFL}
        />
      )}
      <ManualAddressSection
        hasFirearms={hasFirearms}
        show={showManualAddressInputs}
        homeAddress={homeAddress}
        setHomeAddress={setHomeAddress}
      />
      <ContinueButtonSection
        handleContinue={handleContinue}
        validationError={validationError}
      />
    </div>
  );
};

// Utility to get FFL and home item IDs from cart
const getFFLItemIDs = (cart: Cart) => {
  const fflItems = [];
  const homeItems = [];
  const lineItems = cart.lineItems.physicalItems;
  for (let i = 0; i < lineItems.length; i++) {
    const category = lineItems[i].categoryNames?.[0] ?? '';
    const id = lineItems[i].id ?? '';
    const quantity = lineItems[i].quantity;
    if (category === 'Firearms') {
      fflItems.push({ itemId: id, quantity });
    } else {
      homeItems.push({ itemId: id, quantity });
    }
  }
  return { fflitems: fflItems, homeItems };
};

export function mapToShippingProps({
  checkoutService,
  checkoutState,
}: CheckoutContextProps): WithCheckoutCustomShippingProps | null {
  const {
    data: { getCart, getCustomer, getConsignments },
  } = checkoutState;

  const cart = getCart();
  const customer = getCustomer();
  const consignments = getConsignments();

  return cart && customer
    ? {
      cart,
      customer,
      consignments: consignments ?? [],
      createConsignments: checkoutService.createConsignments,
      selectConsignmentShippingOption: checkoutService.selectConsignmentShippingOption,
      updateCheckout: checkoutService.updateCheckout,
    }
    : null;
}

export default withCheckout(mapToShippingProps)(CustomShipping);
