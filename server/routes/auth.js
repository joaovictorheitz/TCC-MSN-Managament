var express = require('express');
var router = express.Router();
// var db = require("./db")

const users = [
    {
        username: "hugoalmeida2412@gmail.com",
        password: "12345678"
    }
]

router.post('/login', async function (req, res) {

    // const users = await db.selectUser()

    const userData = req.body

    let userAuth = {
        userExists: false,
        passwordMatches: false,
    }

    users.forEach(user => {
        if (user.username == userData.username) {
            userAuth.userExists = true;
            if (user.password == userData.password) {
                userAuth.passwordMatches = true
            }
            return
        }
    })

    res.send(userAuth)
});

module.exports = router;