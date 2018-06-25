import { getById, make, getByClass } from '../util/dom-functions'

const items = {
  health: [
    [20, 1],
    [30, 2],
    [40, 3],
    [50, 4],
    [100, 5]
  ]
}

export class Shop {

  constructor(game) {
    this.game = game
    this.container = getById('shopScreen')
    this.hideShop = getById('hideShopScreen')
    this.items    = []
    this.init()
  }

  init() {
    this.container.addEventListener('mouseover', () => {
			this.game.mouse.hide()
		})
		this.container.addEventListener('mouseout', () => {
			this.game.mouse.show()
		})
    this.container.oncontextmenu = ev => ev.preventDefault()
    this.hideShop.addEventListener('click', () => {
      this.hide()
    })
    items.health.forEach(item => {
      const p = make('p')
      p.innerHTML = `Restore ${item[0]}% of max HP<span>${item[1]}g</span>`
      p.addEventListener('click', () => {
        console.log('Trying to heal for ' + item[0] + '% HP, gold cost is ' + item[1] + 'g')
        if(this.game.self.props.gold >= item[1]) {
          const gainedHealth = (item[0] / 100) * this.game.self.props.maxHealth
          console.log('Healed for ' + gainedHealth)
          this.game.self.health += gainedHealth
          this.game.self.props.gold -= item[1]
        }
      })
      this.container.appendChild(p)
    })
  }

  show() {
		this.container.style.display = 'block'
	}

	hide() {
		this.container.style.display = 'none'
	}
}