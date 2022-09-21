const express = require('express')
const stock = require('./routes/stock')
const auth = require('./routes/auth')
const app = express()
const PORT = 3000

app.use(express.static('./public', {
    extensions: [ 'html', 'htm' ]
}));

app.use(express.json());
app.use('/auth', auth)
app.use('/stock', stock)

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/login.html")
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})