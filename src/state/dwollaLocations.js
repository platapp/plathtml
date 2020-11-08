import { Subject } from 'rxjs'
import { createCustomer, createFundingSource } from '../services/dwolla'
import { credentialStore } from './credentials'
const subject = new Subject();

const initialState = {
    customerLocation: "",//from dwolla
    fundingSourceLocation: "", //from dwolla
    customerId: "",
    isWaiting: false,
};

let state = initialState;

export const dwollaLocationsStore = {
    init: () => subject.next(state),
    subscribe: setState => subject.subscribe(setState),
    createCustomer: ({ firstName, lastName, email }) => {
        state = { ...state, isWaiting: true }
        subject.next(state)
        createCustomer(firstName, lastName, email).then(({ location }) => {
            const customerId = location.replace("https://api-sandbox.dwolla.com/customers/", '')
            state = { ...state, customerLocation: location, customerId }
            subject.next(state)
            return credentialStore.sendLinkToken(customerId)
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            state = { ...state, isWaiting: false }
            subject.next(state)
        })
    },
    createFundingSource: ({ customerLocation, processorToken, fundingSourceName }) => {
        state = { ...state, isWaiting: true }
        subject.next(state)
        createFundingSource(customerLocation, processorToken, fundingSourceName).then(({ location }) => {
            state = { ...state, fundingSourceLocation: location }
            subject.next(state)
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            state = { ...state, isWaiting: false }
            subject.next(state)
        })
    },
    initialState
}
