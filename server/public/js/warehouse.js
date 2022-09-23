const searchInput = document.getElementById('search-item-input')

searchInput.addEventListener('change', (e) => {
    fetch(
        location.origin + `/stock/search?q=${searchInput.value}&limit=20`)
        .then(r => r.json().then(js => {
            const dropdown = $("#dropdown-search-list")
            dropdown.empty()

            js.forEach(product =>{
                let title = product.title.toLowerCase().split(searchInput.value)

                let productHtml = `<a href="#" class="dropdown-item">
                    <img src="${product.thumbnail}" alt="" class="dropdown-thumb">
                    <span class="dropdown-text">${title[0]}<span class="bold">${searchInput.value}</span>${title[1]}</span>
                    <span class="dropdown-desc">${product.description}</span>
                </a>`

                $("#dropdown-search-list").append(productHtml)
            })
        })
        )
})