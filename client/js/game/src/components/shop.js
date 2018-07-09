import { getById, make, getByClass, show, hide } from '../util/dom-functions'

const items = {
  health: [
    [20, 1],
    [30, 2],
    [40, 3],
    [50, 4],
    [100, 5]
  ],
  attack: [
    [5, 1],
    [10, 2],
    [15, 3],
    [20, 4],
    [25, 5]
  ],
  defence: [
    [5, 1],
    [7, 2],
    [10, 3],
    [15, 4],
    [20, 5]
  ]
}

export class Shop {

  constructor(game) {
    this.game = game
    this.container = getById('shopScreen')
    this.showHealthItems = getById('showHealthItems')
    this.showDamageItems = getById('showDamageItems')
    this.showDefenceItems = getById('showDefenceItems')
    this.healthItemsContainer = getById('healthItemsContainer')
    this.damageItemsContainer = getById('damageItemsContainer')
    this.defenceItemsContainer = getById('defenceItemsContainer')
    this.hideShop = getById('hideShopScreen')
    this.items    = []
    this.damageBuffTimeout = null
    this.defenceBuffTimeout = null
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
    this.showHealthItems.addEventListener('click', () => {
      this.hideAll()
      show(this.healthItemsContainer)
    })
    this.showDamageItems.addEventListener('click', () => {
      this.hideAll()
      show(this.damageItemsContainer)
    })
    this.showDefenceItems.addEventListener('click', () => {
      this.hideAll()
      show(this.defenceItemsContainer)
    })
    this.generateHealthItems()
    this.generateAttackItems()
    this.generateDefenceItems()
  }

  hideAll() {
    hide(this.healthItemsContainer)
    hide(this.damageItemsContainer)
    hide(this.defenceItemsContainer)
  }

  generateHealthItems() {
    items.health.forEach(item => {
      const p = make('p')
      p.innerHTML = `Restore ${item[0]}% of max HP<span>${item[1]}g</span>`
      p.addEventListener('click', () => {
        if(this.game.self.props.gold >= item[1]) {
          const gainedHealth = (item[0] / 100) * this.game.self.props.maxHealth
          this.game.self.health += gainedHealth
          this.game.self.props.gold -= item[1]
        }
      })
      this.healthItemsContainer.appendChild(p)
    })
  }

  generateAttackItems() {
    items.attack.forEach(item => {
      const p = make('p')
      p.innerHTML = `Gain ${item[0]}% damage for 1min<span>${item[1]}g</span>`
      p.addEventListener('click', () => {
        if(this.game.self.props.gold >= item[1]) {
          this.game.self.props.bonusAttack = this.game.self.props.attack * (item[0] / 100)
          clearTimeout(this.damageBuffTimeout)
          this.damageBuffTimeout = setTimeout(() => {
            this.game.self.props.bonusAttack = 0
          }, 1000 * 60)
          this.game.self.props.gold -= item[1]
        }
      })
      this.damageItemsContainer.appendChild(p)
    })
  }

  generateDefenceItems() {
    items.defence.forEach(item => {
      const p = make('p')
      p.innerHTML = `Gain ${item[0]} defence for 1min<span>${item[1]}g</span>`
      p.addEventListener('click', () => {
        if(this.game.self.props.gold >= item[1]) {
          this.game.self.props.bonusDefence = item[0]
          clearTimeout(this.defenceBuffTimeout)
          this.defenceBuffTimeout = setTimeout(() => {
            this.game.self.props.bonusDefence = 0
          }, 1000 * 60)
          this.game.self.props.gold -= item[1]
        }
      })
      this.defenceItemsContainer.appendChild(p)
    })
  }

  show() {
		this.container.style.display = 'block'
	}

	hide() {
		this.container.style.display = 'none'
	}
}