const productId = window.location.pathname.split("/").pop();
const months = [
  "jan.",
  "fev.",
  "mar.",
  "abr.",
  "mai.",
  "jun.",
  "jul.",
  "ago.",
  "set.",
  "out.",
  "nov.",
  "dez.",
];
const days = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];

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

function checkModifications() {
  $("#product-title").prop("disabled", true);
  $("#edit-title").attr("src", "/assets/pencil.svg");

  editedData = `${$("#product-title").val()}|${$("#product-price").val()}|${$(
    "#product-format"
  ).val()}|${$("#product-profit").val()}`;

  hasUnsavedChanges = editedData != loadedData;
  if (hasUnsavedChanges) {
    $("#modification-warn").slideDown();
  } else {
    $("#modification-warn").slideUp();
  }
}

$("input").on("change", checkModifications);
$("select").on("change", checkModifications);

function deleteData() {
  let data = loadedData.split("|");
  $("#product-title").val(data[0]);
  $("#product-price").val(data[1]);
  $("#product-format").val(data[2]);
  $("#product-profit").val(data[3]);

  editedData = loadedData;
  hasUnsavedChanges = false;
  $("#modification-warn").slideUp();
  resizeInput(document.querySelector("#product-title"));
  format = $("#product-format").val();
  $("#new-buy-format").text(format);
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
      $("#modification-warn").slideDown();
    } else {
      $("#modification-warn").slideUp();
    }
  });
}

let isAdding;

function dismissNewBuy(){
  $("#newBuy-warn").slideUp()
}

window.onbeforeunload = function () {
  if (isAdding) {
    $("#newBuy-warn").slideDown();
  } else {
    $("#newBuy-warn").slideUp();
  }

  if (hasUnsavedChanges || isAdding) {
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

let format = $("#product-format").val();
$("#product-format").on("change", (e) => {
  format = $("#product-format").val();
  $("#new-buy-format").text(format);
});

function newBuy() {
  isAdding = true;

  if (document.querySelector("#addingBuy") != null) {
    return;
  }

  let now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);

  var today = now.getFullYear() + "-" + month + "-" + day;

  let weekDay = days[now.getDay()];
  let dateDay = now.getDate();
  let monthString = months[now.getMonth()];
  let year = now.getFullYear();

  let dateString = `${weekDay}, ${dateDay} ${monthString} ${year}`;

  let hours = now.getHours();
  let minutes = now.getMinutes();

  let datetimeString = `${dateString}, ${hours}:${minutes}`;

  $("#stock").prepend(
    $(`
            <form 
            class="buy" 
            id="addingBuy"
            action="/stock/${productId}/newBuy"
            method="POST"
            >
              <img src="/assets/bag.svg" class="buy-icon-shop" />
              <div class="buy-info">
                <div class="buy-title">
                  <div class="buy-title-date">
                    <input oninput="resizeInput(this)" id="buy-title" name="title" class="medium">
                    <button type="submit" class="saveBuy-btn">
                      <img id="saveBuy" src="/assets/save.svg" onclick="saveBuy()">
                    </button>
                  </div>
                </div>

                <div class="buy-data">
                  <div class="buy-data-value">
                    Data
                    <span>
                      <span class="medium">${datetimeString}</span>
                      <input id="buy-date" name="date" type="hidden" value="${datetimeString}">
                    </span>
                  </div>
                  <div class="buy-data-value">
                    Validade
                    <span>
                      <input class="medium" type="date" name="validity" value="${today}">
                    </span>
                  </div>
                  <div class="buy-data-value">
                    Quantidade
                    <span class="suffix">
                      <input oninput="resizeInput(this)" type="number" name="quantity" class="medium" step="0.01" value="1.00">
                      <span id="new-buy-format">${format}</span>
                    </span>
                  </div>
                  <div class="buy-data-value">
                    Valor
                    <span class="suffix">
                      <span>R$</span>
                      <input oninput="resizeInput(this)" class="medium" name="value" type="number" step="0.01" value="1.00">
                    </span>
                  </div>
                  <div class="buy-data-value">
                    Método Pgto.
                    <select id="buy-method" name="method">
                      <option value="Cartão de Crédito">Cartão de Créd.</option>
                      <option>Cartão de Dbto.</option>
                      <option>Dinheiro</option>
                      <option>PIX</option>
                    </select>
                  </div>
                  <div class="buy-data-value" id="buy-parcels">
                    Parcelas
                    <span class="suffix"> 
                      <input name="parcels" oninput="resizeInput(this)" class="medium" type="number" step="1" value="1">
                      <span>×</span> 
                    </span>
                  </div>
                </div>
              </div>
            </form>
            `)
  );

  $("#buy-title")
    .val("Compra " + dateString)
    .select()
    .focus();

  document
    .querySelectorAll(".suffix input")
    .forEach((input) => resizeInput(input));

  resizeInput(document.querySelector("#buy-title"));

  document.querySelector("#buy-method").addEventListener("change", (e) => {
    if ($(e.target).val() == "Cartão de Crédito") {
      $("#buy-parcels").show();
    } else {
      $("#buy-parcels input").val("1");
      $("#buy-parcels").hide();
    }
  });
}
