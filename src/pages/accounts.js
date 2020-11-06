import React, { useState, useEffect } from 'react'
import { credentialStore } from '../state/credentials'
import { linkHandler } from '../components/plaid_auth'
import Button from '@material-ui/core/Button'

export const Accounts = () => {
    const [credentialState, setCredentialState] = useState(credentialStore.initialState)

    useEffect(() => {
        const tmpId = 5//arbitrary, in future will be google ID or (preferably) dwolla id
        credentialStore.subscribe(setCredentialState)
        credentialStore.sendLinkToken(tmpId)
    }, [])
    if (credentialState.linkToken === '') {
        return <p>waiting....</p>
    }
    else {
        const linkHandlerInst = linkHandler(credentialState.linkToken, credentialStore.sendAccessToken)
        return <p>
            <Button color="primary" onClick={() => linkHandlerInst.open()}>Set accounts</Button>
        </p>
    }
}