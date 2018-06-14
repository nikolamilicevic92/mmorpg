const Firebal = require('./firebal')

const DRAGON_ANIMATIONS = {
	'fly-up': [[144, 0], [288, 0], [144, 0], [0, 0]],
	'fly-right': [[144, 124], [288, 124], [144, 124], [0, 124]],
	'fly-down': [[144, 248], [288, 248], [144, 248], [0, 248]],
	'fly-left': [[144, 372], [288, 372], [144, 372], [0, 372]]
}
const DRAGON_TYPES = [
	'flying_dragon-red.png',
	'flying_dragon-gold.png',
	'flying_twin_headed_dragon-blue.png',
	'flying_twin_headed_dragon-red.png'
]

module.exports = class Dragon {

	//Initializing stuff

	constructor(manager, X, Y, ID, data, defaultAnimation) {
		this.manager = manager
		this.oX = X - 62
		this.oY = Y - 65
		this.X = this.oX
		this.Y = this.oY
		this.ID = ID
		this.spriteName = data.spriteName
		this.interval = 300
		this.width = 124
		this.height = 130
		this.attackDamage = data.attack
		this.health = data.maxHealth
		this.attackSpeed = data.attackSpeed
		this.attackFrequency = data.attackFrequency
		this.attackCooldown = 0
		this.canAttack = true
		this.respawnTimer = 1000 * data.respawnTimer
		this.inCombat = false
		this.attackRange = data.attackRange
		this.maxHealth = data.maxHealth
		this.healthRegen = 0.1
		this.expOnDeath = data.expOnDeath
		this.firebals = {}
		this.defaultAnimation = defaultAnimation
		this.activeAnimation = defaultAnimation
		console.log(this.activeAnimation)
	}

	//Has a small chance of changing dragon's direction
	//Updates position, animation time, attack cooldown
	//For each alive firebal, runs its update method

	update() {
		if(!this.inCombat) {
			this.health += this.healthRegen
		}
		if(this.health > this.maxHealth) {
			this.health = this.maxHealth
		}
		if(this.attackCooldown > 0) {
			this.attackCooldown--
		} else {
			this.canAttack = true
		}
		for(let ID in this.firebals) {
			this.firebals[ID].update()
		}
	}

	//Returns information about dragon that will be sent to the client

	getPackage(initial = false) {
		if(initial) return {
			X: this.X, Y: this.Y, spriteName: this.spriteName,
			animation: this.activeAnimation,
			width: this.width, height: this.height,
			health: this.health, maxHealth: this.maxHealth,
			interval: this.interval
		}
		return {
			X: this.X, Y: this.Y, health: this.health,
			animation: this.activeAnimation
		}
	}
	
	//Spawns a new firebal toward a given player and changes dragon's
	//direction so that it faces player
	//Disables attacking for a while
	//Notifies manager about new firebal so that it will notify 
	//the client about it

	attack(player) {
		this.attackCooldown = this.attackFrequency
		this.canAttack = false
		const ID = Math.random() + ''
		let cX = this.X + this.width / 2
		let cY = this.Y + this.height / 2
		this.alterAnimationOnAttack(cX, cY, player.axisX, player.axisY)
		if(this.activeAnimation == 'fly-right') cX += 50
		else if(this.activeAnimation == 'fly-left') cX -= 50
		else if(this.activeAnimation == 'fly-up') cY -= 50
		else cY += 50
		this.firebals[ID] = new Firebal(
			this, ID, 
			cX, 
			cY,
			player.axisX, player.axisY, 50,
			this.attackSpeed,
			this.attackDamage,
			this.attackRange
		)
		this.manager.onNewFirebal(this.firebals[ID].getPackage(true))
	}

	//Deletes a firebal from firebals array

	removeFirebal(ID) {
		if(this.firebals[ID]) {
			delete this.firebals[ID]
			this.manager.onFirebalDeath(ID)
		}
	}

	setAnimation(name) {
		this.activeAnimation = name
	}

	alterAnimationOnAttack(cX, cY, dX, dY) {
		if(Math.abs(cX - dX) > Math.abs(cY - dY)) {
			if(cX < dX) this.setAnimation('fly-right')
			else this.setAnimation('fly-left')
		} else {
			if(cY < dY) this.setAnimation('fly-down')
			else this.setAnimation('fly-up')
		}
	}

	getClosestPlayer(players) {
		let closestPlayerName = '', min = this.attackRange
		for(let name in players) {
			const p = players[name]
			if(p.invisible) continue
			const distance = Math.sqrt(
				Math.pow(this.X + this.width / 2 - p.axisX, 2) + 
				Math.pow(this.Y + this.height / 2 - p.axisY, 2)
			)
			if(distance < min) {
				closestPlayerName = name
				min = distance
			}
		}
		if(min < this.attackRange) {
			this.inCombat = true
			return closestPlayerName
		}
		this.inCombat = false
		return ''
	}

	respawn() {
		this.activeAnimation = this.defaultAnimation
		this.Y = -2000
		this.health = this.maxHealth
		setTimeout(() => {
			this.X = this.oX, this.Y = this.oY
		}, this.respawnTimer)
	}
}