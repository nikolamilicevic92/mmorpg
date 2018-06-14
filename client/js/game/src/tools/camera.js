export class Camera {

	constructor(game) { 
		this.game           = game
		this.topLeft        = {X: 0, Y: 1200}
		this.target         = null
		this.manualMovement = true
		this.velocity       = [0, 0]
		this.speed          = 5
	}

	follow(obj) {
		this.target = obj
		this.manualMovement = false
	}

	update() {
		const keys = this.game.keyboard.keys
		if(this.target) {
			this.topLeft.X = this.target.props.X - this.game.renderer.canvas.width / 2
			this.topLeft.Y = this.target.props.Y - this.game.renderer.canvas.height / 2
		}
		this.assertValidPosition()
	}

	assertValidPosition() {
		if(this.topLeft.X < 0) this.topLeft.X = 0
		else if(this.topLeft.X + this.game.renderer.canvas.width > this.game.map.width) {
			this.topLeft.X = this.game.map.width - this.game.renderer.canvas.width
		}
		if(this.topLeft.Y < 0) this.topLeft.Y = 0
		else if(this.topLeft.Y + this.game.renderer.canvas.height > this.game.map.height) {
			this.topLeft.Y = this.game.map.height - this.game.renderer.canvas.height
		}
	}

	containsPoint(p) {
		const width  = this.game.renderer.canvas.width,
		   	  height = this.game.renderer.canvas.height,
		   	  X      = this.topLeft.X,
		   	  Y      = this.topLeft.Y
		if(p.X > X && p.X < X + width && p.Y > Y && p.Y < Y + width) {
			return true
		}
		return false
	}
}