import { Subject } from 'rxjs'

const subject = new Subject();

const initialState = {
    linkToken: "",//temporary token from plaid
    accessToken: "", //plaid persistent key for accessing sites; can be retrieved via unique ID from personal database (not hosted on plaid)
    uniqueId: "", //either from google, faceoobk, or (hopefully) dwolla
};

let state = initialState;

export const credentialStore = {
    init: () => subject.next(state),
    subscribe: setState => subject.subscribe(setState),
    sendLinkToken: id => {
        fetch(`/link_token/${id}`).then(res => res.json()).then(data => {
            if (data.error) {
                console.log(data.error)
            }
            else {
                state = { ...state, linkToken: data.link_token }
                subject.next(state)
            }

        })
    },
    sendAccessToken: accessToken => {
        state = { ...state, accessToken }
        subject.next(state)
    },
    sendUniqueID: uniqueId => {
        state = { ...state, uniqueId }
        subject.next(state)
    },
    initialState
}
