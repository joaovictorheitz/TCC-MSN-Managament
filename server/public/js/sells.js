$("#actual-title").val("Nome do Produto");
$("#actual-title").on("click", (e) => {
  e.target.value = "";
  resizeInput(e.target);
  // if (e.target.value == "Nome do Produto") e.target.value = "";
});

let product;
let method;

function resizeInput(input) {
  let maxWidth = 20;
  if (input.value.length >= maxWidth)
    return (input.style.width = maxWidth + "ch");
  else if (input.value.length == 0) return (input.style.width = 1 + "ch");

  input.style.width = input.value.length + "ch";
}

document.querySelectorAll("input").forEach((input) => {
  if (input.classList.contains("not-resizeable")) return;
  resizeInput(input);
});

function openProductPage(btn) {
  if (confirm(`Deseja ir para a página de ${$(btn).data("product")}?`)) {
    window.open("/product/638ab3c4910fc7b1a8b9827b", "_blank").focus();
  }
}

let productList;
let products = {
  order: 1,
};
if (sessionStorage.sell) {
  products = JSON.parse(sessionStorage.getItem("sell"));
  renderBuys();
}

$(document).on("keydown", (e) => {
  if (document.activeElement.id == "actual-title") {
    if (e.key == "ArrowDown") {
      document.querySelector(".search-result").focus();
      return;
    }
  }

  if (document.activeElement.classList.contains("search-result")) {
    if (e.key == "ArrowDown") {
      let element = document.activeElement;
      let sibling = element.nextElementSibling;
      if (sibling == null) return $("#actual-title").focus();
      sibling.focus();
    } else if (e.key == "ArrowUp") {
      let element = document.activeElement;
      let sibling = element.previousElementSibling;
      if (sibling == null) return $("#actual-title").focus();
      sibling.focus();
    }
  }
});

function renderSearch(product) {
  $("#search-results").append(`
    <button class="search-result" tabindex="0" onclick="setProduct('${product._id}')">
    ${product.title}
    </button>
    `);
}

function search(searchQuery) {
  fetch(location.origin + `/sells/search?q=${searchQuery.trim()}`).then((r) =>
    r.json().then((productList) => {
      $("#search-results").empty();
      productList.forEach((product) => {
        if (!products[product._id]) products[product._id] = product;
        renderSearch(product);
      });
    })
  );
}

function setProduct(productID) {
  product = products[productID];
  $("#confirmSell").text("Confirmar");
  $("#confirmSell").attr("onclick", "confirmSell()");

  $("#actual-title").val(product.title);
  resizeInput(document.querySelector("#actual-title"));

  $("#actual-thumbnail-image").attr("src", product.thumbnail);

  document
    .querySelectorAll(".actual-item-format")
    .forEach((el) => (el.innerText = product.format));
  $("#actual-item-price").text(product.price.toFixed(2).replaceAll(".", ","));
  $("#actual-item-total").text(
    parseFloat(product.price * $("#actual-item-quantity").val())
      .toFixed(2)
      .replaceAll(".", ",")
  );
}

$("#actual-title").on("click", (e) => {
  $("#search-results").slideDown("fast");
});

$("#actual-item-quantity").on("input", (e) => {
  if (product) {
    $("#actual-item-total").text(
      parseFloat(product.price * $("#actual-item-quantity").val())
        .toFixed(2)
        .replaceAll(".", ",")
    );
  }
});

function confirmSell() {
  if (!product) return;
  let quantity = Number($("#actual-item-quantity").val());
  if (quantity <= 0) return;
  let price = product.price * quantity;

  if (!product.buy) product.buy = [];
  product.buy.push({
    order: products.order,
    id: product._id,
    title: product.title,
    quantity: quantity,
    un_price: product.price,
    price: price,
    format: product.format,
  });

  products.order = products.order + 1;

  renderBuys();
}

function addLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, "0");
}

