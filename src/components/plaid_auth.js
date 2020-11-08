import React, { useCallback } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import Button from '@material-ui/core/Button'
const PlaidAuth = ({ onSuccess, token }) => {
    const onSuccessLocal = useCallback((token, metadata) => onSuccess(token, metadata.accounts), [onSuccess]);

    const config = {
        token,
        onSuccess: onSuccessLocal,
        // ...
    }

    const { open, ready, error } = usePlaidLink(config)
    return (
        <Button onClick={() => open()} disabled={!ready || error}>
            Connect a bank account
        </Button>
    )
}
export default PlaidAuth