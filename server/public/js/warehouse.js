const searchInput = document.getElementById('search-item-input')

searchInput.addEventListener('change', (e) => {
    fetch(
        location.origin + `/stock/search?q=${searchInput.value}&limit=20`)
        .then(r => r.json().then(js => console.log(js))
        )
})