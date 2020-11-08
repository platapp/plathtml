import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { dwollaLocationsStore } from '../state/dwollaLocations'
export const DwollaLogin = () => {
    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    return <div>
        <TextField label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
        <TextField label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Button onClick={() => dwollaLocationsStore.createCustomer(firstName, lastName, email)}>Submit</Button>
    </div>
}