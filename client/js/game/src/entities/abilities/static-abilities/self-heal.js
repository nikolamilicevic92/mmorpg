

export class SelfHeal {

  constructor(hero, props, triggerFunction) {
		this.hero           = hero
    this.props          = props
		this.timeoutHandle  = null
    this.cooldownTimer  = 0
    this.triggered      = triggerFunction
    this.HPRestore      = 0.3
	}

	update() {
		if(this.cooldownTimer <= 0 && this.triggered()) {
      this.hero.health += this.hero.props.maxHealth * this.HPRestore
      this.hero.game.soundManager.play(this.props.sound)
      this.cooldownTimer = this.props.cooldown
      this.tickCooldown()
		}	
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
  
  render() {}

  processPackage() {}

  updateInstances() {}
}