import { Character } from './character'

export class Warrior extends Character {

	constructor(game, data) {
		super(game, data)
		this.invulnerable = false
		this.AASpriteName = 'warrior-aa.png'
		this.A2SpriteName = 'warrior-aura.png'
		this.A3SpriteName = 'warrior-a3.png'
		this.AASound = 'warrior-aa.wav'
		this.AAWidth = 36
		this.AAHiehgt = 23
		this.invulnerableDuration = 500
		this.ability2Cooldown = 1000
		this.ability3Cooldown = 1000 * 30
	}

	ability2() {
		if(!super.ability2()) return

		this.invulnerable = true
		this.game.socket.emit('abilityEvent', {
			code: 'warriorA2S',
			charName: this.game.selectedChar
		})
		setTimeout(() => {
			this.invulnerable = false
			this.game.socket.emit('abilityEvent', {
				code: 'warriorA2E',
				charName: this.game.selectedChar
			})
		}, this.invulnerableDuration)
	}

	ability3() {
		if(!super.ability3()) return
		this.game.soundManager.play('heal.ogg')
		this.health += this._maxHealth * 0.7
	}

	render() {
		super.render()
		if(this.invulnerable) {
			this.game.renderer.image(
				this.game.assets.images['warrior-aura.png'],
				0, 0, 72, 72,
				this.axis.X - 36 - this.game.camera.topLeft.X, 
				this.axis.Y - 36 - this.game.camera.topLeft.Y
			)
		}
	}
}