function renderBuys() {
  const keys = Object.keys(products);
  let subtotal = 0;

  $("#past-products").empty().append(` 
    <span class="table-header">nº</span>
    <span class="table-header">código</span>
    <span class="table-header">nome prod.</span>
    <span class="table-header">qtd.</span>
    <span class="table-header">valor unit.</span>
    <span class="table-header">total</span>`);

  let buys = [];

  keys.forEach((productID) => {
    let product = products[productID];
    if (product.buy) {
      product.buy.forEach((buy) => {
        buys.push(buy);
      });
    }
  });

  buys.sort((a, b) => {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }
    return 0;
  });

  buys.forEach((buy) => {
    subtotal += buy.price;

    $("#past-products").append(`
          <span data-id="${buy.order}">${addLeadingZeros(buy.order, 3)}</span>
          <span data-id="${buy.order}" class="prod-id">${buy.id}</span>
          <span data-id="${buy.order}">${buy.title}</span>
          <span data-id="${buy.order}">${
      buy.format == "kg"
        ? buy.quantity.toFixed(2).replaceAll(".", ",")
        : buy.quantity
    }${buy.format}</span>
          <span data-id="${buy.order}">R$${buy.un_price}/${buy.format}</span>
          <span data-id="${
            buy.order
          }" class="suffix"><span class="suffix-span">R$</span><span>${buy.price
      .toFixed(2)
      .replaceAll(".", ",")}</span></span>
        `);
  });

  $("#past-products span").on("mousedown", (e) => {
    let id = $(e.target).attr("data-id");

    let prods = [];

    for (let i = 0; i < Object.keys(products).length; i++) {
      if (Object.keys(products)[i] == "order") continue;
      const product = products[Object.keys(products)[i]];
      prods.push(product);
    }

    let buy = prods.filter((product) => {
      if (!product.buy) return false;

      for (let i = 0; i < product.buy.length; i++) {
        let buy = product.buy[i];
        if (buy.order == id) return true;
      }
    });

    updateProduct(buy[0], id);
  });

  $(".prod-id").on("click", (e) => {
    let id = $(e.target).text();
    $("#copied-warn").css("opacity", "1");
    $("#copied-warn").css("left", `${e.pageX}px`);
    $("#prod-id").text(id);
    navigator.clipboard.writeText(id);
    $("#copied-warn").css(
      "top",
      `${e.pageY - $("#copied-warn").height() - 8}px`
    );
    setTimeout(() => {
      $("#copied-warn").css("opacity", "0");
    }, 1000);
  });

  let formattedSubtotal = subtotal.toFixed(2).replaceAll(".", ",");
  let toReceive = method == "Dinheiro" ? 0 : subtotal;
  $("#subtotal").text(formattedSubtotal);
  $("#received").val(Number(toReceive).toFixed(2));
  resizeInput(document.querySelector("#received"));
  $("#change").text(toReceive - subtotal);
}

document.addEventListener("click", (e) => {
  if (e.target != document.querySelector("#actual-title")) {
    $("#search-results").slideUp("fast", () => {
      $("#search-results").empty();
      if (product) renderSearch(product);
    });
  }
});

window.onbeforeunload = function () {
  sessionStorage.setItem("sell", JSON.stringify(products));
};

function updateProduct(product, order) {
  $("#actual-title").val(product.title);

  let buy = product.buy.filter((buy) => {
    return buy.order == order;
  })[0];

  $("#actual-item-quantity").val(buy.quantity);
  resizeInput(document.querySelector("#actual-item-quantity"));
  $("#confirmSell").text("Atualizar");
  $("#confirmSell").attr("onclick", `updateSell(${order})`);

  resizeInput(document.querySelector("#actual-title"));

  $("#actual-thumbnail-image").attr("src", product.thumbnail);

  document
    .querySelectorAll(".actual-item-format")
    .forEach((el) => (el.innerText = product.format));
  $("#actual-item-price").text(product.price.toFixed(2).replaceAll(".", ","));
  $("#actual-item-total").text(
    parseFloat(product.price * $("#actual-item-quantity").val())
      .toFixed(2)
      .replaceAll(".", ",")
  );
}

