const Dragon = require('./dragon')

module.exports = class PatrollingDragon extends Dragon {

	constructor(...data) {
		super(...data)
		this.velocity = [0, 0]
		this.patrolPoints = []
		this.nextPoint = null
		this.speed = 0.8
		this.patrolFunc = null
	}

	update() {
		super.update()
		this.patrolFunc()
	}

	patrolV(Y1, Y2) {
		this.patrolPoints = [Y1, Y2]
		if(Math.random() < 0.5) this.nextPoint = Y1
		else this.nextPoint = Y2
		this.Y = Math.random() * (Math.abs(Y2 - Y1)) + Y1
		if(this.Y < this.nextPoint) {
			this.velocity[1] = 1
		} else {
			this.velocity[1] = -1
		}
		this.patrolFunc = () => {
			if(!this.inCombat) {
				this.Y += this.velocity[1]
				if(Math.abs(this.Y - this.nextPoint) < 3) {
					if(this.nextPoint == this.patrolPoints[0]) {
						this.nextPoint == this.patrolPoints[1]
					} else {
						this.nextPoint = this.patrolPoints[0]
					}
					if(this.Y < this.nextPoint) {
						this.velocity[1] = 1
						this.setAnimation('fly-down')
					} else {
						this.velocity[1] = -1
						this.setAnimation('fly-up')
					}
				}
			}
		}
	}

	patrolH(X1, X2) {
		this.patrolPoints = [X1, X2]
		if(Math.random() < 0.5) {
			this.velocity[0] = 1
		} else {
			this.velocity[0] = -1
		}
		this.patrolFunc = () => {
			if(!this.inCombat) {
				let inc = this.velocity[0] * this.speed 
				if(this.X + inc < this.patrolPoints[0]) {
					this.velocity[0] = 1
					inc = Math.abs(inc)
				} else if(this.X + this.width + inc > this.patrolPoints[1]) {
					this.velocity[0] = -1
					inc = -Math.abs(inc)
				}
				this.X += inc
				if(this.velocity[0] < 0) {
					this.setAnimation('fly-left')
				} else {
					this.setAnimation('fly-right')
				}
			}
		}
	}
}