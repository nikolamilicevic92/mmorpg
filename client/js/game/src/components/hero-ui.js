import { getById, make, getByClass } from '../util/dom-functions'

export class HeroUI {
	
	constructor(game) {
		this.abilities  = game.self.abilities
		this.props      = game.self.props
		this.container  = getById('heroUI')
		this.level      = getById('heroLevel')
		this.exp        = getById('heroExp')
		this.gold  	    = getById('heroGold')
		this._abilities = getById('heroAbilitiesUI')
		this.attack     = getById('heroAttack')
		this.defence    = getById('heroDefence')
		this.health     = getById('health')
		this.energy     = getById('energy')
		this.healthVal  = getById('healthValue')
		this.energyVal  = getById('energyValue')
		this.cooldowns  = {}
		this.init()
	}

	init() {
		let ability, icon
		for(let id in this.props.abilities) {
			ability = this.props.abilities[id]
			icon    = make('div.ability-icon')
			this.setBackgroundImage(
				icon, ability.sprite
			)
			this.cooldowns[ability.id] = icon
			this._abilities.appendChild(icon)
		}
	}

	show() {
		this.container.style.display = 'block'
	}

	hide() {
		this.container.style.display = 'none'
	}

	//Should check if state changed and only then update
	update() {
		this.level.innerText   = this.props.level
		this.exp.innerText     = this.props.experience
		this.gold.innerText    = this.props.gold
		this.attack.innerText  = this.props.attack
		this.defence.innerText = this.props.defence
		this.updateCooldowns()
		this.setHealth()
		this.setEnergy()    
	}

	updateCooldowns() {
		let cdr
		for(let id in this.abilities) {
			cdr   = this.abilities[id].cooldownTimer
			if(cdr > 1) {
				this.cooldowns[id].innerText = Math.ceil(cdr)
			} else if(cdr > 0) {
				this.cooldowns[id].innerText = '0.' + Math.ceil(cdr * 10)
			} else {
				this.cooldowns[id].innerText = ''
			}
		}
	}

	setHealth() {
		const health = parseInt(this.props.health),
		      width  = health / this.props.maxHealth * 100
		this.healthVal.innerText = health + '/' + this.props.maxHealth
		this.health.style.width = width + '%'
	}

	setEnergy() {
		const energy = parseInt(this.props.energy)
		this.energyVal.innerText   = energy
		this.energy.style.width    = energy + '%'
	}

	setBackgroundImage(element, img) {
		element.style.backgroundImage = `url(client/assets/images/${img})`
	}

}