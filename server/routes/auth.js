var express = require('express');
var router = express.Router();

const users = [
    {
        username: "hugoalmeida2412@gmail.com",
        password: "12345678"
    }
]

router.post('/login', function (req, res) {
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
});

module.exports = router;
