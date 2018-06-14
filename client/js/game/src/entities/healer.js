import { Character } from './character'
import { HealingOrb } from './abilities/healing-orb'

export class Healer extends Character {

	constructor(game, data) {
		super(game, data)
		this.AASpriteName = 'healer-aa.png'
		this.AASpeed = 3
		this.ability1Cooldown = 700
		this.A2SpriteName = 'healing-orb.png'
		this.A3SpriteName = 'healer-a3.png'
		this.AASound = 'healer-aa.mp3'
		this.AAWidth = 50
		this.AAHeight = 50
		this.orbs = {}
		this.orbIDs = []
		this.orbDuration = 1000 * 60
		this.orbRange = 200
		this.maxOrbs = 5
		this.ability2Cooldown = 2000
		this.ability3Cooldown = 1000 * 30
		this.orbHPRestore = 15
		this._bonusDamageBuffMultiplier = 20
		this._bonusDefenceBuff = 10
		this.bonusDamage = this._bonusDamageBuffMultiplier * this.level
		this.bonusDefence = this._bonusDefenceBuff
		this.auraDoubledDuration = 1000 * 6
		this.auraDoubled = false
		this.auraRadius = 556 / 2
	}

	get bonusDefenceBuff() {
		if(this.auraDoubled) return 2 * this._bonusDefenceBuff
		return this._bonusDefenceBuff
	}

	get bonusDamageBuff() {
		if(this.auraDoubled) return 2 * (this._bonusDamageBuffMultiplier * this.level)
		return (this._bonusDamageBuffMultiplier * this.level)
	}

	ability2() {
		if(!super.ability2(false)) return
		const ID = Math.random() + ''
		let X = this.game.mouse.worldX, Y = this.game.mouse.worldY
		const magnitude = Math.sqrt(Math.pow(X - this.axis.X, 2) + Math.pow(Y - this.axis.Y, 2))
		if(magnitude > this.orbRange) {
			const vX = (X - this.axis.X) / magnitude, vY = (Y - this.axis.Y) / magnitude
			X = this.axis.X + vX * this.orbRange
			Y = this.axis.Y + vY * this.orbRange
		}
		this.addOrb(ID, X, Y)
		this.orbIDs.push(ID)
		if(this.orbIDs.length > this.maxOrbs) {
			this.game.socket.emit('abilityEvent', {
				code: 'healingOrbDeath',
				ID: this.orbIDs[0],
				charName: this.game.selectedChar
			})
			this.removeOrb(this.orbIDs[0])
		}
		this.game.socket.emit('abilityEvent', {
			code: 'newHealingOrb',
			ID: ID,	
			X: X, Y: Y,
			charName: this.game.selectedChar
		})
		setTimeout(() => {
			this.removeOrb(ID)
			this.game.socket.emit('abilityEvent', {
				code: 'healingOrbDeath',
				ID: ID,
				charName: this.game.selectedChar
			})
		}, this.orbDuration)
	}

	addOrb(ID, X, Y) {
		if(this.orbs[ID]) return
		if(this.A2Sound) {
			this.game.soundManager.play(this.A2Sound)
		}
		this.orbs[ID] = new HealingOrb(this.game, X, Y)
		this.orbs[ID].spriteName = this.A2SpriteName
	}

	removeOrb(ID) {
		if(this.orbs[ID]) {
			this.orbIDs.splice(this.orbIDs.indexOf(ID), 1)
			delete this.orbs[ID]
		}
	}

	ability3() {
		if(!super.ability3(false)) return

		this.enableDoubledAura()
		this.game.socket.emit('abilityEvent', {
			code: 'healerAuraDoubled',	
			charName: this.game.selectedChar
		})
		setTimeout(() => {
			this.disableDoubledAura()
			this.game.socket.emit('abilityEvent', {
				code: 'healerAuraDoubledEnd',
				charName: this.game.selectedChar
			})
		}, this.auraDoubledDuration)
	}

	disableDoubledAura() {
		this.auraDoubled = false
		this.bonusDamage = this._bonusDamageBuffMultiplier * this.level
		this.bonusDefence = this._bonusDefenceBuff
	}

	enableDoubledAura() {
		if(this.A3Sound) {
			this.game.soundManager.play(this.A3Sound)
		}
		this.auraDoubled = true
		this.bonusDamage = this._bonusDamageBuffMultiplier * this.level * 2
		this.bonusDefence = this._bonusDefenceBuff * 2
	}

	render() {
		super.render()
		for(let ID in this.orbs) {
			this.orbs[ID].render()
		}
		if(this.auraDoubled) {
			this.game.renderer.image(
				this.game.assets.images[this.A3SpriteName],
				0, 0, this.auraRadius * 2, this.auraRadius * 2,
				this.axis.X - this.auraRadius - this.game.camera.topLeft.X,
				this.axis.Y - this.auraRadius - this.game.camera.topLeft.Y,
			)
		} else {
			let color = 'rgba(50, 255, 255, 0.2)'
			this.game.renderer.strokeCircle(
				this.axis.X - this.game.camera.topLeft.X,
				this.axis.Y - this.game.camera.topLeft.Y,
				this.auraRadius,
				color
			)
		}
	}
}