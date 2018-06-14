export class Mouse {
	constructor() {
		this.X = 0;
		this.Y = 0;
		this.lmbDown = false;
		this.rmbDown = false;
		this.initializeListeners();
	}
	initializeListeners() {
		document.addEventListener('mousemove', (ev) => {
			this.X = ev.pageX;
			this.Y = ev.pageY; 
		});
		document.addEventListener('mousedown', (ev) => {
			if(ev.button === 0) this.lmbDown = true;
			else if(ev.button === 2) this.rmbDown = true;
		});
		document.addEventListener('mouseup', (ev) => {
			if(ev.button === 0) this.lmbDown = false;
			else if(ev.button === 2) this.rmbDown = false;
		});
	}
	isInRect(rect, offsetY) {
		return (this.X > rect.left && this.X < rect.right &&
			    this.Y > rect.top + offsetY && this.Y < rect.bottom + offsetY);
	}
}