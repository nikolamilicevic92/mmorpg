import { VectorFromPoints, Point, Vector, rectCollision } from '../../tools/geometry'


class Projectile {

	constructor(emiter, location, target) {
		this.sprite            = emiter.props.sprite
		this.width             = emiter.props.width
		this.height            = emiter.props.height
		this.halfWidth         = this.width / 2
		this.halfHeight        = this.height / 2
		this.location          = new Point(location.X, location.Y)
		this.renderer          = emiter.hero.game.renderer
		this.cameraTopLeft     = emiter.hero.game.camera.topLeft
		this.velocity          = new VectorFromPoints(location, target, true)
		this.velocity.unit().multiply(emiter.props.speed)
		this.travelledDistance = 0
	}

	boundingRect(offsetX = 0, offsetY = 0) {
		return {
			X: this.location.X  - this.halfWidth  + offsetX, 
			Y: this.location.Y  - this.halfHeight + offsetY,
			width : this.width  - offsetX * 2, 
			height: this.height - offsetY * 2
		}
	}

	hitbox(offset = 5) {
		const offsetDoubled = 2 * offset
		return {
			X     : this.location.X  - offset, 
			Y     : this.location.Y  - offset,
			width : offsetDoubled, 
			height: offsetDoubled
		}
	}

	update() {
		this.location.add(this.velocity)
		this.travelledDistance += this.velocity.magnitude
	}

	render() {
		const p = Point.subtract(this.location, this.cameraTopLeft)
		this.renderer.rotate(this.velocity.angle)
		this.renderer.imageBasic(
			this.sprite, 
			parseInt(p.X), parseInt(p.Y), 
			this.width, this.height	
		)
	}
}

//Use quadtree...

export class ProjectileEmiter {

	constructor(hero, props, triggerFunction) {
		this.hero           = hero
		this.game           = hero.game
		this.camera         = hero.game.camera
		this.mouse          = hero.game.mouse
		this.soundManager   = hero.game.soundManager
		this.socket         = hero.game.socket
		this.props          = props
		this.timeoutHandle  = null
		this.cooldownTimer  = 0
		this.instances      = {}
		this.triggered      = triggerFunction
	}

	update() {
		if(this.cooldownTimer <= 0 && this.triggered()) {
			this.activate()
		}	
		this.updateInstances()
		let instance, dragon
		for(let ID in this.instances) {
			instance = this.instances[ID]
			if(instance.travelledDistance > this.props._range) {
				this.removeInstance(ID)
				this.socket.emit('ability', {
					heroID: this.hero.props.id,
					id    : this.props.id,
					data  : { ID }
				})
				continue
			}
			for(let dID in this.game.dragons) {
				dragon = this.game.dragons[dID]
				if(rectCollision(instance.hitbox(), dragon.hitbox())) {
					this.removeInstance(ID)
					this.socket.emit('ability', {
						heroID: this.hero.props.id,
						id    : this.props.id,
						data  : { ID }
					})
					const damage = this.props.damage * this.hero.props.attack + this.hero.props.bonusAttack
					this.game.chat.appendMessage({
						activeCard: 4,
						message   : `Did ${damage} damage to ${dragon.props.name}`
					}, true)
					this.socket.emit('dragonHit', {
						name  : this.hero.props.name,
						ID    : dID,
						damage: damage
					})
					break
				}
			}
		}
	}

	updateInstances() {
		for(let ID in this.instances) {
			this.instances[ID].update()
		}
	}

	render() {
		for(let ID in this.instances) {
			this.instances[ID].render()
		}
	}

	activate() {
		this.cooldownTimer = this.props.cooldown
		if(this.timeoutHandle) {
			clearTimeout(this.timeoutHandle)
		}
		this.tickCooldown()
		this.shootProjectile()
	}

	tickCooldown() {
		if(this.cooldownTimer <= 0) {
			return
		}
		this.timeoutHandle = setTimeout(() => {
			this.cooldownTimer -= 0.1
			this.tickCooldown()
		}, 100)
	}

	shootProjectile() {
		const target   = {X: this.mouse.worldX, Y: this.mouse.worldY},
			  location = {X: this.hero.props.X, Y: this.hero.props.Y},
			  ID       = Math.random()
		this.addInstance({ 
			ID, location, target 
		})
		this.socket.emit('ability', {
			heroID: this.hero.props.id,
			id    : this.props.id,
			data  : { ID, location, target }
		})
	}

	addInstance(data) {
		this.instances[data.ID] = new Projectile(
			this, data.location, data.target
		)
		if(this.props.sound && this.camera.containsPoint(data.location)) {
			this.soundManager.play(this.props.sound)
		}
	}

	removeInstance(ID) {
		delete this.instances[ID]
	}

	processPackage(pack) {
		if(pack.data.location) {
			this.addInstance(pack.data)
		} else {
			this.removeInstance(pack.data.ID)
		}
	}

	setTrigger(triggerFunction) {
		this.triggered = triggerFunction
	}
}