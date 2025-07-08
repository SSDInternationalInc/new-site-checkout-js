import React from "react";
import StateSelect from "./StateSelect";
import { Address } from "@bigcommerce/checkout-sdk";
import "./CustomAddressForm.scss"

interface CustomAddressFormProps {
    hasFirearms: boolean;
    savedAddress: Address;
    formState: Address;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

const CustomAddressForm: React.FC<CustomAddressFormProps> = ({ hasFirearms, handleInputChange, formState }) => {
    return (
        <>
            <div className='CustomFormContainer'>
                <h2 className='customShippingSectionHeader'> {hasFirearms ? 'Additional ' : ''} Shipping Address</h2>
                <p className=''>This address will be used for any non-firearm products.</p>


                <div className="formRow">


                    <div className="customFormGroup">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            className='customFormInput'
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="First Name"
                            value={formState.firstName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="customFormGroup">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            className='customFormInput'
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Last Name"
                            value={formState.lastName}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>


                <div className="customFormGroup">
                    <label htmlFor="address1">Address 1</label>
                    <input
                        className='customFormInput'
                        type="text"
                        name="address1"
                        id="address1"
                        placeholder="Address 1"
                        value={formState.address1}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="customFormGroup">
                    <label htmlFor="address2">Address 2</label>
                    <input
                        className='customFormInput'
                        type="text"
                        name="address2"
                        id="address2"
                        placeholder="Address 2"
                        value={formState.address2}
                        onChange={handleInputChange}
                    />
                </div>


                <div className="customFormGroup">
                    <label htmlFor="company">Company</label>
                    <input
                        className='customFormInput'
                        type="text"
                        name="company"
                        id="company"
                        placeholder="Company"
                        value={formState.company}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="customFormGroup">
                    <label htmlFor="city">City</label>
                    <input
                        className='customFormInput'
                        type="text"
                        name="city"
                        id="city"
                        placeholder="City"
                        value={formState.city}
                        onChange={handleInputChange}
                    />
                </div>


                <div className="formRow">

                    <div className="customFormGroup">
                        <label htmlFor="stateOrProvinceCode">State</label>
                        <StateSelect
                            name="stateOrProvinceCode"
                            id="stateOrProvinceCode"
                            value={formState.stateOrProvinceCode}
                            onChange={handleInputChange}
                        />
                    </div>


                    <div className="customFormGroup">
                        <label htmlFor="postalCode">Postal Code</label>
                        <input
                            className='customFormInput'
                            type="text"
                            name="postalCode"
                            id="postalCode"
                            placeholder="Postal Code"
                            value={formState.postalCode}
                            onChange={handleInputChange}
                        />
                    </div>

                </div>


            </div>

        </>
    )
}

export default CustomAddressForm;