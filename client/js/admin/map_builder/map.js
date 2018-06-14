export class Map {
	constructor(width, height, tileSize, canvas, spriteManager, mouse, settings, camera, ajax) {
		this.tileSize = tileSize;
		this.tiles = [];
		this.numOfRows = parseInt(height / this.tileSize);
		this.numOfCols = parseInt(width / this.tileSize);
		this.width = tileSize * this.numOfCols;
		this.height = tileSize * this.numOfRows;
		this.canvas = canvas;
		this.canvas.addEventListener('mousemove', () => this.onMousemove());
		this.canvas.addEventListener('mouseup', (ev) => this.onMouseUp(ev))
		this.ctx = this.canvas.getContext('2d');
		this.rect = this.canvas.getBoundingClientRect();
		this.rectOffsetY = window.scrollY;
		this.spriteManager = spriteManager;
		this.mouse = mouse;
		this.settings = settings;
		this.camera = camera;
		this.ajax = ajax;
		this.hoveredTiles = [];
		this.mouseXRef = document.getElementById('mouseX');
		this.mouseYRef = document.getElementById('mouseY');
		this.undoHistory = [];
		this.redoHistory = [];
		this.maxHistoryLength = 5000;
		this.init();
	}
	init() {
		this.reset();
		document.addEventListener('keydown', (ev) => {
			if(ev.keyCode == 90 && ev.ctrlKey == true) {
				this.undo();
			} else if(ev.keyCode == 89 && ev.ctrlKey == true) {
				this.redo();
			}
		});
		document.addEventListener('mousewheel', (ev) => {
			if(this.settings.rectSelection) return;
			if(this.mouse.isInRect(this.rect, this.rectOffsetY)) {
				ev.preventDefault();
				if(ev.deltaY < 0) {
					this.settings.brushSizeV++;
					this.settings.brushSizeH++;
				} else {
					this.settings.brushSizeV--;
					this.settings.brushSizeH--;
				}
			}
			
		});
		document.getElementById('reset').addEventListener('click', () => this.reset(true));
		document.getElementById('undo').addEventListener('click', () => this.undo());
		document.getElementById('redo').addEventListener('click', () => this.redo());
		document.getElementById('save').addEventListener('click', () => this.save());
		document.getElementById('load').addEventListener('click', () => this.load());
		document.getElementById('background').addEventListener('click', () => this.setBackground());
	}

	reset(question = false) {
		if(question) {
			const answer = confirm('Reseting map cannot be undone, are you sure you want to proceed?');
			if(!answer) return;
		}
		this.tiles = [];
		for(let i = 0; i < this.numOfRows; i++) {
			let row = [];
			for(let j = 0; j < this.numOfCols; j++) {
				let layers = [];
				layers.push([null, null, null, 1]);
				row.push(layers);
			}
			this.tiles.push(row);
		}
	}

	undo() {
		if(this.undoHistory.length == 0) return;
		if(this.redoHistory.length > this.maxHistoryLength) {
			this.redoHistory.pop();
		}
		const move = this.undoHistory[0];
		const i = move.i;
		const j = move.j;
		switch(move.action) {
			case '0':
				this.redoHistory.unshift({
					action: '0',
					ID: this.tiles[i][j][0][3],
					i,
					j
				});
				this.tiles[i][j][0][3] = move.ID;
				break;
			case '1':
				this.redoHistory.unshift({
					action: '1',
					spriteIndex: this.tiles[i][j][move.layer][0],
					sX: this.tiles[i][j][move.layer][1],
					sY: this.tiles[i][j][move.layer][2],
					ID: this.tiles[i][j][0][3],
					layer: move.layer,
					i,
					j
				});
				this.tiles[i][j][move.layer][0] = move.spriteIndex;
				this.tiles[i][j][move.layer][1] = move.sX;
				this.tiles[i][j][move.layer][2] = move.sY;
				this.tiles[i][j][0][3] = move.ID;
				break;
			case '2':
				this.redoHistory.unshift({
					action: '2',
					spriteIndex: this.tiles[i][j][0][0],
					sX: this.tiles[i][j][0][1],
					sY: this.tiles[i][j][0][2],
					ID: this.tiles[i][j][0][3],
					i,
					j
				});
				this.tiles[i][j][0][0] = null;
				this.tiles[i][j][0][1] = null;
				this.tiles[i][j][0][2] = null;
				this.tiles[i][j][0][3] = 1;
				break;
			case '3':
				this.redoHistory.unshift({
					action: '3',
					layer: this.tiles[i][j][this.tiles[i][j].length-1],
					i,
					j
				});
				this.tiles[i][j].pop();
				break;
		}
		this.undoHistory.shift();
	}

	redo() {
		if(this.redoHistory.length == 0) return;
		if(this.undoHistory.length > this.maxHistoryLength) {
			this.undoHistory.pop();
		}
		const move = this.redoHistory[0];
		const i = move.i;
		const j = move.j;
		switch(move.action) {
			case '0':
				this.undoHistory.unshift({
					action: '0',
					i,
					j,
					ID: this.tiles[i][j][0][3]
				});
				this.tiles[i][j][0][3] = move.ID;
				break;
			case '1':
				this.undoHistory.unshift({
					action: '1',
					i,
					j,
					layer: move.layer,
					ID: this.tiles[i][j][0][3],
					spriteIndex: this.tiles[i][j][move.layer][0],
					sX: this.tiles[i][j][move.layer][1],
					sY: this.tiles[i][j][move.layer][2]
				});
				this.tiles[i][j][move.layer][0] = move.spriteIndex;
				this.tiles[i][j][move.layer][1] = move.sX;
				this.tiles[i][j][move.layer][2] = move.sY;
				this.tiles[i][j][0][3] = move.ID;
				break;
			case '2':
				this.undoHistory.unshift({
					action: '2',
					i,
					j
				});
				this.tiles[i][j][0][0] = move.spriteIndex;
				this.tiles[i][j][0][1] = move.sX;
				this.tiles[i][j][0][2] = move.sY;
				this.tiles[i][j][0][3] = move.ID;
				break;
			case '3':
				this.undoHistory.unshift({
					action: '3',
					i,
					j
				})
				this.tiles[i][j].push(move.layer);
				break;
		}
		this.redoHistory.shift();
	}

	getHoveredTile() {
		const wp = this.getWorldMousePosition();
		const ti = this.getTileIndexFromPosition(wp.X, wp.Y);
		return ti;
	}

	getWorldMousePosition() {
		return {
			X: this.mouse.X - this.rect.left + this.camera.topLeft.X,
			Y: this.mouse.Y - (this.rect.top + this.rectOffsetY) + this.camera.topLeft.Y
		};
	}

	getTileIndexFromPosition(X, Y) {
		return {
			i: Math.floor(Y / this.tileSize),
			j: Math.floor(X / this.tileSize)
		}
	}

	onMousemove() {
		if(!this.mouse.lmbDown) return;
		this.edit();
	}

	onMouseUp(ev) {
		if(ev.button !== 0) return;
		this.edit();
	}

	edit() {
		const spriteIndex = this.spriteManager.activeSpriteIndex;
		const sprite = this.spriteManager.activeSprite;
		for(let k = 0; k < this.hoveredTiles.length; k++) {
			for(let n = 0; n < this.hoveredTiles[k].length; n++) {
				const i = this.hoveredTiles[k][n][0];
				const j = this.hoveredTiles[k][n][1];
				if(this.settings.eraser) {
					this.tiles[i][j] = [[null, null, null, 1]];
				} else {
					if(!this.settings.rectSelection) {
						const sX = sprite.selectedTilePosition[0];
						const sY = sprite.selectedTilePosition[1];
						this.editTile(i, j, spriteIndex, sX, sY);
					} else if(this.spriteManager.activeSprite.topLeft && this.spriteManager.activeSprite.bottomRight) {
						const sX = sprite.selectedTilesPosition[k][n][0];
						const sY = sprite.selectedTilesPosition[k][n][1];
						this.editTile(i, j, spriteIndex, sX, sY);
					}
				}
			}
		}
	}

	setBackground() {
		const spriteIndex = this.spriteManager.activeSpriteIndex;
		const sprite = this.spriteManager.activeSprite;
		const sX = sprite.selectedTilePosition[0];
		const sY = sprite.selectedTilePosition[1];
		for(let i = 0; i < this.tiles.length; i++) {
			for(let j = 0; j < this.tiles[i].length; j++) {
				this.tiles[i][j][0][3] = this.settings.tileID;
				this.tiles[i][j][0][0] = spriteIndex;
				this.tiles[i][j][0][1] = sX;
				this.tiles[i][j][0][2] = sY;
			}
		}
	}

	editTile(i, j, spriteIndex, sX, sY) {
		if(i < 0 || j < 0 || i >= this.tiles.length || j >= this.tiles[0].length) {
			return;
		}
		if(this.undoHistory.length > this.maxHistoryLength) {
			this.undoHistory.pop();
		}
		const previousID = this.tiles[i][j][0][3];
		if(previousID !== this.settings.tileID) {
			this.tiles[i][j][0][3] = this.settings.tileID;
			if(this.settings.changeIDOnly) {
				this.undoHistory.unshift({
					action: '0',
					i,
					j,
					ID: previousID
				});
			}
		}
		if(this.settings.changeIDOnly) {
			return;
		}
		const lastLayer = this.tiles[i][j].length - 1;
		if(!this.settings.newLayer) {
			if(this.tiles[i][j][lastLayer][0] === spriteIndex &&
				this.tiles[i][j][lastLayer][1] === sX && this.tiles[i][j][lastLayer][2] === sY) {
				return;
			}
			this.undoHistory.unshift({
				action: '1',
				i,
				j,
				layer: lastLayer,
				ID: previousID,
				spriteIndex: this.tiles[i][j][lastLayer][0],
				sX: this.tiles[i][j][lastLayer][1],
				sY: this.tiles[i][j][lastLayer][2]
			});
			this.tiles[i][j][lastLayer][0] = spriteIndex;
			this.tiles[i][j][lastLayer][1] = sX;
			this.tiles[i][j][lastLayer][2] = sY;
		} else {
			if(this.tiles[i][j][0][0] === null) {
				this.undoHistory.unshift({
					action: '2',
					i,
					j
				});
				this.tiles[i][j][0][0] = spriteIndex;
				this.tiles[i][j][0][1] = sX;
				this.tiles[i][j][0][2] = sY;
			} else {
				if(this.tiles[i][j][lastLayer][0] === spriteIndex && this.tiles[i][j][lastLayer][1] == sX &&
					this.tiles[i][j][lastLayer][2] == sY) {
					return;
				}
				this.undoHistory.unshift({
					action: '3',
					i,
					j
				});
				const newLayer = [spriteIndex, sX, sY];
				this.tiles[i][j].push(newLayer);
			}
		}
	}

	render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		const data = this.getVisibleMapPart();
		for(let i = data.i; i < data.iMax; i++) {
			for(let j = data.j; j < data.jMax; j++) {
				if(this.tiles[i][j][0][0] !== null) {
					this.renderTile(i, j);
				}
				if(this.settings.showMatchingIDs && this.tiles[i][j][0][3] == this.settings.tileID) {
					this.rectAroundTile(i, j, 'white', 2);
				}
			}
		}
		if(this.mouse.isInRect(this.rect, this.rectOffsetY)) {
			this.showHoveredTiles();
			this.updateMouseInfo();
		}
	}

	renderTile(i, j) {
		const layers = this.tiles[i][j];
		for(let n = 0; n < layers.length; n++) {
			const layer = layers[n];
			const img = this.spriteManager.sprites[layer[0]].img;
			const sX = layer[1];
			const sY = layer[2];
			this.ctx.drawImage(img, sX, sY, this.tileSize, this.tileSize,
								parseInt(j * this.tileSize - this.camera.topLeft.X), 
								parseInt(i * this.tileSize - this.camera.topLeft.Y), 
								this.tileSize, this.tileSize);
		}
		
	}

	getVisibleMapPart() {
		let ti = this.getTileIndexFromPosition(this.camera.topLeft.X, this.camera.topLeft.Y);
		ti.i-=3; ti.j-=3;
		if(ti.i < 0) ti.i = 0;
		if(ti.j < 0) ti.j = 0;
		let iMax = ti.i + Math.floor(this.canvas.height / this.tileSize) + 6;
		let jMax = ti.j + Math.floor(this.canvas.width  / this.tileSize) + 6;
		if(iMax > this.tiles.length) iMax = this.tiles.length;
		if(jMax > this.tiles[0].length) jMax = this.tiles[0].length;
		return {
			i: ti.i,
			j: ti.j,
			iMax,
			jMax
		};
	}

	showHoveredTiles() {
		for(let k = 0; k < this.hoveredTiles.length; k++) {
			for(let n = 0; n < this.hoveredTiles[0].length; n++) {
				const j = this.hoveredTiles[k][n][1];
				const i = this.hoveredTiles[k][n][0];
				this.rectAroundTile(i, j, 'gray');
			}
		}
	}

	rectAroundTile(i, j, color = 'white', offset = 0) {
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = 2;
		this.ctx.strokeRect(j * this.tileSize - this.camera.topLeft.X + offset, 
							i * this.tileSize - this.camera.topLeft.Y + offset, 
							this.tileSize - 2 * offset, this.tileSize - 2 * offset);
	}

	updateMouseInfo() {
		const mousePos = this.getWorldMousePosition();
		this.mouseXRef.value = parseInt(mousePos.X);
		this.mouseYRef.value = parseInt(mousePos.Y);
	}

	update() {
		const tile = this.getHoveredTile();
		const ci = tile.i;
		const cj = tile.j;
		let ht = [];
		const i = ci - Math.floor(this.settings.brushSizeV / 2);
		const j = cj - Math.floor(this.settings.brushSizeH / 2);
		for(let k = 0; k < this.settings.brushSizeV; k++) {
			let row = [];
			for(let n = 0; n < this.settings.brushSizeH; n++) {
				row.push([i + k, j + n]);
			}
			ht.push(row);
		}
		this.hoveredTiles = ht;
	}

	save() {
		const ref = document.getElementById('mapSaveName');
		const mapName = ref.value.trim();
		if(mapName.length == 0) {
			alert('Enter map name');
			return;
		}
		ref.value = '';
		const sprites = this.spriteManager.spriteSources;
		const spritesMargin = this.spriteManager.spritesMargin;
		const tiles = this.tiles;
		const mapData = {
			width: this.width,
			height: this.height,
			numOfCols: this.numOfCols,
			numOfRows: this.numOfRows,
			tileSize: this.tileSize,
			sprites,
			spritesMargin,
			tiles
		};
		const query = 'map_name=' + mapName + '&map_data=' + JSON.stringify(mapData);
		this.ajax({
			url: 'admin/save-map',
			query, 
			method: "post"
		});
	}

	load() {
		const ref = document.getElementById('mapLoadName')
		const mapName = ref.value.trim()
		const callback = (res) => {
			if(res == '0') {
				alert('Map not found');
				return;
			}
			ref.value = '';
			const mapData = JSON.parse(res);
			console.log(mapData);
			this.spriteManager.loadNewSprites(mapData.tileSize, mapData.sprites, mapData.spritesMargin);
			this.width = mapData.width;
			this.height = mapData.height;
			this.camera.mapWidth = this.width;
			this.camera.mapHeight = this.height;
			this.camera.topLeft = {X: 0, Y: 0};
			this.numOfRows = mapData.numOfRows;
			this.numOfCols = mapData.numOfCols;
			this.tiles = mapData.tiles;
			this.tileSize = mapData.tileSize;
		}
		this.ajax({
			url: 'admin/load-map',
			query: 'map_name=' + mapName,
			method: 'post', 
			callback
		});
	}
}