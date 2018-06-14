export class Settings {
	constructor() {
		this._brushSizeV = 1;
		this.brushSizeVRef = document.getElementById('brushSizeV');
		this._brushSizeH = 1;
		this.brushSizeHRef = document.getElementById('brushSizeH');
		this.defBrushSize = [1, 1];
		this._newLayer = false;
		this.newLayerRef = document.getElementById('newLayer');
		this.rectSelection = false;
		this.tileID = 1;
		this.changeIDOnly = false;
		this.changeIDOnlyRef = document.getElementById('changeIDOnly');
		this.showMatchingIDs = false;
		this.showMatchingIDsRef = document.getElementById('showMatchingIDs');
		this.eraser = false;
		this.eraserRef = document.getElementById('eraser');
		this.initializeEventListeners();
	}
	get brushSizeH() {
		return this._brushSizeH;
	}
	get brushSizeV() {
		return this._brushSizeV;
	}
	set brushSizeH(val) {
		if(val < 1) val = 1;
		this._brushSizeH = val;
		this.brushSizeHRef.value = val;
	}
	set brushSizeV(val) {
		if(val < 1) val = 1;
		this._brushSizeV = val;
		this.brushSizeVRef.value = val;
	}
	set newLayer(val) {
		this._newLayer = val;
		this.newLayerRef.checked = val;
	}
	get newLayer() {
		return this._newLayer;
	}
	initializeEventListeners() {
		this.eraserRef.addEventListener('change', (ev) => {
			this.eraser = ev.target.checked;
		})
		this.showMatchingIDsRef.addEventListener('change', (ev) => {
			this.showMatchingIDs = ev.target.checked;
		})
		this.changeIDOnlyRef.addEventListener('change', (ev) => {
			this.changeIDOnly = ev.target.checked;
		})
		this.newLayerRef.addEventListener('change', (ev) => {
			this._newLayer = ev.target.checked;
		});
		this.brushSizeHRef.addEventListener('change', (ev) => {
			let value = parseInt(ev.target.value);
			if(isNaN(value)) value = 1;
			if(value < 1) value = 1;
			this._brushSizeH = value;
			this.defBrushSize[0] = value;
		});
		this.brushSizeVRef.addEventListener('change', (ev) => {
			let value = parseInt(ev.target.value);
			if(isNaN(value)) value = 1;
			if(value < 1) value = 1;
			this._brushSizeV = value;
			this.defBrushSize[1] = value;
		});
		document.getElementById('rectSelection').addEventListener('change', (ev) => {
			this.removeSelectedTilesStyle();
			if(ev.target.checked) {
				this.rectSelection = true;
				this.brushSizeVRef.disabled = true;
				this.brushSizeHRef.disabled = true;
			} else {
				this.rectSelection = false;
				this.brushSizeH = this.defBrushSize[0];
				this.brushSizeV = this.defBrushSize[1];
				this.brushSizeVRef.disabled = false;
				this.brushSizeHRef.disabled = false;
			}
		});
		document.getElementById('tileID').addEventListener('change', (ev) => {
			const value = parseInt(ev.target.value);
			if(value < 1) value = 1;
			this.tileID = value;
		});
	}
	removeSelectedTilesStyle() {
		const sp = document.getElementsByClassName('selected-piece');
		for(let i = 0; i < sp.length; i++) {
			sp[i].classList.remove('selected-piece');
			i--;
		}
	}
}