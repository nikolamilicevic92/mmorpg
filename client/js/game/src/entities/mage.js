import { Character } from './character'

export class Mage extends Character {

	constructor(game, data) {
		super(game, data)
		this.AAWidth = 30
		this.AAHeight = 24
		this.celerity = false
		this.celerityDuration = 1000 * 5
		this.AACdrOnCelerity = 150
		this.explosion = null
		this.AASpriteName = 'sorc-aa.png'
		this.A2SpriteName = 'celerity.png'
		this.A3SpriteName = 'spell_bluetop_1_1.png'
		this.AASound = 'sorc-aa.wav'
		this.A3Sound = 'sorc-bolt.mp3'
		this.explosionMaxSpawnDistance = 400
		this.ability1BaseCooldown = 300
		this.ability2Cooldown = 1000 * 20
		this.ability3Cooldown = 1000 * 5
		this.A3Mult = 13
	}

	ability2() {
		if(!super.ability2()) return

		this.ability1Cooldown = this.AACdrOnCelerity
		this.celerity = true
		this.game.socket.emit('abilityEvent', {
			code: 'MageA2S', charName: this.game.selectedChar
		})
		setTimeout(() => {
			this.ability1Cooldown = this.ability1BaseCooldown
			this.game.socket.emit('abilityEvent', {
				code: 'MageA2E', charName: this.game.selectedChar
			})
		}, this.celerityDuration)
	}

	ability3() {
		if(!super.ability3(false)) return

		let X = this.game.mouse.worldX, Y = this.game.mouse.worldY
		const magnitude = Math.sqrt(Math.pow(X - this.axis.X, 2) + Math.pow(Y - this.axis.Y, 2))
		if(magnitude > this.explosionMaxSpawnDistance) {
			const vX = (X - this.axis.X) / magnitude, vY = (Y - this.axis.Y) / magnitude
			X = this.axis.X + vX * this.explosionMaxSpawnDistance
			Y = this.axis.Y + vY * this.explosionMaxSpawnDistance
		}
		const dragons = this.game.dragons
		for(let ID in dragons) {
			const dragon = dragons[ID]
			if(Math.abs(X - dragon.axisX) < 100 &&
				Math.abs(Y - dragon.axisY) < 100) {
				this.game.socket.emit('dragonsEvent', {
					code: 'dragonHit',
					damage: (this.attack + this.bonusDamage) * this.A3Mult,
					dragonID: dragon.ID,
					charName: this.game.selectedChar
				})
			}
		}
		this.addExplosion(X, Y)
		this.game.socket.emit('abilityEvent', {
			code: 'MageA3S',
			X, Y, charName: this.game.selectedChar
		})
	}

	addExplosion(X, Y) {
		this.game.soundManager.play(this.A3Sound)

		this.explosion = {X, Y}
		setTimeout(() => this.explosion = null, 300)
	}

	render() {
		if(this.celerity) {
			this.renderCelerityAura()
		}
		super.render()
		if(this.explosion) {
			this.game.renderer.image(
				this.game.assets.images[this.A3SpriteName],
				0, 0, 98, 203,
				this.explosion.X - 49 - this.game.camera.topLeft.X,
				this.explosion.Y - 150 - this.game.camera.topLeft.Y
			)
		}
	}

	renderCelerityAura() {
		this.game.renderer.image(
			this.game.assets.images[this.A2SpriteName],
			0, 0, 80, 120,
			this.axis.X - 45 - this.game.camera.topLeft.X,
			this.Y - 75 - this.game.camera.topLeft.Y,
			90, 120
		)
	}
}