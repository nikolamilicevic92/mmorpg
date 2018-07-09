const container = document.querySelector('.images')
const cards     = document.getElementsByClassName('asset-image')
const search    = document.getElementById('search')

function deleteImage(image) {
  ajax({
    url: 'admin/delete-image',
    method: 'POST',
    query: 'image=' + image,
    callback: () => {
      container.removeChild(document.getElementById(image))
    }
  })
}

search.addEventListener('keyup', () => {
  const target = search.value
  for(let i = 0; i < cards.length; i++) {
    const name = cards[i].querySelector('[name="new_name"]').value
    if(!name.includes(target)) {
      hide(cards[i])
    } else {
      show(cards[i])
    }
  }
})
