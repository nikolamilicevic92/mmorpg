export class Map {

	constructor(game) { 
		this.game          = game
		this.tileSize      = null
		this.width         = null
		this.height        = null
		this.numOfRows     = null
		this.numOfCols     = null
		this.sprites       = null
		this.spritesMargin = null
		this.tiles         = null
		this.toBeRendered  = []
	}

	init(mapData) {
		if(!mapData) {
			console.log('Did not receive map data')
			return
		}
		this.tileSize = mapData.tileSize;
		this.width = mapData.width;
		this.height = mapData.height;
		this.numOfRows = mapData.numOfRows;
		this.numOfCols = mapData.numOfCols;
		this.sprites = mapData.sprites;
		this.spritesMargin = mapData.spritesMargin;
		this.tiles = mapData.tiles;
	}

	getTilesInTheWay(rect, v) {
		let tiles = {left: [], right: [], bottom: [], top: []};
		const A = {X: rect.X + v[0], Y: rect.Y + v[1] + rect.height};
		const B = {X: rect.X + v[0] + rect.width, Y: rect.Y + v[1] + rect.height};
		const C = {X: rect.X + v[0] + rect.width, Y: rect.Y + v[1]};
		const D = {X: rect.X + v[0], Y: rect.Y + v[1]};
		let tileIndex;
		if(v[0] > 0) {
			tileIndex = this.getTileIndexFromWorldPosition(C.X, C.Y);
			tiles.right.push(this.getTileId(tileIndex.i, tileIndex.j));
			C.Y += this.tileSize;
			while(C.Y < B.Y) {
				tileIndex = this.getTileIndexFromWorldPosition(C.X, C.Y);
				tiles.right.push(this.getTileId(tileIndex.i, tileIndex.j));
				C.Y += this.tileSize;
			}
			tileIndex = this.getTileIndexFromWorldPosition(B.X, B.Y);
			tiles.right.push(this.getTileId(tileIndex.i, tileIndex.j));
		} else if(v[0] < 0) {
			tileIndex = this.getTileIndexFromWorldPosition(D.X, D.Y);
			tiles.left.push(this.getTileId(tileIndex.i, tileIndex.j));
			D.Y += this.tileSize;
			while(D.Y < A.Y) {
				tileIndex = this.getTileIndexFromWorldPosition(D.X, D.Y);
				tiles.left.push(this.getTileId(tileIndex.i, tileIndex.j));
				D.Y += this.tileSize;
			}
			tileIndex = this.getTileIndexFromWorldPosition(A.X, A.Y);
			tiles.left.push(this.getTileId(tileIndex.i, tileIndex.j));
		}
		if(v[1] > 0) {
			tileIndex = this.getTileIndexFromWorldPosition(A.X, A.Y);
			tiles.bottom.push(this.getTileId(tileIndex.i, tileIndex.j));
			A.X += this.tileSize;
			while(A.X < B.X) {
				tileIndex = this.getTileIndexFromWorldPosition(A.X, A.Y);
				tiles.bottom.push(this.getTileId(tileIndex.i, tileIndex.j));
				A.X += this.tileSize;
			}
			tileIndex = this.getTileIndexFromWorldPosition(B.X, B.Y);
			tiles.bottom.push(this.getTileId(tileIndex.i, tileIndex.j));
		} else if(v[1] < 0) {
			tileIndex = this.getTileIndexFromWorldPosition(D.X, D.Y);
			tiles.top.push(this.getTileId(tileIndex.i, tileIndex.j));
			D.X += this.tileSize;
			while(D.X < C.X) {
				tileIndex = this.getTileIndexFromWorldPosition(D.X, D.Y);
				tiles.top.push(this.getTileId(tileIndex.i, tileIndex.j));
				D.X += this.tileSize;
			}
			tileIndex = this.getTileIndexFromWorldPosition(C.X, C.Y);
			tiles.top.push(this.getTileId(tileIndex.i, tileIndex.j));
		}
		return tiles;
	}

	render() {
		this.toBeRendered = []		
		const data = this.getVisibleMapPart();
		for(let i = data.i; i < data.iMax; i++) {
			for(let j = data.j; j < data.jMax; j++) {
				if(this.tiles[i][j][0][0] !== null) {
					if(this.getTileId(i, j) == 3) {
						this.renderTile(i, j, 0, 1)
						this.toBeRendered.push([i, j])
						continue
					}
					this.renderTile(i, j)
				}
			}
		}		
	}

	renderLastLayer() {
		this.toBeRendered.forEach(index => {
			this.renderTile(index[0], index[1], 1)
		})
	}

	renderTile(i, j, start = false, end = false) {
		let n = 0
		if(start) n = start
		let max = this.tiles[i][j].length
		if(end) max = end		
		const layers = this.tiles[i][j];
		for(; n < max; n++) {
			const layer = layers[n];
			const spriteIndex = layer[0];
			const img = this.game.assets.images[this.sprites[spriteIndex]];
			const sX = layer[1];
			const sY = layer[2];
			this.game.renderer.image(
				img, sX, sY, this.tileSize, this.tileSize,
				parseInt(j * this.tileSize - this.game.camera.topLeft.X), 
				parseInt(i * this.tileSize - this.game.camera.topLeft.Y), 
			);
		}
	}

	getVisibleMapPart() {
		const topLeft = this.game.camera.topLeft;
		const tileIndex = this.getTileIndexFromWorldPosition(topLeft.X, topLeft.Y);
		let i = tileIndex.i, j = tileIndex.j;
		i-=2; j-=2;
		if(i < 0) i = 0;
		if(j < 0) j = 0;
		let iMax = i + Math.floor(this.game.renderer.canvas.height / this.tileSize) + 4;
		let jMax = j + Math.floor(this.game.renderer.canvas.width  / this.tileSize) + 4;
		if(iMax > this.tiles.length) iMax = this.tiles.length;
		if(jMax > this.tiles[0].length) jMax = this.tiles[0].length;
		return {i, j, iMax, jMax};
	}

	getTileIndexFromWorldPosition(X, Y) {
		return {
			i: Math.floor(Y / this.tileSize),
			j: Math.floor(X / this.tileSize)
		};
	}
	
	getTileId(i, j) {
		if(i < 0 || j < 0 || i >= this.tiles.length || j >= this.tiles[0].length)
			return 2
		
		return this.tiles[i][j][0][3];
	}
}