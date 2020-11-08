import { Subject } from 'rxjs'
import { linkToken, accessToken } from '../services/plaid'
import { transactionStore } from './transactions'
import { accountStore } from './accounts'
const subject = new Subject();

const initialState = {
    linkToken: "",//temporary token from plaid
    accessToken: "", //plaid persistent key for accessing sites; can be retrieved via unique ID from personal database (not hosted on plaid)
    uniqueId: "", //either from google, faceoobk, or (hopefully) dwolla
    processorToken: "", //to pass to dwolla
};

let state = initialState;

export const credentialStore = {
    init: () => subject.next(state),
    subscribe: setState => subject.subscribe(setState),
    sendLinkToken: id => {
        linkToken(id).then(({ link_token }) => {
            state = { ...state, linkToken: link_token }
            subject.next(state)
        }).catch(e => {
            console.log(e)
        })
    },

    sendAccessToken: (publicToken, accounts) => {
        accountStore.setAccounts(accounts)
        const accountId = accounts[0].id
        accessToken(publicToken, accountId).then(({ access_token: accessToken, processor_token: processorToken }) => {
            state = { ...state, accessToken, processorToken }
            transactionStore.getTransactions(accessToken)
            subject.next(state)
        }).catch(e => {
            console.log(e)
        })

    },
    sendUniqueID: uniqueId => {
        state = { ...state, uniqueId }
        subject.next(state)
    },
    initialState
}
