import { Subject } from 'rxjs'
import { transactions } from '../services/plaid'
const subject = new Subject();

const initialState = {
    transactions: []
};

let state = initialState;

export const transactionStore = {
    subscribe: setState => subject.subscribe(setState),
    getTransactions: accessToken => {
        transactions(accessToken).then(data => {
            if (data.error) {
                console.log(data.error)
            }
            else {
                state = { ...state, transactions: data.transactions }
                subject.next(state)
            }
        })
    },
    initialState
}
