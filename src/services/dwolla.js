import { catchError } from './utils'
export const createCustomer = (first_name, last_name, email) => fetch('/customer', {
    method: 'POST',
    body: JSON.stringify({ first_name, last_name, email }),
    headers: {
        'Content-Type': 'application/json'
    },
}).then(catchError)


export const customerProperties = location => fetch('/customer/properties', {
    method: 'POST',
    body: JSON.stringify({ location }),
    headers: {
        'Content-Type': 'application/json'
    },
}).then(catchError)

export const fundingLocation = customerLocation => fetch('/funding/location', {
    method: 'POST',
    body: JSON.stringify({ location: customerLocation }),
    headers: {
        'Content-Type': 'application/json'
    },
}).then(catchError)


export const createFundingSource = (customer_location, processor_token, funding_source_name) => fetch('/funding', {
    method: 'POST',
    body: JSON.stringify({ customer_location, processor_token, funding_source_name }),
    headers: {
        'Content-Type': 'application/json'
    },
}).then(catchError)

