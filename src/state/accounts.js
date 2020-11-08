import { Subject } from 'rxjs'

const subject = new Subject();

const initialState = {
    accounts: [],
};

let state = initialState;

export const accountStore = {
    init: () => subject.next(state),
    subscribe: setState => subject.subscribe(setState),
    setAccounts: accounts => {
        state = { ...state, accounts }
        subject.next(state)
    },
    initialState
}
