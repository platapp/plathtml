const express = require('express')
const app = express()
const port = 3000
const plaid = require('plaid')
const dwolla = require('dwolla-v2')
const APP_NAME = 'Plat'
const { key: pKey, secret: pSecret } = require('./plaid-secrets.json')
const { key: dKey, secret: dSecret } = require('./dwolla-secrets.json')
const pClient = new plaid.Client({
    clientID: pKey,
    secret: pSecret,
    env: plaid.environments.sandbox,
});

const URL = 'https://api-sandbox.dwolla.com/'
const environment = 'sandbox' //todo!! add as env 
// Navigate to https://dashboard.dwolla.com/applications (production) or https://dashboard-sandbox.dwolla.com/applications (Sandbox) for your application key and secret.
const dClient = new dwolla.Client({
    key: dKey,
    secret: dSecret,
    environment
});



app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.post('/customers', (req, res) => {
    const { first_name: firstName, last_name: lastName, email } = req.body
    const requestBody = {
        firstName, lastName, email, type: 'receive-only'
    }
    dClient.auth.client()
        .then(appToken => appToken.post('customers', requestBody))
        .then(res => res.headers.get('location'))
        .then(location => res.send({ location }))
        .catch(error => {
            try {
                //do this if already exists, to get the location
                const parsedError = JSON.parse(error.message)
                const location = parsedError._embedded.errors[0]._links.about.href
                res.send({ location })
            }
            catch (e) {
                throw new Error(error)
            }
        })
        .catch(error => res.status(401).send({ error: error.message }))
})

app.post('/funding_source', (req, res) => {
    const {
        customer_location: customerUrl,
        processor_token: processorToken,
        funding_source_name: fundingSourceName
    } = req.body
    const requestBody = {
        plaidToken: processorToken,
        name: fundingSourceName,
    }
    console.log(customerUrl)
    console.log(processorToken)
    console.log(fundingSourceName)
    //this will error if already exists
    dClient.auth.client().then(appToken => appToken
        .post(`${customerUrl}/funding-sources`, requestBody))
        .then((res) => res.headers.get("location"))
        .then(location => res.send({ location }))
        .catch(error => {
            console.log(error)
            try {
                //do this if already exists, to get the location
                const parsedError = JSON.parse(error.message)
                console.log(parsedError)
                const location = parsedError._embedded.errors[0]._links.about.href
                res.send({ location })
            }
            catch (e) {
                throw new Error(error)
            }
        }).catch(e => res.status(401).send({ error: e.message }))
})

//todo!  get id from an auth provider (google, facebook...or preferably Dwolla)
app.get('/link_token/:id', (req, res) => {
    const { id } = req.params
    pClient.createLinkToken({
        user: {
            client_user_id: id, //could be dwolla customer location
        },
        client_name: APP_NAME,
        products: ['auth'],
        country_codes: ['US'],
        language: 'en',
        //this will send events like whether transactions are ready to be queried
        //in production this will likely be a lambda/FaaS that communicates with html app
        webhook: 'https://b4e70a0b76898f618b20b138ad6755be.m.pipedream.net',
    }).then(({ link_token }) => res.send({ link_token })).catch(e => res.status(401).send({ error: e.message }))
})


app.post('/access_token', (req, res) => {
    // Exchange the client-side public_token for a server access_token
    // Save the access_token and item_id to a persistent database
    //persist ID as well, from /link_token/:id so we can retrieve this
    const { public_token: publicToken, account_id: accountId } = req.body
    pClient.exchangePublicToken(publicToken)
        .then(({ access_token, item_id }) => {
            return pClient.createProcessorToken(access_token, accountId, 'dwolla')
                .then(({ processor_token }) => res.send({ access_token, processor_token }))
        })
        .catch(e => res.status(401).send({ error: e.message }))
})

app.get('/transactions/:token', async (req, res) => {
    const accessToken = req.params.token
    const start = req.query.start
    const end = req.query.end

    console.log(accessToken)
    console.log(start)
    console.log(end)
    let keepGoing = true
    while (keepGoing) {
        await pClient
            .getTransactions(accessToken, start, end, { count: 500 })
            .then(({ transactions }) => {
                keepGoing = false
                res.send({ transactions })
            })
            .catch(e => {
                //console.log(e.error_code)
                if (e.error_code !== 'PRODUCT_NOT_READY') {
                    console.log("stopping and sending error")
                    keepGoing = false
                    res.status(401).send({ error: e.message })
                }
                //console.log(e)
                //
            })
    }
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})