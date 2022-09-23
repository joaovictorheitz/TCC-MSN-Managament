const searchInput = document.getElementById('search-item-input')

searchInput.addEventListener('change', (e) => {
    fetch(
        location.origin + `/stock/search?q=${searchInput.value}&limit=20`)
        .then(r => r.json().then(js => {
            const dropdown = $("#dropdown-search-list")
            dropdown.empty()

            js.forEach(product =>{
                let productHtml = `<a href="#" class="dropdown-item">
                    <img src="${product.thumbnail}" alt="" class="dropdown-thumb">
                    <span class="dropdown-text">${product.title}</span>
                </a>`

                $("#dropdown-search-list").append(productHtml)
            })
        })
        )
})