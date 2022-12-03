const togglePassElement = document.querySelector("#toggle-pass");
const passwordElement = document.querySelector("#password");
const form = document.getElementById("inp-form");

function togglePass() {
  if (passwordElement.type == "password") {
    passwordElement.type = "text";
    $("#toggle-pass img").attr("src", "/assets/hide.svg");
  } else {
    passwordElement.type = "password";
    $("#toggle-pass img").attr("src", "/assets/reveal.svg");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let emailValue, passwordValue;

  emailValue = $("#email").val();
  passwordValue = $("#password").val();

  fetch("/auth/signin", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email: emailValue, password: passwordValue }),
  }).then((r) =>
    r.json().then((authRes) => {
      if (authRes.userExists) {
        $("#user-err").slideUp();
        if (authRes.passwordMatches) {
          $("#pass-err").slideUp();
          // if(confirm('logar?')){
          window.location = window.location.origin + "/home";
          // }
        } else {
          $("#pass-err").slideDown();
        }
      } else {
        $("#user-err").slideDown();
      }
    })
  );
});

$("input").on("input", (e) => {
  let isEmpty = e.target.value == "";

  if (!isEmpty) {
    $(e.target.parentElement.children[1]).addClass("not-empty");
  } else {
    $(e.target.parentElement.children[1]).removeClass("not-empty");
  }
});
