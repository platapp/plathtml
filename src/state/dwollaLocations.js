import { Subject } from 'rxjs'
import { createCustomer, createFundingSource } from '../services/dwolla'
import { credentialStore } from './credentials'
const subject = new Subject();

const initialState = {
    customerLocation: "",//from dwolla
    fundingSourceLocation: "", //from dwolla
    isWaiting: false,
}

let state = initialState;


//do I even need this or can I directly get from the response?
//TODO extract into constant 

export const dwollaLocationsStore = {
    init: () => subject.next(state),
    subscribe: setState => subject.subscribe(setState),

    createCustomer: (firstName, lastName, email) => {
        state = { ...state, isWaiting: true }
        subject.next(state)
        createCustomer(firstName, lastName, email).then(({ location }) => {
            state = { ...state, customerLocation: location }
            subject.next(state)
            return credentialStore.sendLinkToken(location)
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            state = { ...state, isWaiting: false }
            subject.next(state)
        })
    },
    createFundingSource: (customerLocation, processorToken, fundingSourceName) => {
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
