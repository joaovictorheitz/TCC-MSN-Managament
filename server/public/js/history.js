$(".toggle-items").on("click", (e) => {
    $(e.target).siblings().toArray().forEach(element=>{
        if(element.classList.contains("items-info")){
            $(element).fadeIn('fast')
            $("#blur").fadeIn('fast')
    }
  })

});

$("#blur").on('click', ()=>{
    $(".items-info").fadeOut('fast')
    $("#blur").fadeOut('fast')
})