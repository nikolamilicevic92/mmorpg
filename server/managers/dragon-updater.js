class StaticDragonUpdater {

	constructor(dragon) {
		this.dragon     = dragon
		this.props      = dragon.props
		this.animations = dragon.props.animations
	}

	update() {
		this.updateDragonAnimationTime()
	}

	updateDragonAnimationTime() {
		this.props.time += 16
		if(this.props.time >= this.props.interval) {
			this.props.time = 0
			this.props.frame++
			const animation = this.props.activeAnimation
			if(this.props.frame >= this.animations[animation].length) {
				this.props.frame = 0
			}
		}
	}

	
}

module.exports = {
	StaticDragonUpdater
}