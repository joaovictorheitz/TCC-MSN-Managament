const searchInput = document.getElementById('search-item-input')

function toggleList() {
    columns = $('#toggleList').data('columns')

    if (columns == 4) columns = 1;

    document.querySelectorAll(".product-card").forEach(card => {
        $(card).css("width", `${(100 / columns) - 2}%`)
    })

    if(columns == 1){
        $("#products").css('row-gap', '12px')
    } else {
        $("#products").css('row-gap', '24px')
    }

    $('#toggleList').data('columns', columns + 1)
    $('#columnsSelect').attr('src', `./assets/${columns + 1}columns.svg`)
}

searchInput.addEventListener('input', (e) => {
    fetch(
        location.origin + `/stock/search?q=${searchInput.value.trim()}&limit=21`)
        .then(r => r.json().then(js => {
            const products = $("#products")
            products.empty()

            js.forEach(product => {
                let title = product.title.toLowerCase().split(searchInput.value)

                let productHtml = `
                <div class="product-card">
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
                </div>
                `
                
                products.append(productHtml)
            })
        })
        )
})

for (let i = 0; i < 19; i++) {
    $('#oi').clone().appendTo('#products')
}