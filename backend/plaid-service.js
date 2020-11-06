const express = require('express')
const app = express()
const port = 3000
const plaid = require('plaid')
const APP_NAME = 'Plat'
const { key: pKey, secret: pSecret } = require('./plaid-secrets.json')
const pClient = new plaid.Client({
    clientID: pKey,
    secret: pSecret,
    env: plaid.environments.sandbox,
});
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
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
    }).then(({ link_token }) => res.send({ link_token })).catch(e => res.send({ error: e.message }))
})


app.post('/access_token', (req, res) => {
    // Exchange the client-side public_token for a server access_token
    // Save the access_token and item_id to a persistent database
    //persist ID as well, from /link_token/:id so we can retrieve this
    pClient.exchangePublicToken(req.body.public_token)
        .then(({ access_token, item_id }) => res.send({ access_token })).catch(e => res.send({ error: e.message }))
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
                    res.send({ error: e.message })
                }
                console.log(e)
                //
            })
    }
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})