const container = document.querySelector('.sounds')
const cards     = document.getElementsByClassName('asset-sound')
const search    = document.getElementById('search')

function deleteSound(sound) {
  ajax({
    url: 'admin/delete-sound',
    method: 'POST',
    query: 'sound=' + sound,
    callback: () => {
      container.removeChild(document.getElementById(sound))
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