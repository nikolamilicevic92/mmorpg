export class Renderer {

	constructor(game, width = false, height = false) {
		this.game      = game 
		this.container = document.getElementById('gameContainer')
		this.canvas    = document.createElement('canvas')
		this.hide()
		// this.canvas.style.cursor = 'none'
		this.canvas.oncontextmenu = (ev) => ev.preventDefault()
		if(!width) {
			this.canvas.width = window.innerWidth
			this.canvas.height = window.innerHeight
			window.addEventListener('resize', () => {
				this.canvas.width = window.innerWidth
				this.canvas.height = window.innerHeight
				this.container.style.width = this.canvas.width + 'px'
				this.container.style.height = this.canvas.height + 'px'
			})
		} else {
			this.canvas.width = width
			this.canvas.height = height
		}

		this.ctx = this.canvas.getContext('2d')
		this.container.style.width = this.canvas.width + 'px'
		this.container.style.height = this.canvas.height + 'px'
		this.container.appendChild(this.canvas)
	}

	show() {
		this.container.style.display = 'block'
	}

	hide() {
		this.container.style.display = 'none'
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	fillCircle(x, y, r, color) {
		this.setCircleShape(x, y, r)
		this.ctx.fillStyle = color
		this.ctx.fill()
	}

	strokeCircle(x, y, r, color, lineWidth = 1) {
		this.setCircleShape(x, y, r)
		this.ctx.lineWidth = lineWidth
		this.ctx.strokeStyle = color
		this.ctx.stroke()
	}
	setCircleShape(x, y, r) {
		this.ctx.beginPath()
		this.ctx.arc(x, y, r, 0, 2 * Math.PI)
	}

	fillRect(x, y, width, height, color) {
		this.ctx.fillStyle = color
		this.ctx.fillRect(x, y, width, height)
	}

	strokeRect(x, y, width, height, color, lineWidth = 1) {
		this.ctx.strokeStyle = color
		this.ctx.lineWidth = lineWidth
		this.ctx.strokeRect(x, y, width, height)
	}

	image(img, sX, sY, sW, sH, dX, dY, dW = 0, dH = 0) {
		if(dW == 0 || dH == 0) {
			dW = sW
			dH = sH
		}
		this.ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
	}
	fillText(data) {
		this.ctx.font = data.font
		this.ctx.textAlign = data.align
		this.ctx.fillStyle = data.color
		this.ctx.fillText(data.text, data.X, data.Y)
	}
	strokeText(data) {
		this.ctx.font = data.font
		this.ctx.textAlign = data.align
		this.ctx.strokeStyle = data.color
		this.ctx.strokeText(data.text, data.X, data.Y)
	}
}