import { Subject } from 'rxjs'
import { transactions } from '../services/plaid'
const subject = new Subject();

const initialState = {
    transactions: [],
    isFetching: false,
    noRequests: true
};

let state = initialState;

export const transactionStore = {
    subscribe: setState => subject.subscribe(setState),
    getTransactions: accessToken => {
        state = { ...state, isFetching: true, noRequests: false }
        subject.next(state)
        transactions(accessToken).then(data => {
            console.log("got respond from transactions")
            console.log(data)
            state = { ...state, isFetching: false }
            if (data.error) {
                console.log(data.error)
                subject.next(state)
            }
            else {

                state = { ...state, transactions: data.transactions.map(v => ({ ...v, id: v.transaction_id })) }
                subject.next(state)
            }
        })
    },
    initialState
}
