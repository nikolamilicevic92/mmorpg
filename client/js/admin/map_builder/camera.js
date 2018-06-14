export class Camera {
	constructor(canvas, mapWidth, mapHeight, mouse) {
		this.topLeft = {X: 0, Y: 0};
		this.canvas = canvas;
		this.width = canvas.width;
		this.height = canvas.height;
		this.mapWidth = mapWidth;
		this.mapHeight = mapHeight;
		this.mouse = mouse;
		this.velocity = [0, 0];
		this.speed = 10;
		this.cameraXRef = document.getElementById('cameraX');
		this.cameraYRef = document.getElementById('cameraY');
		this.init();
	}
	init() {
		document.addEventListener('keydown', (ev) => this.onKeyDown(ev));
		document.addEventListener('keyup', (ev) => this.onKeyUp(ev));
	}
	onKeyDown(ev) {
		if(ev.keyCode == 87) {
			this.velocity[1] = -1;
		} else if(ev.keyCode == 83) {
			this.velocity[1] = 1;
		} else if(ev.keyCode == 65) {
			this.velocity[0] = -1;
		} else if(ev.keyCode == 68) {
			this.velocity[0] = 1;
		}
	}
	onKeyUp(ev) {
		if(ev.keyCode == 87) {
			this.velocity[1] = 0;
		} else if(ev.keyCode == 83) {
			this.velocity[1] = 0;
		} else if(ev.keyCode == 65) {
			this.velocity[0] = 0;
		} else if(ev.keyCode == 68) {
			this.velocity[0] = 0;
		}
	}
	moveAt(X, Y) {
		this.topLeft = {X, Y};
		this.assertValidPosition();
	}
	update() {
		let X = parseInt(this.cameraXRef.value);
		let Y = parseInt(this.cameraYRef.value);
		if(isNaN(X)) X = 0;
		if(isNaN(Y)) Y = 0;
		this.topLeft.X = X + this.velocity[0] * this.speed;
		this.topLeft.Y = Y + this.velocity[1] * this.speed;
		this.assertValidPosition();
		this.cameraXRef.value = this.topLeft.X;
		this.cameraYRef.value = this.topLeft.Y;
	}
	assertValidPosition() {
		if(this.topLeft.X < 0) this.topLeft.X = 0;
		else if(this.topLeft.X + this.width > this.mapWidth) {
			this.topLeft.X = this.mapWidth - this.width;
		}
		if(this.topLeft.Y < 0) this.topLeft.Y = 0;
		else if(this.topLeft.Y + this.height > this.mapHeight) {
			this.topLeft.Y = this.mapHeight - this.height;
		}
	}
}