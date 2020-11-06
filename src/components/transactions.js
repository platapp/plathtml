import React, { useState, useEffect } from 'react'
import { transactionStore } from '../state/transactions'
import { credentialStore } from '../state/credentials'
import { DataGrid } from '@material-ui/data-grid'
import Button from '@material-ui/core/Button'

/**<ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="comments">
                <CommentIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem> */

const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'date', headerName: 'Date' },
    { field: 'name', headerName: 'Name' },
]
export const Transactions = () => {
    const [transactionState, setTransactions] = useState(transactionStore.initialState)
    const [credentialState, setCredentials] = useState(credentialStore.initialState)

    useEffect(() => {
        //const tmpId = 5//arbitrary, in future will be google ID or (preferably) dwolla id
        transactionStore.subscribe(setTransactions)
        credentialStore.subscribe(setCredentials)
        //credentialStore.sendLinkToken(tmpId)
    }, [])
    /*if (credentialState.accessToken === "" || credentialState.accessToken === undefined) {
        return <p>hello</p>
    }*/
    if (transactionState.noRequests) {
        return <p>hello, sign in to see transactions</p>
    }
    else if (transactionState.isFetching) {
        console.log("is fetching")
        return <p>waiting....</p>
    }
    else if (transactionState.transactions.length === 0) {
        return <div><Button color="primary" onClick={() => transactionStore.getTransactions(credentialState.accessToken)}>Refresh</Button>
            <p>No transactions! </p></div>
    }
    else {
        console.log(transactionState.transactions)
        return <div><DataGrid rows={transactionState.transactions} columns={columns} pageSize={5} checkboxSelection />
            <Button color="primary" onClick={() => transactionStore.getTransactions(credentialState.accessToken)}>Refresh</Button>
        </div>
    }
}