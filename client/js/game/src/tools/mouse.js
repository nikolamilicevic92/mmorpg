export class Mouse {
	
	constructor(game) { 
		this.game = game
		this.X = 0, this.Y = 0
		this.RMB = false
		this.LMB = false
		this.hidden = false
		this.buttons = { 'RMB': false, 'LMB': false }
		this.cRect = this.game.renderer.canvas.getBoundingClientRect()
		window.addEventListener('mousemove', ev => {
			this.X = ev.clientX - this.cRect.x, this.Y = ev.clientY - this.cRect.y
		})
		window.addEventListener('mousedown', ev => {
			if(ev.button == 0) {
				this.LMB            = true
				this.buttons['LMB'] = true
			}
			else if(ev.button == 2) {
				this.RMB            = true
				this.buttons['RMB'] = true
			}
		})
		window.addEventListener('mouseup', ev => {
			if(ev.button == 0) {
				this.LMB            = false
				this.buttons['LMB'] = false
			}
			else if(ev.button == 2) {
				this.RMB            = false
				this.buttons['RMB'] = false
			}
		})
	}

	init() {
		this.cRect = this.game.renderer.canvas.getBoundingClientRect()
	}

	hide() {
		this.hidden = true
	}

	show() {
		this.hidden = false
	}

	get worldX() {
		return this.game.camera.topLeft.X + this.X 
	}

	get worldY() {
		return this.game.camera.topLeft.Y + this.Y
	}

	on(event, func) {
		switch(event) {
			case 'LMBUp':
				document.addEventListener('mouseup', ev => {
					if(ev.button == 0) func() 
				})
				break
			case 'LMBDown':
				document.addEventListener('mousedown', ev => {
					if(ev.button == 0) func() 
				})
				break
			case 'RMBUp':
				document.addEventListener('mouseup', ev => {
					if(ev.button == 2) func() 
				})
				break
			case 'RMBDown':
				document.addEventListener('mousedown', ev => {
					if(ev.button == 2) func() 
				})
				break
		}
	}

	render() {
		if(this.hidden) return
		this.game.renderer.image(
			'small-sword.png',
			0, 0, 16, 16,
			parseInt(this.X), parseInt(this.Y),
			20, 20
		)
	}
}