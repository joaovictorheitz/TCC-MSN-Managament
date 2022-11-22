const searchInput = document.getElementById("search-item-input");
const products = $("#products");
let sortingMethod = "in_stock";
let sortingDirection = "asc";

function toggleFilters() {
  $("#filters").animate({ width: "toggle" });
}

function filter(e) {
  const element = $(e);

  let filter = element.data("value");
  if (filter == "asc-desc") {
    sortingDirection == "asc"
      ? (sortingDirection = "desc")
      : (sortingDirection = "asc");
  } else {
    sortingMethod = filter;
  }

  $(".filter-opt").each((e, i) => {
    let method = $(i).data("value");
    $(i).attr("data-selected", "false");

    if (method == filter || method == 'asc-desc') {
      $(i).attr("data-selected", "true");
    }
  });
}

function toggleList() {
  columns = $("#toggleList").data("columns");

  if (columns == 4) columns = 1;

  document.querySelectorAll(".product-card").forEach((card) => {
    $(card).css("width", `${100 / columns - 2}%`);
  });

  if (columns == 1) {
    $("#products").css("row-gap", "12px");
  } else {
    $("#products").css("row-gap", "24px");
  }

  $("#toggleList").data("columns", columns + 1);
  $("#columnsSelect").attr("src", `./assets/${columns + 1}columns.svg`);
}

function render(productsJSON) {
  products.empty();

  productsJSON.forEach((product) => {
    let productHtml = `
                <a class="product-card" href="/product/${product.id}">
                    <div class="product-image">
                        <img src="${product.thumbnail}">
                    </div>    
                    <div class="product-info">
                        <span class="product-name">${product.title}</span>

                        <div class="product-data">
                            <div class="product-data-tag">
                                <span class="product-data-title">Preço</span>
                                <span class="product-data">R$${product.price}</span>
                            </div>
                            <div class="product-data-tag">
                                <span class="product-data-title">Estoque</span>
                                <span class="product-data">${product.in_stock}</span>
                            </div>
                        </div>

                    </div>
                </a>
                `;

    products.append(productHtml);
  });
}

function query(searchQuery) {
  fetch(
    location.origin +
      `/stock/search?q=${searchQuery.trim()}&limit=21&sort=${sortingMethod}-${sortingDirection}`
  ).then((r) =>
    r.json().then((js) => {
      render(js);
    })
  );
}

searchInput.addEventListener("input", (e) => {
  let searchQuery = e.target.value;
  query(searchQuery).then((e) => console.log(e));
});

query(" ");
