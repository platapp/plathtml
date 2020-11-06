
export const accessToken = public_token => fetch('/access_token', {
    method: 'POST', body: JSON.stringify({ public_token }), headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
}).then(res => res.json())

export const linkToken = id => fetch(`/link_token/${id}`)
    .then(res => res.json())

export const transactions = token => fetch(`/transactions/${token}?start=2018-01-01&end=2020-09-01`)
    .then(res => res.json())