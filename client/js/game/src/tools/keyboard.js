export class Keyboard {
	constructor() { 
		this.keys = {};
		window.addEventListener('keydown', (ev) => this.onKeyDown(ev));
		window.addEventListener('keyup', (ev) => this.onKeyUp(ev));
	}
	onKeyDown(ev) {
		this.keys[ev.keyCode] = true;
		this.keys[ev.key] = true;
	}
	onKeyUp(ev) {
		this.keys[ev.keyCode] = false;
		this.keys[ev.key] = false;
	}
}