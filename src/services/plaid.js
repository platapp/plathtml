import { catchError } from './utils'

export const accessToken = (public_token, account_id) => fetch('/access_token', {
    method: 'POST',
    body: JSON.stringify({ public_token, account_id }),
    headers: {
        'Content-Type': 'application/json'
    },
}).then(catchError)

export const linkToken = id => fetch(`/link_token/${id}`)
    .then(catchError)

//TODO!  Fix dates
export const transactions = token => fetch(`/transactions/${token}?start=2018-01-01&end=2020-09-01`)
    .then(catchError)