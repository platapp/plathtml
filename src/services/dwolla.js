import { catchError } from './utils'
export const createCustomer = (first_name, last_name, email) => fetch('/customers', {
    method: 'POST',
    body: JSON.stringify({ first_name, last_name, email }),
    headers: {
        'Content-Type': 'application/json'
    },
}).then(catchError)

export const createFundingSource = (customer_location, processor_token, funding_source_name) => fetch('/funding_source', {
    method: 'POST',
    body: JSON.stringify({ customer_location, processor_token, funding_source_name }),
    headers: {
        'Content-Type': 'application/json'
    },
}).then(catchError)

