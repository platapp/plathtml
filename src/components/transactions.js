import React, { useState, useEffect } from 'react'
import { transactionStore } from '../state/transactions'
import { credentialStore } from '../state/credentials'
export const Transactions = () => {
    const [transactionState, setTransactions] = useState(transactionStore.initialState)
    const [credentialState, setCredentials] = useState(credentialStore.initialState)

    useEffect(() => {
        //const tmpId = 5//arbitrary, in future will be google ID or (preferably) dwolla id
        transactionStore.subscribe(setTransactions)
        credentialStore.subscribe(setCredentials)
        //credentialStore.sendLinkToken(tmpId)
    }, [])
    if (credentialState.accessToken === "" || credentialState.accessToken === undefined) {
        return <p>hello</p>
    }
    else if (transactionState.transactions.length === 0) {
        console.log(credentialState.accessToken)
        transactionStore.getTransactions(credentialState.accessToken)
        return <p>waiting....</p>
    }
    else {
        return <ul>
            {transactionState.transactions.map(t => <li key={t}>t</li>)}
        </ul>
    }
}