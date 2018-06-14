export class Firebal {
	constructor(game, data) {
		this.game = game;
		this.dragonID = data.dragonID;
		this.ID = data.ID;
		//Center coordinates, not top left
		this.X = data.X;
		this.Y = data.Y;
		this.damage = data.damage;
		this.width = 30;
		this.height = 26;
		this.spriteName = 'firebal.png';
		this.radius = 15;
	}
	updateState(data) {
		this.X = data.X;
		this.Y = data.Y;
	}
	render() {
		const renderer = this.game.renderer;
		const image = this.game.assets.images[this.spriteName];
		renderer.image(
			image, 
			10, 11,
			this.width, this.height,
			parseInt(this.X - 15 - this.game.camera.topLeft.X), 
			parseInt(this.Y - 13 - this.game.camera.topLeft.Y)
		);
	}
	hasHitPlayer(player) {
		return (Math.abs(this.X - player.axis.X) < 30 &&
				Math.abs(this.Y - player.axis.Y) < 30);
	}
	doDamageTo(player) {
		const damageToDo = this.damage * (100 - (player.defence + player.bonusDefence)) / 100
		if(damageToDo < 0) return
		player.health -= damageToDo;
	}
}

export class BasicAttack {

	constructor(player, data) {
		this.player = player
		this.cX = data.cX
		this.cY = data.cY
		this.vX = data.vX
		this.vY = data.vY
		this.angle = player.game.Vector.angle(data.vX, data.vY)
		this.ID = data.ID
		this.sX = data.sX
		this.sY = data.sY
		this.width = data.width
		this.height = data.height
		this.spriteName = data.spriteName
		this.speed = data.speed
		this.travelledDistance = 0
		this.range = data.range
		this.damage = data.damage
	}

	update() {
		this.updatePosition()
		const dragons = this.player.game.dragons
		for(let ID in dragons) {
			if(this.hasHitDragon(dragons[ID])) {
				this.player.game.socket.emit('abilityEvent', {
					code: 'AAE',
					charName: this.player.game.selectedChar,
					ID: this.ID
				})
				this.doDamageTo(dragons[ID])
				this.die()
			}
		}
	}

	updatePosition() {
		const xInc = this.vX * this.speed 
		const yInc = this.vY * this.speed
		this.travelledDistance += Math.sqrt(xInc * xInc + yInc * yInc)
		this.cX += xInc
		this.cY += yInc
		if(this.travelledDistance > this.range) this.die() 
	}

	render() {
		const renderer = this.player.game.renderer
		renderer.ctx.save()
		renderer.ctx.translate(
			parseInt(this.cX - this.player.game.camera.topLeft.X),
			parseInt(this.cY - this.player.game.camera.topLeft.Y)
		)
		renderer.ctx.rotate(this.angle)
		renderer.image(
			this.player.game.assets.images[this.spriteName],
			this.sX, this.sY, this.width, this.height,
			-this.width / 2, -this.height / 2 
		)
		renderer.ctx.restore()
	}

	die() {
		delete this.player.basicAttacks[this.ID]
	}

	hasHitDragon(dragon) {
		if(Math.abs(this.cX - dragon.axisX) < 30 &&
				Math.abs(this.cY - dragon.axisY) < 30) {
			console.log('Dragon hit')
			return true
		}
		return false
	}

	doDamageTo(dragon) {
		this.player.game.socket.emit('dragonsEvent', {
			code: 'dragonHit',
			damage: this.damage + this.player.bonusDamage,
			dragonID: dragon.ID,
			charName: this.player.game.selectedChar
		})
	}

	getPackage(initial = false) {
		if(initial) return {
			charName: this.game.selectedChar,
			ID: this.ID,
			X: this.cX, 
			Y: this.cY
		}
		return {
			ID: this.ID,
			X: this.cX, 
			Y: this.cY
		}
	}
}