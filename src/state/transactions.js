import { Subject } from 'rxjs'

const subject = new Subject();

const initialState = {
    accessToken: "", //plaid persistent key for accessing sites; can be retrieved via unique ID from personal database (not hosted on plaid)
    uniqueId: "", //either from google, faceoobk, or (hopefully) dwolla
};

let state = initialState;

export const credentialStore = {
    init: () => subject.next(state),
    subscribe: setState => subject.subscribe(setState),
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
