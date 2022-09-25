const searchInput = document.getElementById('search-item-input')

searchInput.addEventListener('change', (e) => {
    fetch(
        location.origin + `/stock/search?q=${searchInput.value}&limit=20`)
        .then(r => r.json().then(js => {
            const products = $("#products")
            products.empty()

            js.forEach(product => {
                let title = product.title.toLowerCase().split(searchInput.value)

                let productHtml = `
                <div class="product-card">
                    <img class="product-image" src="${product.thumbnail}">
                    <div class="product-info">
                        <span class="product-name">${product.title}</span>

                        <div class="product-data">
                            <div class="product-data-tag">
                                <span class="product-data-title">Preço</span>
                                <span class="product-data">R$ ${product.price}</span>
                            </div>
                            <div class="product-data-tag">
                                <span class="product-data-title">Em estoque</span>
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