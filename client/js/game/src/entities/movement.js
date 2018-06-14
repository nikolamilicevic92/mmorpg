export class BasicMovement {

	constructor(hero) {
		this.hero     = hero
		this.keys     = hero.game.keyboard.keys
		this.speed    = hero.props.speed
		this.brSpeed  = hero.props.bonusRunningSpeed
		this.map      = hero.game.map
		this.shift    = false
	}

	update() {
		const speed    = this.getSpeed(),
		      velocity = this.getVelocity(speed)
		if(this.hero.props.energy < 100) {
			this.hero.props.energy += 0.1
		}
		 this.updateHeroAnimation(velocity)
		 this.checkMapCollision(velocity)
		.then(v => {
			if(this.hero.props.canMove) {
				this.setHeroPosition(v)
			}
		})
	}

	getSpeed() {
		let speed = this.speed
		if(this.keys[' '] && this.hero.props.energy > 0) {
			speed += this.brSpeed
			this.hero.props.energy -= 0.5
			this.shift = true
		} else {
			this.shift = false
		}
		return speed
	}
	
	getVelocity(speed) {
		let velocity = [0, 0]
		if(this.keys['w'] || this.keys['W'] || this.keys['ArrowUp']) {
			velocity[1] = -speed
		} else if(this.keys['s'] || this.keys['S'] || this.keys['ArrowDown']) {
			velocity[1] = speed
		} else if(this.keys['a'] || this.keys['A'] || this.keys['ArrowLeft']) {
			velocity[0] = -speed
		} else if(this.keys['d'] || this.keys['D'] || this.keys['ArrowRight']) {
			velocity[0] = speed
		}
		return velocity
	}

	updateHeroAnimation(velocity) {
		if(velocity[0] != 0 || velocity[1] != 0) {
			const newAnimation = this.calculateNewAnimation(velocity)
			if(newAnimation != this.hero.props.activeAnimation) {
				this.setHeroAnimation(newAnimation)
				this.resetHeroAnimationFrame()
			}
			this.updateHeroAnimationTime()
		} else {
			this.resetHeroAnimationFrame()
		}
	}

	checkMapCollision(velocity) {
		return new Promise((resolve, reject) => {
			const tiles = this.map.getTilesInTheWay(
				this.hero.boundingRect(10, 10), [velocity[0], velocity[1]]
			)
			if(velocity[0] > 0) {
				if(tiles.right.indexOf(2) != -1) velocity[0] = 0
			} else if(velocity[0] < 0) {
				if(tiles.left.indexOf(2) != -1) velocity[0] = 0
			}
			if(velocity[1] > 0) {
				if(tiles.bottom.indexOf(2) != -1) velocity[1] = 0
			} else if(velocity[1] < 0) {
				if(tiles.top.indexOf(2) != -1) velocity[1] = 0
			}
			resolve(velocity)
		})
	}

	updateHeroAnimationTime() {
		if(this.shift) {
			this.hero.props.time += 16 * 2
		} else {
			this.hero.props.time += 16
		}
		if(this.hero.props.time >= this.hero.props.interval) {
			this.hero.props.time = 0
			this.hero.props.frame++
			const animation = this.hero.props.activeAnimation
			if(this.hero.props.frame >= this.hero.animations[animation].length) {
				this.hero.props.frame = 0
			}
		}
	}

	calculateNewAnimation(velocity) {
		if     (velocity[0] > 0) return 'walk-right'
		else if(velocity[0] < 0) return 'walk-left'
		else if(velocity[1] > 0) return 'walk-down'
		else if(velocity[1] < 0) return 'walk-up'
	}

	resetHeroAnimationFrame() {
		this.hero.props.frame = 0
		this.hero.props.time  = 0
	}

	setHeroAnimation(newAnimation) {
		this.hero.props.activeAnimation = newAnimation
	}

	setHeroPosition(velocity) {
		this.hero.props.X += velocity[0]
		this.hero.props.Y += velocity[1]
	}
}