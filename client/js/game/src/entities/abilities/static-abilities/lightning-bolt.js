import { VectorFromPoints, rectCollision } from '../../../tools/geometry'

export class LightningBolt {

  constructor(hero, props, triggerFunction) {
		this.hero           = hero
    this.game           = hero.game
    this.inScreen       = hero.game.camera.containsPoint
    this.topLeft        = hero.game.camera.topLeft
		this.socket         = hero.game.socket
    this.props          = props
    this.sprite         = props.sprite
    this.halfWidth      = props.width  / 2
    this.halfHeight     = props.height / 2
    this.X              = null
    this.Y              = null
		this.timeoutHandle  = null
    this.cooldownTimer  = 0
    this.active         = false
    this.duration       = 500
    this.triggered      = triggerFunction
    this.maxDistance    = props._range
	}

	update() {
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
      this.socket.emit('ability', {
        heroID: this.hero.props.id,
        id    : this.props.id,
        X, Y
      })
      this.checkIfDragonIsHit(X, Y)
			this.activate(X, Y)
		}	
	}

	render() {
		if(this.active) {
      this.game.renderer.imageBasic(
				this.props.sprite,
				parseInt(this.X - this.topLeft.X - this.halfWidth), 
        parseInt(this.Y - this.topLeft.Y - this.props.height + 45),
        this.props.width, this.props.height
      )
    }
  }

  checkIfDragonIsHit(X, Y) {
    const damage = this.props.damage * this.hero.props.attack + this.hero.props.bonusAttack
    const boltRect = {X: X, Y: Y, width: 1, height: 1}
    console.log('Bolt rect: ', boltRect)
    for(let id in this.game.dragons) {
      const dragon = this.game.dragons[id]
      console.log('Dragon rect: ', dragon.hitbox(50))
      if(rectCollision(boltRect, dragon.hitbox(50))) {
        this.game.chat.appendMessage({
          activeCard: 4,
          message   : `Did ${damage} damage to ${dragon.props.name}`
        }, true)
        this.socket.emit('dragonHit', {
          name  : this.hero.props.name,
          ID    : id,
          damage: damage
        })
      }
    }
  }
  
  processPackage(data) {
    this.active = true
    this.X = data.X
    this.Y = data.Y
    if(this.inScreen({X: data.X, Y: data.Y})) {
      this.game.soundManager.play(this.props.sound)
    }
    setTimeout(() => {
      this.active = false
    }, this.duration)
	}

	activate(X, Y) {
    this.active = true
    this.X = X, this.Y = Y
    this.game.soundManager.play(this.props.sound)
    setTimeout(() => {
      this.active = false
    }, this.duration)
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

  updateInstances() {}
}