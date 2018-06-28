

export class HeroRenderer {

	constructor(hero) {
		this.hero     = hero
		this.renderer = hero.game.renderer
		this.topLeft  = hero.game.camera.topLeft
		this.sprite   = hero.props.sprite
		this.hWidth   = hero.props.width / 2
		this.hHeight  = hero.props.height / 2
		this.width    = hero.props.width
		this.height   = hero.props.height
	}

	render() {
		if(this.hero.props.levelUpAura) {
			this.renderLevelUpAura()
		}
		this.renderHeroSprite()
		this.renderHeroHealthBar()
		this.renderHeroInfo()
	}

	renderHeroSprite() {
		const     frame = this.hero.props.frame
		const animation = this.hero.animations[this.hero.props.activeAnimation]  
		this.renderer.image(
			this.sprite,
			animation[frame][0], animation[frame][1],
			this.width, this.height,
			this.heroTopLeftX, this.heroTopLeftY
		)
	}

	get heroX() {
		return parseInt(this.hero.props.X - this.topLeft.X)
	}

	get heroY() {
		return parseInt(this.hero.props.Y - this.topLeft.Y)
	}

	get heroTopLeftX() {
		return parseInt(this.heroX - this.hWidth)
	}

	get heroTopLeftY() {
		return parseInt(this.heroY - this.hHeight)
	}

	renderHeroHealthBar() {
		const width = this.hero.props.health / this.hero.props.maxHealth * 35
		this.renderer.fillRect(
			this.heroX - 20, this.heroTopLeftY - 9,
			35, 5, 'white'
		)
		this.renderer.fillRect(
			this.heroX - 20, this.heroTopLeftY - 9,
			width, 5, 'red'
		)
	}

	renderHeroInfo() {
		this.renderer.text(this.hero.props.name, this.heroX, this.heroTopLeftY - 18, {
			fill : this.hero.props.infoColor,
			fontFamily : 'Arial',
			fontSize   : '12px'
		})
	}

	renderLevelUpAura() {
		this.renderer.image(
			'level-up.png',
			0, 0, 80, 120,
			this.heroX - 45,
			this.heroTopLeftY - 70,
			90, 120
		)
	}
}

export class DragonRenderer {

	constructor(dragon) {
		this.dragon   = dragon
		this.renderer = dragon.game.renderer
		this.topLeft  = dragon.game.camera.topLeft
		this.sprite   = dragon.props.sprite
		this.hWidth   = dragon.props.width / 2
		this.hHeight  = dragon.props.height / 2
		this.width    = dragon.props.width
		this.height   = dragon.props.height
	}

	get dragonX() {
		return parseInt(this.dragon.props.X - this.topLeft.X)
	}

	get dragonY() {
		return parseInt(this.dragon.props.Y - this.topLeft.Y)
	}

	get dragonTopLeftX() {
		return parseInt(this.dragonX - this.hWidth)
	}

	get dragonTopLeftY() {
		return parseInt(this.dragonY - this.hHeight)
	}

	render() {
		this.renderDragonSprite()
		this.renderDragonHealthBar()
		this.renderDragonHealthPoints()
		this.renderDragonInfo()
	}

	renderDragonSprite() {
		const     frame = this.dragon.props.frame,
		      animation = this.dragon.animations[this.dragon.props.activeAnimation]  
		this.renderer.image(
			this.sprite,
			animation[frame][0], animation[frame][1],
			this.width, this.height,
			this.dragonTopLeftX, this.dragonTopLeftY
		)
	}

	renderDragonHealthBar() {
		const width = this.dragon.props.health / this.dragon.props.max_health * 80
		this.renderer.fillRect(
			this.dragonX - 40, this.dragonTopLeftY - 9,
			80, 10, 'white'
		)
		this.renderer.fillRect(
			this.dragonX - 40, this.dragonTopLeftY - 9,
			width, 10, 'red'
		)
	}

	renderDragonHealthPoints() {
		this.renderer.text(parseInt(this.dragon.props.health), this.dragonX, this.dragonTopLeftY + 10, {
			fill: 'white',
			fontFamily : 'Arial',
			fontSize   : '12px'
		})
	}

	renderDragonInfo() {
		this.renderer.text(this.dragon.props.name, this.dragonX, this.dragonTopLeftY - 28, {
			fill       : 'white',
			fontFamily : 'Arial',
			fontSize   : '12px'
		})
	}
}