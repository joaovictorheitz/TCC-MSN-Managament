$("#img-input").change(function () {
    var input = this;
    var url = $(this).val();
    if (url == "") return;
    var ext = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
    if (
      input.files &&
      input.files[0] &&
      (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")
    ) {
      var reader = new FileReader();
  
      reader.onload = function (e) {
        $("#product-img").attr("src", e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      $("#product-img").attr("src", "/assets/no_preview.png");
    }
  });