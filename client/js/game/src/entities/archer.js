import { Character } from './character'

export class Archer extends Character {

	constructor(game, data) {
		super(game, data)
		this.AAWidth = 40
		this.AAHeight = 40
		this.AASound = 'archer-aa.ogg'
		this.A2Sound = 'archer-aa.ogg'
		this.A3Sound = 'archer-aa.ogg'
		this.ability2Cooldown = 1000 * 5 
		this.ability2Mult = 3
		this.ability3Mult = 10
		this.AASpriteName = 'Ardentryst-arrow1.png'
		this.A2SpriteName = 'Ardentryst-arrow2.png'
		this.A3SpriteName = 'Ardentryst-arrow3.png'
		this.ability3Cooldown = 1000 * 10
	}


	ability2() {
		if(!super.ability2()) return

		const dX = this.game.mouse.worldX, dY = this.game.mouse.worldY
		const ID = Math.random()
		const magnitude = Math.sqrt(Math.pow(dX - this.axis.X, 2) + Math.pow(dY - this.axis.Y, 2));
		const vX = (dX - this.axis.X) / magnitude, vY = (dY - this.axis.Y) / magnitude
		const data = {
			cX: this.axis.X, cY: this.axis.Y,
			vX: vX, vY: vY, ID: ID, 
			range: this.AARange, speed: this.AASpeed,
			damage: this.attack * this.ability2Mult, 
			spriteName: this.A2SpriteName,
			sX: 0, sY: 0, width: 40, height: 40
		}
		this.addBasicAttack(data)
		this.game.socket.emit('abilityEvent', {
			code: 'AAS', data: data, charName: this.game.selectedChar
		})
	}


	ability3() {
		if(!super.ability3()) return

		const dX = this.game.mouse.worldX, dY = this.game.mouse.worldY
		const ID = Math.random()
		const magnitude = Math.sqrt(Math.pow(dX - this.axis.X, 2) + Math.pow(dY - this.axis.Y, 2));
		const vX = (dX - this.axis.X) / magnitude, vY = (dY - this.axis.Y) / magnitude
		const data = {
			cX: this.axis.X, cY: this.axis.Y,
			vX: vX, vY: vY, ID: ID, 
			range: this.AARange, speed: this.AASpeed,
			damage: this.attack * this.ability3Mult, 
			spriteName: this.A3SpriteName,
			sX: 0, sY: 0, width: 40, height: 40
		}
		this.addBasicAttack(data)
		this.game.socket.emit('abilityEvent', {
			code: 'AAS', data: data, charName: this.game.selectedChar
		})
	}
}