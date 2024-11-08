import React, { createContext, useState } from 'react';

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);

    const updateCustomerData = (updatedCustomer) => {
        setCustomer(updatedCustomer);
    };

    return (
        <CustomerContext.Provider value={{ customer, updateCustomerData }}>
            {children}
        </CustomerContext.Provider>
    );
};
