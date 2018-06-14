import { DragonRenderer } from './renderer'

export class Dragon {

	constructor(game, props) {
		this.game       = game
		this.props      = Object.assign({}, props, {
			halfWidth : props.width  / 2,
			halfHeight: props.height / 2
		})
		this.animations = props.animations
		this.renderer   = new DragonRenderer(this)
	}

	boundingRect(offsetX = 0, offsetY = 0) {
		return {
			X: this.props.X - this.props.halfWidth  + offsetX, 
			Y: this.props.Y - this.props.halfHeight + offsetY,
			width : this.props.width  - offsetX * 2,
			height: this.props.height - offsetY * 2
		}
	}

	hitbox(offset = 10) {
		const offsetDoubled = 2 * offset
		return {
			X     : this.props.X  - offset, 
			Y     : this.props.Y  - offset,
			width : offsetDoubled, 
			height: offsetDoubled
		}
	}

	setProps(props) {
		for(let key in props) {
			this.props[key] = props[key]
		}
	}

	isInCamera() {
		const topLeft      = this.game.camera.topLeft,
			  screenWidth  = this.game.renderer.canvas.width,
			  screenHeight = this.game.renderer.canvas.height

		return (this.props.X + this.props.width > topLeft.X  && 
				this.props.X < topLeft.X + screenWidth       &&
		   		this.props.Y + this.props.height > topLeft.Y && 
		   		this.props.Y < topLeft.Y + screenHeight)
	}

	render() {
		if(!this.isInCamera()) return
		this.renderer.render()
	}
}