const togglePassElement = document.querySelector('#toggle-pass')
const passwordElement = document.querySelector('#password')
const form = document.getElementById('inp-form')

function togglePass() {
    if (passwordElement.type == "password") {
        passwordElement.type = "text"
        togglePassElement.textContent = "Ocultar senha"
    } else {
        passwordElement.type = 'password'
        togglePassElement.textContent = "Exibir senha"
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()


    let usernameValue, passwordValue

    usernameValue = $('#user').val()
    passwordValue = $('#password').val()

    fetch('http://localhost:3000/auth/login', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ username: usernameValue, password: passwordValue })
    }).then(
        r => r.json().then(
            authRes => {
                if (authRes.userExists) {
                    if (authRes.passwordMatches) {
                        console.log('logado');
                        // if(confirm('logar?')){
                            window.location = window.location.origin + '/html/home.html'
                        // }
                    }
                    else {
                        console.log('senha errada');
                    }
                }
                else {
                    console.log('usuario inexistente');
                }
            }
        )
    )

})