

export class Block {

  constructor(hero, props, triggerFunction) {
		this.hero           = hero
		this.game           = hero.game
		this.socket         = hero.game.socket
    this.props          = props
    this.sprite         = props.sprite
    this.halfWidth      = props.width  / 2
    this.halfHeight     = props.height / 2
		this.timeoutHandle  = null
    this.cooldownTimer  = 0
    this.active         = false
    this.duration       = 1500
		this.triggered      = triggerFunction
	}

	update() {
		if(this.cooldownTimer <= 0 && this.triggered()) {
      this.socket.emit('ability', {
        heroID: this.hero.props.id,
        id    : this.props.id
      })
			this.activate()
		}	
	}

	render() {
		if(this.active) {
      this.game.renderer.imageBasic(
				this.sprite,
				this.hero.renderer.heroX - this.halfWidth, 
        this.hero.renderer.heroY - this.halfHeight,
        this.props.width, this.props.height
      )
    }
  }
  
  processPackage() {
    this.active = true
    setTimeout(() => {
      this.active = false
    }, this.duration)
	}

	activate() {
    this.hero.props.invulnerable = true
    this.active = true
    setTimeout(() => {
      this.hero.props.invulnerable = false
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