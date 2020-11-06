
export const linkHandler = (token, callback) => window.Plaid.create({
    token, //get from /link_token/:id
    onSuccess: (public_token, metadata) => {
        // Send the public_token to your app server.
        callback(public_token)
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
