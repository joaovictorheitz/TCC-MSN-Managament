const productId = window.location.pathname.split("/").pop();

$("#img-input").change(function () {
  var input = this;
  var url = $(this).val();
  if (url == "") return;
  var ext = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
  if (
    input.files &&
    input.files[0] &&
    (ext == "gif" ||
      ext == "png" ||
      ext == "jpeg" ||
      ext == "jpg" ||
      ext == "webp")
  ) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#product-img").attr("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    $("#product-img").attr("src", "/assets/no_preview.png");
  }

  if (ext == "png") {
    $("#product-img").css("object-fit", "contain");
    $("#product-img").css("padding", "1rem");
  } else {
    $("#product-img").css("object-fit", "cover");
    $("#product-img").css("padding", "0");
  }

  var data = new FormData();
  data.append("file", input.files[0]);

  fetch(`/files/products/${window.location.pathname.split("/")[2]}`, {
    method: "POST",
    body: data,
  });
});

let ext = $("#product-img").attr("src").split(".").pop().trim();

if (ext == "png") {
  $("#product-img").css("object-fit", "contain");
  $("#product-img").css("padding", "1rem");
} else {
  $("#product-img").css("object-fit", "cover");
  $("#product-img").css("padding", "0");
}

let loadedData = `${$("#product-title").val()}|${$("#product-price").val()}|${$(
  "#product-format"
).val()}|${$("#product-profit").val()}`;

let editedData = loadedData;
let hasUnsavedChanges = false;

$("input").on("change", () => {
  $("#product-title").prop("disabled", true);
  $("#edit-title").attr("src", "/assets/pencil.svg");

  editedData = `${$("#product-title").val()}|${$("#product-price").val()}|${$(
    "#product-format"
  ).val()}|${$("#product-profit").val()}`;

  hasUnsavedChanges = editedData != loadedData;
  if (hasUnsavedChanges) {
    $("#warn").slideDown();
  } else {
    $("#warn").slideUp();
  }
});

function deleteData() {
  let data = loadedData.split("|")
  $("#product-title").val(data[0])
  $("#product-price").val(data[1])
  $("#product-format").val(data[2])
  $("#product-profit").val(data[3])

  editedData = loadedData;
  hasUnsavedChanges = false;
  $("#warn").slideUp();
}

function updateData() {
  fetch(`/stock/${productId}/update`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: $("#product-title").val(),
      price: $("#product-price").val().replace(",", "."),
      format: $("#product-format").val(),
      profit: $("#product-profit").val().replace(",", "."),
    }),
  }).then((res) => {
    if (res.status == 200) {
      loadedData = editedData;
      hasUnsavedChanges = false;
    } else {
      hasUnsavedChanges = true;
    }

    if (hasUnsavedChanges) {
      $("#warn").slideDown();
    } else {
      $("#warn").slideUp();
    }
  });
}

window.onbeforeunload = function () {
  if (hasUnsavedChanges) {
    return true;
  }
};

resizeInput(document.querySelector("#product-title"));

function resizeInput(input) {
  input.style.width = input.value.length + "ch";
}

function toggleTitleEdit() {
  if ($("#product-title").prop("disabled") == false) {
    $("#product-title").prop("disabled", true);
    $("#edit-title").attr("src", "/assets/pencil.svg");
  } else {
    $("#product-title").prop("disabled", false);
    $("#product-title").focus();
    $("#edit-title").attr("src", "/assets/check.svg");
  }
}
