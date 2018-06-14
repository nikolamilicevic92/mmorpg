import { Character } from './character'

export class Ninja extends Character {

	constructor(game, data) {
		super(game, data)
		this.bushEnabled = false
		this.teleportRange = 300
		this.AASpriteName = 'ninja-aa.png'
		this.A2SpriteName = 'ninja-a2.png'
		this.A3SpriteName = 'ninja-a3.png'
		this.AASpeed = 6
		this.AASound = 'ninja-aa.wav'
		this.AAWidth = 40
		this.AAHeight = 40
		this.ability2Cooldown = 1000 * 15 
		this.invisibilityDuration = 1000 * 5
		this.speedBurstDuration = 1000
		this.AACooldownOnBurst = 100
		this.ability3Cooldown = 1000 * 1
		this.hpRegenMultOnA3 = 30
	}


	ability2() {
		if(!super.ability2()) return

		this.canUseAbility1 = true
		this.ability1Cooldown = this.AACooldownOnBurst
		setTimeout(() => this.ability1Cooldown = this.ability1BaseCooldown, this.speedBurstDuration)
	}


	ability3() {
		if(!super.ability3()) return
		this.bushEnabled = !this.bushEnabled
		if(this.bushEnabled) {
			this.invisible = true
			this.healthRegen = this.hpRegenMultOnA3 * this.baseHealthRegen
			this.game.socket.emit('abilityEvent', {
				code: 'NinjaA3S',
				charName: this.game.selectedChar
			})
		} else {
			this.invisible = false
			this.healthRegen = this.baseHealthRegen
			this.game.socket.emit('abilityEvent', {
				code: 'NinjaA3E',
				charName: this.game.selectedChar
			})
		}
	}


	render() {
		super.render()
		if(this.bushEnabled) {
			this.game.renderer.image(
				this.game.assets.images['terrain_atlas.png'],
				768, 384, 96, 96,
				this.axis.X - 48 - this.game.camera.topLeft.X,
				this.axis.Y - 48 - this.game.camera.topLeft.Y
			)
		}
	}
}