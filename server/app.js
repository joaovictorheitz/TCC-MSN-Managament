const express = require('express')
const app = express()
const PORT = 3000

app.use(express.static('./public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/login.html")
})

const users = [
    {
        username: "hugoalmeida2412@gmail.com",
        password: "12345678"
    }
]

app.post('/auth/login', (req, res) => {
    const userData = req.body

    let userAuth = {
        userExists: false,
        passwordMatches: false,
    }

    users.every(user => {
        if (user.username == userData.username) {
            userAuth.userExists = true;
            if (user.password == userData.password) {
                userAuth.passwordMatches = true
            }
            return
        }
    })

    res.send(userAuth)
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})