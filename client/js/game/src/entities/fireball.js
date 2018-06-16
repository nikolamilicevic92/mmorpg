export class Fireball {

	constructor(game, props) {
		this.game       	  = game
		this.ID               = props.ID
		this.location         = props.location
		this.velocity         = props.velocity
		this.speed            = props.speed
		this.damage           = props.damage
		this.range            = props.range
		this.name             = props.name
		this.travelledDistance = 0 
		this.width            = 30
		this.height           = 26
		this.spriteName       = 'firebal.png'
	}

	get X() { return this.location.X }
	get Y() { return this.location.Y }

	update() {
		this.location.X        += this.velocity.X
		this.location.Y        += this.velocity.Y
		this.travelledDistance += this.speed
		if(this.shouldDie()) {
			this.die()
			return
		}
		if(this.hasHitPlayer(this.game.self)) {
			this.doDamageTo(this.game.self)
			this.game.socket.emit('fireballDeath', this.ID)
			this.die()
		}
	}
	
	render() {
		const renderer = this.game.renderer,
			  image    = this.game.assets.images[this.spriteName]
		renderer.image(
			image, 
			10, 11,
			this.width, this.height,
			parseInt(this.X - 15 - this.game.camera.topLeft.X), 
			parseInt(this.Y - 13 - this.game.camera.topLeft.Y)
		)
	}

	hasHitPlayer(hero) {
		return Math.abs(this.X - hero.props.X) < 30 && Math.abs(this.Y - hero.props.Y) < 30
	}

	doDamageTo(hero) {
		const damageToDo = this.damage * (100 - (hero.props.defence + hero.props.bonusDefence)) / 100
		if(damageToDo < 0) return
		hero.health -= damageToDo
		this.game.chat.appendMessage({
			activeCard: 4,
			message   : `Took ${damageToDo} damage from ${this.name}`
		}, true)
	}

	shouldDie() {
		return this.travelledDistance > this.range
	}

	die() {
		delete this.game.fireballs[this.ID]
	}
}
