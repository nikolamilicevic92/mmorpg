import { VectorFromPoints, Point } from '../../../tools/geometry'

class Orb {

  constructor(emiter, X, Y, id, props) {
    this.emiter     = emiter
    this.props      = props
    this.game       = emiter.game
    this.topLeft    = emiter.game.camera.topLeft
    this.X          = X
    this.Y          = Y
    this.id         = id
    this.halfWidth  = props.width / 2
    this.halfHeight = props.height / 2
    this.HPRestore  = 0.2
    this.radius     = 30
  }

  update() {
    const distance = Point.distance(
      { X: this.X, Y: this.Y },
      { X: this.game.self.props.X, Y: this.game.self.props.Y }
    )
    if(distance < this.radius) {
      this.game.self.health += this.game.self.props.maxHealth * this.HPRestore
      this.game.soundManager.play(this.props.sound)
      this.die()
    }
  }

  render() {
    this.game.renderer.imageBasic(
      this.props.sprite,
      parseInt(this.X - this.topLeft.X - this.halfWidth), 
      parseInt(this.Y - this.topLeft.Y - this.halfHeight),
      this.props.width, this.props.height
    )
  }

  die() {
    this.emiter.socket.emit('ability', {
      heroID   : this.emiter.hero.props.id,
      id       : this.props.id,
      orbID    : this.id,
      forOwner : true
    })
    this.emiter.removeInstance(this.id)
  }
}

export class HealingOrbEmiter {

  constructor(hero, props, triggerFunction) {
		this.hero           = hero
    this.game           = hero.game
    this.inScreen       = hero.game.camera.containsPoint
    this.topLeft        = hero.game.camera.topLeft
		this.socket         = hero.game.socket
    this.props          = props
		this.timeoutHandle  = null
    this.cooldownTimer  = 0
    this.duration       = 1000 * 30
    this.maxOrbs        = 5
    this.instances      = {}
    this.instancesId    = []
    this.triggered      = triggerFunction
    this.maxDistance    = props._range
	}

	update() {
    this.updateInstances()
		if(this.cooldownTimer <= 0 && this.triggered()) {
      let X = this.game.mouse.worldX, Y = this.game.mouse.worldY
      const v = new VectorFromPoints(
        { X: this.hero.props.X, Y: this.hero.props.Y }, 
        { X, Y }, true
      )
      if(v.magnitude > this.maxDistance) {
        v.unit()
        X = this.hero.props.X + v.X * this.maxDistance
        Y = this.hero.props.Y + v.Y * this.maxDistance
      }
      const orbID = Math.random()
      this.socket.emit('ability', {
        heroID: this.hero.props.id,
        id    : this.props.id,
        X, Y, orbID
      })
			this.activate(orbID, X, Y)
		}	
	}

	render() {
		for(let id in this.instances) {
      this.instances[id].render()
    }
  }

  processPackage(data) {
    if(data.X && data.Y) {
      this.addInstance(data.orbID, data.X, data.Y)
    } else {
      this.removeInstance(data.orbID)
    }
  }
  
  addInstance(id, X, Y) {
    while(this.instancesId.length >= this.maxOrbs) {
      const toRemove = this.instancesId[0]
      this.removeInstance(toRemove)
      this.socket.emit('ability', {
        heroID : this.hero.props.id,
        id     : this.props.id,
        orbID  : toRemove
      })
    }
    this.instances[id] = new Orb(this, X, Y, id, this.props)
    this.instancesId.push(id)
    setTimeout(() => {
      this.removeInstance(id)
    }, this.duration)
    console.log(this.instancesId.length)
  }

  removeInstance(id) {
    if(this.instances[id]) {
      delete this.instances[id]
      this.instancesId.splice(this.instancesId.indexOf(id), 1)
    }
  }

	activate(...data) {
    this.addInstance(...data)
		this.cooldownTimer = this.props.cooldown
		if(this.timeoutHandle) {
			clearTimeout(this.timeoutHandle)
		}
		this.tickCooldown()
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

  updateInstances() {
    for(let id in this.instances) {
      this.instances[id].update()
    }
  }
}