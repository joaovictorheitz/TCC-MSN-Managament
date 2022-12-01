$("#product-title").on("input", (e) => {
  $("#product-name").text($(e.target).val());
});

function title(str = "") {
  let str_arr = str.split(" ");
  let result_arr = [];

  str_arr.forEach((string) => {
    result_arr.push(string[0].toUpperCase() + string.slice(1, string.length));
  });

  return result_arr.join(" ");
}

$("#img-input").change(function () {
  var input = this;
  var url = $(this).val();

  if (url == "") return;

  if ($("#product-title").val() == "") {
    $("#product-title").val(title(input.files[0].name.split(".")[0]));
    $("#product-name").text($("#product-title").val());
  }

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
    $("#product-img").attr("src", "/assets/logo.png");
  }

  if (ext == "png") {
    $("#product-img").css("object-fit", "contain");
    $("#product-img").css("padding", "1rem");
  } else {
    $("#product-img").css("object-fit", "cover");
    $("#product-img").css("padding", "0");
  }
});
