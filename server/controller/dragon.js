const dragonModel             = require('../model/dragon'),
	  { StaticDragonUpdater } = require('../managers/dragon-updater')

module.exports = class Dragon {

	constructor(props) {
		this.props      = Object.assign({}, props, {
			originX: props.X, originY: props.Y,
			halfWidth: props.width / 2, halfHeight: props.height / 2,
			dead: false
		})
		this.updater    = new StaticDragonUpdater(this)
		this.attackers  = {} 
	}

	update() {
		this.updater.update()
		const timeLimit = Date.now() - 1000 * 30
		for(let name in this.attackers) {
			if(timeLimit > this.attackers[name].lastHitTime) {
				delete this.attackers[name]
			}
		}
	}

	setProps(props) {
		if(this.props.dead) return
		for(let key in props) {
			this.props[key] = props[key]
		}
	}

	getProps(initial = false) {
		let props = {
			id: this.props.id,
			X: this.props.X, Y: this.props.Y,
			activeAnimation: this.props.activeAnimation,
			frame: this.props.frame, health: this.props.health
		}
		if(initial) {
			props = Object.assign(
				{}, props, {
					id_type: this.props.id_type, name: this.props.name,
					width: this.props.width, height: this.props.height,
					max_health: this.props.max_health,
					sprite: this.props.sprite, 
					animations: this.props.animations
				}
			)
		}
		return props
	}

	static makeDragon(props) {
		return new Dragon(Object.assign(
			{}, props, {
				activeAnimation: props.defaultAnimation,
				health: props.max_health, time: 0, frame: 0,
				interval: 250
			} 
		))
	}

	static getDragonsBootstrapPackage() {
		return new Promise((resolve, reject) => {
			let promises = []
			promises.push(dragonModel.getEverything())
			promises.push(dragonModel.getDragonAnimations())
			Promise.all(promises)
			.then(data => resolve(data))
			.catch(err => reject(err))
		})
	}

	takeDamage(data, NAMES_SOCKETS) {
		if(this.attackers[data.name]) {
			this.attackers[data.name].damageDealt += data.damage
			this.attackers[data.name].lastHitTime = Date.now()
		} else {
			this.attackers[data.name] = {
				damageDealt: data.damage,
				lastHitTime: Date.now()
			}
		}
		const health = this.props.health - data.damage
		if(health <= 0) {
			this.giveExperienceAndGold(NAMES_SOCKETS)
			this.die()
		} else {
			this.props.health = health
		}
	}

	giveExperienceAndGold(NAMES_SOCKETS) {
		for(let name in this.attackers) {
			NAMES_SOCKETS[name].emit('expGoldBoost', {
				experience: this.props.experience_worth,
				gold      : this.props.gold_worth
			})
		}
	}

	die() {
		this.props.health = 0
		this.props.X      = -1000
		this.props.Y      = -1000
		this.props.dead   = true
		this.attackers    = {}
		setTimeout(() => {
			this.respawn()
		}, this.props.respawn_timer * 1000)
	}

	respawn() {
		this.props.health = this.props.max_health
		this.props.X      = this.props.originX
		this.props.Y      = this.props.originY
		this.props.dead   = false

	}
}