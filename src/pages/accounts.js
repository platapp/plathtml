import React, { useState, useEffect } from 'react'
import { credentialStore } from '../state/credentials'
import { dwollaLocationsStore } from '../state/dwollaLocations'
import PlaidAuth from '../components/plaid_auth'
import { DwollaLogin } from '../components/dwolla_login'
import { accountStore } from '../state/accounts'
import Button from '@material-ui/core/Button'

export const Accounts = () => {
    const [credentialState, setCredentialState] = useState(credentialStore.initialState)
    const [dwollaState, setDwollaState] = useState(dwollaLocationsStore.initialState)
    const [accountState, setAccountState] = useState(accountStore.initialState)

    useEffect(() => {
        credentialStore.subscribe(setCredentialState)
        dwollaLocationsStore.subscribe(setDwollaState)
        accountStore.subscribe(setAccountState)
    }, [])
    if (dwollaState.isWaiting) {
        return <p>waiting....</p>
    }
    else if (dwollaState.customerLocation === '') {
        return <DwollaLogin />
    }
    else if (credentialState.linkToken === '') {
        return <p>waiting....</p>
    }
    else if (credentialState.processorToken === '') {
        return <div>
            <PlaidAuth onSuccess={credentialStore.sendAccessToken} token={credentialState.linkToken} />

        </div>
    }
    else {
        return <p><Button onClick={() => dwollaLocationsStore.createFundingSource(
            dwollaState.customerLocation,
            credentialState.processorToken,
            accountState.accounts[0].name
        )}>Create Funding Source</Button>
            <p>This is funding source location: {dwollaState.fundingSourceLocation}</p>
        </p >
    }
}