function updateSell(order) {
  let prods = [];
  let id, index;

  for (let i = 0; i < Object.keys(products).length; i++) {
    if (Object.keys(products)[i] == "order") continue;
    const product = products[Object.keys(products)[i]];
    prods.push(product);
  }

  let buy = prods.filter((product) => {
    if (!product.buy) return false;

    for (let i = 0; i < product.buy.length; i++) {
      let buy = product.buy[i];
      if (buy.order == order) {
        id = product._id;
        index = i;
        return true;
      }
    }
  })[0].buy[index];

  buy.quantity = Number($("#actual-item-quantity").val());
  buy.price = buy.quantity * buy.un_price;
  products[id].buy[index] = buy;
  renderBuys();
}

function methodHandling() {
  method = $("#sell-method").val();

  if (method == "money" || method == "prize") {
    $("#received").removeAttr("disabled");
    $("#received").focus();
  } else {
    $("#received").attr("disabled", "true");
  }

  if (method == "credit_card") {
    $("#sell-method-parcels").fadeIn("fast");
  } else {
    $("#sell-method-parcels").fadeOut("fast").val(1);
  }

  if (method == "money" || method == "prize") {
    $("#received").removeAttr("disabled");
    if ($("#received").val() == 0) {
      $("#received").val(parseFloat(0).toFixed(2));
    }

    let change =
      $("#received").val() - Number($("#subtotal").text().replaceAll(",", "."));

    if (change < 0) {
      method = "prize";
      $("#change-text").text("Devendo");
      $("#sell-method").val("prize");
    } else {
      method = "money";
      $("#change-text").text("Troco");
      $("#sell-method").val("money");
    }

    $("#received").focus();
  } else {
    $("#received").attr("disabled", "true");
  }

  if (method == "credit_card" || method == "pix" || method == "debit_card") {
    $("#received").val(Number($("#subtotal").text().replaceAll(",", ".")));
    $("#change").text(parseFloat("0").toFixed(2));
  }

  if (method == "prize") {
    $("#prize-contact").slideDown("fast");
    $("#prize-contact-input").focus();
  } else {
    $("#prize-contact").slideUp("fast");
  }

  resizeInput(document.querySelector("#received"));
}

$("#sell-method").on("change", (e) => {
  methodHandling();
});

$("#received").on("change", (e) => {
  if (method == "money" || method == "prize") {
    let change =
      $("#received").val() - Number($("#subtotal").text().replaceAll(",", "."));

    $("#change").text(parseFloat(Math.abs(change)).toFixed(2));
  }

  methodHandling();
});

function finishSell() {
  let prods = Object.entries(products).map((product) => {
    return product[1];
  });

  let sellingProducts = prods.filter((product) => {
    return product.buy;
  });

  let items = [];
  let price = 0;
  let payment_method = $("#sell-method").val();
  let parcels = $("#parcels").val();
  let datetime = new Date().getTime();

  sellingProducts.forEach((product) => {
    let quantity = 0;
    let sell = {};

    product.buy.forEach((buy) => {
      quantity += buy.quantity;
    });

    sell._id = product._id;
    sell.price = product.price;
    sell.format = product.format;
    sell.title = product.title;
    sell.quantity = quantity;
    price += sell.price * sell.quantity;

    items.push(sell);
  });

  sell = {
    value: parseFloat(price.toFixed(2)),
    payment_method: payment_method,
    parcels: parcels,
    datetime: datetime,
    items: items,
  };

  if (payment_method == "prize") {
    if ($("#prize-contact-input").val() == "")
      return $("#prize-warn").slideDown();
    sell.client_contact = $("#prize-contact-input").val();
    sell.paid = $("#received").val();
  }

  sell = JSON.stringify(sell);
  fetch("sells/sell", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: sell,
  }).then((res) => {
    if (res.status == 200) {
      sessionStorage.removeItem("sells");
      search("");
      products.order = 1;
      clearBuys();
      renderBuys();
      methodHandling()
      $("#prize-contact-input").val("");
      $("#sell-method").val("credit_card");
    }
  });
}

$("#prize-contact-input").on("input", (e) => {
  if ($(e.target).val() != "") {
    $("#prize-warn").slideUp();
  }
});

function clearBuys() {
  let prods = Object.entries(products).map((product) => {
    return product[1];
  });

  prods.forEach(prod=>{
    delete prod.buy
  })
}
