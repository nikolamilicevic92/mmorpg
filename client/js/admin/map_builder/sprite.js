export class Sprite {
	constructor(imgSrc, tileSize, margin = 0, settings) {
		this.img = new Image();
		// this.src = imgSrc;
		this.img.src = '/client/assets/images/' + imgSrc;		
		this.img.onload = () => {
			this.width = this.img.width;
			this.height = this.img.height;
			this.init();			
		}
		this.tileSize = tileSize;
		this.selectedTilePosition = [null, null];
		this.margin = margin;
		this.settings = settings;
		this.topLeft = null;
		this.bottomRight = null;
		this.selectedTilesPosition = null;
		this.container = document.createElement('div');
	}
	init() {
		this.container.classList.add('clearfix');
		this.container.classList.add('spriteContainer');
		const numOfRows = (this.height + this.margin) / (this.tileSize + this.margin);
		const numOfCols = (this.width + this.margin) / (this.tileSize + this.margin);
		const margin = 0; // 2x the margin in css
		this.container.style.width = (this.width - this.margin * (numOfCols - 1) + (numOfCols) * margin)+ 'px';
		for(let i = 0; i < numOfRows; i++) {
			for(let j = 0; j < numOfCols; j++) {
				const piece = document.createElement('div');
				this.setPieceEventListener(piece, i, j);
				this.setPieceStyle(piece, i, j);
				this.container.appendChild(piece);
			}
		}
		document.getElementById('spritesContainer').appendChild(this.container);
	}
	setPieceEventListener(piece, i, j) {
		const sX = j * this.tileSize + j * this.margin;
		const sY = i * this.tileSize + i * this.margin;
		piece.addEventListener('click', () => {
			document.getElementById('tileX').value = sX;
			document.getElementById('tileY').value = sY;
			if(this.settings.rectSelection) {
				if(this.topLeft) {
					if(this.bottomRight) {
						this.bottomRight = null;
						this.topLeft = [
							sX, 
							sY
						];
						this.removeSelectedStyles();
						piece.classList.add('selected-piece');
					} else {
						this.bottomRight = [sX, sY];
						if(this.topLeft[0] > this.bottomRight[0] || this.topLeft[1] > this.bottomRight[1]) {
							let tmp = this.topLeft;
							this.topLeft = this.bottomRight;
							this.bottomRight = tmp;
						}
						piece.classList.add('selected-piece');
						this.updateSelectedTilesPosition();
					}
				} else {
					this.topLeft = [sX, sY];
					this.removeSelectedStyles();
					piece.classList.add('selected-piece');
				}
			} else {
				this.selectedTilePosition = [sX, sY];
				this.removeSelectedStyles();
				piece.classList.add('selected-piece');
			}
		});
	}
	removeSelectedStyles() {
		const sp = document.getElementsByClassName('selected-piece');
		for(let i = 0; i < sp.length; i++) {
			sp[i].classList.remove('selected-piece');
			i--;
		}
	}
	setPieceStyle(piece, i, j) {
		piece.classList.add('piece');
		piece.style.width = this.tileSize + 'px';
		piece.style.height = this.tileSize + 'px';
		piece.style.backgroundImage = 'url(' + this.img.src + ')';
		piece.style.backgroundPosition = (-j * this.tileSize - this.margin * j) + 'px ' + 
										 (-i * this.tileSize - this.margin * i) + 'px';
	}
	updateSelectedTilesPosition() {
		this.selectedTilesPosition = [];
		for(let sY = this.topLeft[1]; sY <= this.bottomRight[1]; sY += this.tileSize + this.margin) {
			let row = [];
			for(let sX = this.topLeft[0]; sX <= this.bottomRight[0]; sX += this.tileSize + this.margin) {
				row.push([sX, sY]);
			}
			this.selectedTilesPosition.push(row);
		}
		const hDiff = this.bottomRight[0] - this.topLeft[0];
		const vDiff = this.bottomRight[1] - this.topLeft[1];
		let hMargin = 0;
		if(hDiff > 0) hMargin = this.margin;
		let vMargin = 0;
		if(vDiff > 0) vMargin = this.margin;
		this.settings.brushSizeH = (hDiff) / (this.tileSize + hMargin) + 1;
		this.settings.brushSizeV = (vDiff) / (this.tileSize + vMargin) + 1;
	}	
}