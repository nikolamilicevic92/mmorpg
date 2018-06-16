import { animations } from '../config/character-animations'
import { BasicMovement } from './movement'
import { HeroRenderer } from './renderer'
import { PropertiesManager } from './properties-manager'
import { AbilityFactory } from './abilities/factory'

const keybinds = {
	'Ability1': ['RMB', '1'],
	'Ability2': ['2'],
	'Ability3': ['3']
}

export class Hero {

	constructor(game, props) {
		this.game			 = game
		this.props           = props
		this.movementManager = new BasicMovement(this)
		this.renderer        = new HeroRenderer(this)
		this.propsManager    = new PropertiesManager(this)
		this.animations      = animations
		this.abilities       = AbilityFactory.makeAbilities(this, keybinds)
	}

	set health(value) {
		if(value < 0) {
			this.props.health = 1
			this.respawn()
		} else {
			this.props.health = value
			if(this.props.health > this.props.maxHealth) {
				this.props.health = this.props.maxHealth
			}
		}		
	}

	get health() { return this.props.health }

	update() {
		this.movementManager.update()
		for(let id in this.abilities) {
			this.abilities[id].update()
		}
		// console.log(this.props.health, this.props.maxHealth * this.props.healthRegen)
		this.health += this.props.maxHealth * this.props.healthRegen
	}


	//For other heroes
	updateAbilitiesInstances() {
		for(let id in this.abilities) {
			this.abilities[id].updateInstances()
		}
	}

	render() {
		this.renderer.render()
		for(let id in this.abilities) {
			this.abilities[id].render()
		}
	}

	getProps(initial = false) {
		return this.propsManager.getProps(initial)
	}

	setProps(props) {
		this.propsManager.setProps(props)
	}

	boundingRect(offsetX = 0, offsetY = 0) {
		return {
			X: this.props.X - this.props.hWidth  + offsetX, 
			Y: this.props.Y - this.props.hHeight + offsetY + 10, 
			width : this.props.width  - 2 * offsetX, 
			height: this.props.height - 2 * offsetY
		}
	}

	parseDragonRewards(data) {
		this.props.gold       += data.gold
		this.props.experience += data.experience
		if(this.props.experience >= this.props.expToNextLevel) {
			this.levelUp()
		}
		
	}

	static propsPerLevel(baseStats, level) {
		const maxHealth = baseStats.base_health + 500 * (level - 1)
		return {
			attack        : level * baseStats.base_attack,
			defence       : level * 2 + baseStats.base_defence,
			maxHealth     : maxHealth,
			expToNextLevel: 1500 + (level - 1) * 500,
			health        : maxHealth
		}
	}

	static makeHero(activeStats, game) {
			console.log(activeStats)
			const baseStats    = game.heroesData[activeStats.type],
				  defaultStats = {
			width            : 32,
			height           : 36,
			hWidth           : 16,
			hHeight          : 18,
			frame            : activeStats.frame ? activeStats.frame : 0, 
			interval         : activeStats.interval ? activeStats.interval : 300, 
			activeAnimation  : activeStats.activeAnimation ? activeStats.activeAnimation : 'walk-right', 
			time             : 0,
			speed            : baseStats.base_mobility / 100 * 1 + 1,
			bonusAttack		 : 0,
			bonusDefence     : 0,
			bonusRunningSpeed: 1,
			energy           : 100,
			healthRegen      : 0.00001,
			canMove          : true,
			infoColor        : activeStats.infoColor ? activeStats.infoColor : 'white',
			levelUpAura      : false,
		}	
		const props = Object.assign(
			{}, baseStats, activeStats, defaultStats, 
			Hero.propsPerLevel(baseStats, activeStats.level)
		)
		props.health = activeStats.health
		return new Hero(game, props)
	}

	levelUp() {
		while(this.props.experience >= this.props.expToNextLevel) {
			this.props.experience -= this.props.expToNextLevel
			this.props.level++
		}
		this.setProps(Hero.propsPerLevel(this.props, this.props.level))
		this.props.levelUpAura = true
		this.game.soundManager.play('level-up.ogg')
		setTimeout(() => this.props.levelUpAura = false, 1500)
	}

	respawn() {
		const location = this.findClosestCamp()
		this.props.X = location.X
		this.props.Y = location.Y
	}

	findClosestCamp() {
		return { X: 300, Y: 9600 }
	}
}