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
    console.log(error)
    return (
        <Button onClick={() => open()} disabled={!ready || error}>
            Connect a bank account
        </Button>
    )
}
export default PlaidAuth
/*
export const linkHandler = (token, callback) => window.Plaid.create({
    token, //get from /link_token/:id
    onSuccess: (public_token, metadata) => {
        // Send the public_token to your app server.
        callback(public_token, metadata)
    },
    onExit: (err, metadata) => {
        // Optionally capture when your user exited the Link flow.
        // Storing this information can be helpful for support.
    },
    onEvent: (eventName, metadata) => {
        // Optionally capture Link flow events, streamed through
        // this callback as your users connect an Item to Plaid.
    },
});
*/