const user = JSON.parse(sessionStorage.getItem("user"));

$("#profile-profession").text(user.job);
$("#profile-username").text(user.username);
$("#profile-picture").attr("src", user.profile_picture);

$(".nav-link").toArray().forEach(e=>{
    if(e.textContent.trim() == "Administração"){
        if(!user.permissions.admin){
            e.remove()
        }
    };
})