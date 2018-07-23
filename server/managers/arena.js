
module.exports = class Arena {

	constructor(DRAGONS, HEROES, FIREBALLS) {
		this.DRAGONS   = DRAGONS
		this.HEROES    = HEROES
		this.FIREBALLS = FIREBALLS
	}

	update() {
		let closestHero, dragon, fireball
		//First select dragons that are within certian range of player with quadtree
		for(let id in this.DRAGONS) {
			dragon = this.DRAGONS[id]
			if(dragon.canAttack) {
				const data = this.closestHero(dragon)
				if(data) {
					this.turnDragonAtHero(dragon, data.hero)
					this.performAttack(dragon, data)
				} else {
					dragon.animation(dragon.props.defaultAnimation)
				}
			}
		}
		for(let fID in this.FIREBALLS) {
			fireball = this.FIREBALLS[fID]
			fireball.update()
			if(fireball.shouldDie()) {
				this.removeFireball(fID)
			}

		}
	}

	closestHero(dragon) {
		let min = 9999, distance, _id
		for(let id in this.HEROES) {
			distance = this.distance(
				dragon.props.X, this.HEROES[id].props.X,
				dragon.props.Y, this.HEROES[id].props.Y
			)
			if(distance < min) {
				min = distance
				_id = id 
			}
		}
		if(min < dragon.props.a1_range) {
			return {
				distance: min,
				hero    : this.HEROES[_id]
			}
		} else {
			return false
		}
	}

	turnDragonAtHero(dragon, hero) {
		const hDistance = dragon.props.X - hero.props.X,
			  vDistance = dragon.props.Y - hero.props.Y
		if(Math.abs(hDistance) > Math.abs(vDistance)) {
			if(hDistance < 0) {
				dragon.animation('fly-right')
			} else {
				dragon.animation('fly-left')
			}
		} else {
			if(vDistance < 0) {
				dragon.animation('fly-down')
			} else {
				dragon.animation('fly-up')
			}
		}
	}

	performAttack(dragon, data) {
		const hero 				  = data.hero, 
			  magnitude 		  = data.distance,
			  fsl 				  = this.fireballSpawnLocation(dragon),
			  velocity 			  = {
			  	X: ((hero.props.X - fsl.X) / magnitude) * dragon.props.a1_speed,
			  	Y: ((hero.props.Y - fsl.Y) / magnitude) * dragon.props.a1_speed 
			  }
		this.addFireball(dragon, fsl, velocity)
		dragon.canAttack = false
		setTimeout(() => dragon.canAttack = true, dragon.props.a1_cooldown)
	}

	addFireball(dragon, location, velocity) {
		const ID = Math.random()
		for(let id in this.HEROES) {
			this.HEROES[id].socket.emit('fireball', {
				ID, location, velocity, name: dragon.props.name,
				damage: dragon.props.a1_damage, speed: dragon.props.a1_speed,
				range: dragon.props.a1_range
			})
		}
	}

	fireballSpawnLocation(dragon) {
		let location = {X: dragon.props.X, Y: dragon.props.Y}
		if(dragon.props.activeAnimation == 'fly-up') {
			location.Y -= 50
		} else if(dragon.props.activeAnimation == 'fly-right') {
			location.X += 50
		} else if(dragon.props.activeAnimation == 'fly-down') {
			location.Y += 50
		} else {
			location.X -= 50
		}
		return location
	}

	distance(X1, X2, Y1, Y2) {
		return Math.sqrt(Math.pow(X2 - X1, 2) + Math.pow(Y2 - Y1, 2))
	}
}