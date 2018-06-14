export class Point {

	constructor(X, Y) {
		this.X = X
		this.Y = Y
	}

	add(p) {
		this.X += p.X
		this.Y += p.Y
		return this
	}

	subtract(p) {
		this.X -= p.X
		this.Y -= p.Y
		return this
	}

	multiply(k) {
		this.X *= k
		this.Y *= k
		return this
	}

	divide(k) {
		if(k !== 0) {
			this.X /= k
			this.Y /= k
		} else {
			console.error('--Divide by 0--')
		}
		return this
	}

	distance(p2) {
		return Math.sqrt(Math.pow(p2.X - this.X, 2) + Math.pow(p2.Y - this.Y, 2))
	}

	manhattanDistance(p2) {
		return {X: Math.abs(this.X - p2.X), y: Math.abs(this.Y - p2.Y)}
	}

	static add(p1, p2) {
		return new Point(p1.X + p2.X, p1.Y + p2.Y)
	}

	static subtract(p1, p2) {
		return new Point(p1.X - p2.X, p1.Y - p2.Y)
	}

	static multiply(p, k) {
		return new Point(p.X * k, p.Y * k)
	}

	static divide(p, k) {
		if(k !== 0) {
			return new Point(p.X / k, p.Y / k)
		} else {
			console.error('--Divide by 0--')
		}
	}

	static distance(p1, p2) {
		return Math.sqrt(Math.pow(p2.X - p1.X, 2) + Math.pow(p2.Y - p1.Y, 2));
	}

	static manhattanDistance(p1, p2) {
		return {X: Math.abs(p1.X - p2.X), y: Math.abs(p1.Y - p2.Y)};
	}
}

export class Vector {

	constructor(X, Y, _static = false) {
		this._magnitude = null
		this.static = _static
		this._X = 1;
		this._Y = 0;
		this.angle = Vector.angle(X, Y)
		if(_static) {
			this._X = X
			this._Y = Y
		}
	}

	get magnitude() {
		if(!this._magnitude) {
			this._magnitude = Vector.magnitude(this._X, this._Y)
		}
		return this._magnitude
	}

	raw() {
		return { X: this._X, Y: this._Y }
	}

	static angle(X, Y) {
		let angle = Math.atan(X / Y)
		if(X >= 0 && Y >= 0) {
			angle = Math.PI / 2 - angle
		} else if(X <= 0 && Y >= 0) {
			angle = Math.PI / 2 + Math.abs(angle)
		} else if(X <= 0 && Y <= 0) {
			angle = 3 * Math.PI / 2 - angle
		} else {
			angle = 3 * Math.PI / 2 -  angle
		}
		return angle
	}

	unit() {
		if(this.static) {
			this._X /= this.magnitude
			this._Y /= this.magnitude
		}
		this._magnitude = 1 
		return this
	}

	static magnitude(X, Y) {
		return Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2))
	}

	rotate(angle) {
		if(this.static) return
		this.angle += angle
		return this
	}

	get X() {
		if(this.static) return this._X
		return (this._X * Math.cos(this.angle) - this._Y * Math.sin(this.angle)) * this._magnitude
	}

	get Y() {
		if(this.static) return this._Y
		return (this._X * Math.sin(this.angle) + this._Y * Math.cos(this.angle)) * this._magnitude
	}

	set X(value) {
		this._X = value
	}

	set Y(value) {
		this._Y = value
	}

	static rotate(v, angle) {
		if(v.static) return
		v.angle += angle
	}

	add(v) {
		this._X += v.X
		this._Y += v.Y
		this.updateMagnitude()
		if(!this.static) {
			this.angle = Vector.angle(this._X, this._Y)
		}
		return this
	}

	subtract(v) {
		this._X -= v.X
		this._Y -= v.Y	
		this.updateMagnitude()
		if(!this.static) {
			this.angle = Vector.angle(this._X, this._Y)
		}
		return this	
	}

	multiply(k) {
		if(this.static) {
			this._X *= k
			this._Y *= k
			this.updateMagnitude()
		} else {
			this._magnitude *= k	
		}
		return this
	}

	//Simple X, Y object to be used in expressions
	multiplied(k) {
		if(this.static) {
			return {
				X: this._X * k,
				Y: this._Y * k
			}
		} else {
			const mult = k * this._magnitude
			return {
				X: this.X * mult,
				Y: this.Y * mult
			}
		}
	}

	divide(k) {
		if(k !== 0) {
			if(this.static) {
				this._X /= k
				this._Y /= k
				this.updateMagnitude()
			} else {
				this._magnitude /= k
			}		
		}
		return this
	}

	dot(v) {
		return this.X * v.X + this.Y * v.Y
	}

	projection(v) {
		return this.dot(v) / this._magnitude
	}

	updateMagnitude() {
		this._magnitude = Vector.magnitude(this._X, this._Y)
		return this
	}

	static add(v1, v2, _static = false) {
		return new Vector(v1.X + v2.X, v1.Y + v2.Y, _static)
	}

	static subtract(v1, v2, _static = false) {
		return new Vector(v1.X - v2.X, v1.Y - v2.Y, _static)
	}

	static multiply(v, k, _static = false) {
		return new Vector(v.X * k, v.Y * k, _static)
	}

	static divide(v, k, _static = false) {
		if(k !== 0) {
			return new Vector(v.X / k, v.Y / k, _static)
		}
	}

	static dot(v1, v2) {
		return v1.X * v2.X + v1.Y * v2.Y
	}

	static projection(v1, v2) {
		return Vector.dot(v1, v2) / v1._magnitude
	}

	static fromAngle(angle, _static = false) {
		return new Vector(Math.cos(angle), Math.sin(angle), _static)
	}

	static random(_static = false) {
		let angle = Math.random() * 2 * Math.PI
		return new Vector(Math.cos(angle),Math.sin(angle), _static)
	}

}

export class VectorFromPoints extends Vector {
	constructor(p1, p2, _static = false) {
		super(p2.X - p1.X, p2.Y - p1.Y, _static)
	}
}

export class Circle {
	constructor(x, y, r, color = 'white') {
		this._type = 'Circle';
		this._center = new Point(x, y);
		this._r = r;
		this.color = color;
	}
	get r() {
		return this._r;
	}
	get x() {
		return this._center.x;
	}
	get y() {
		return this._center.y;
	}
	get center() {
		return this._center;
	}
	get type() {
		return this._type;
	}
	getBoundingRect() {
		return new Rectangle(
			this._center.x - this._r,
			this._center.y - this._r,
			2 * this._r,
			2 * this._r
		);
	}
	scale(k) {
		this._r *= k;
	}
	translate(v) {
		this._center.add(v);
	}
}

export class Rectangle {
	constructor(x, y, width, height, color = 'white') {
		this._type = 'Rectangle';
		this._topLeft = new Point(x, y);
		this._width = width;
		this._height = height;
		this.color = color;
	}
	get x() {
		return this._topLeft.x;
	}
	get y() {
		return this._topLeft.y;
	}
	get width() {
		return this._width;
	}
	get height() {
		return this._height;
	}
	get type() {
		return this._type;
	}
	scale(k) {
		const halfScale = k / 2;
		this._topLeft.x -= halfScale;
		this._topLeft.y -= halfScale;
		this._width += halfScale;
		this._height += halfScale;
	}
	translate(v) {
		this._topLeft.add(v);
	}
}


//Rework this
export class Shape {
	constructor(points, color = 'white') {
		this._points = points.slice();
		this._type = 'Shape';
		this.color = color;
		this._axis = new Point(
			points.reduce((sum, curr) => sum + curr.x, 0) / points.length,
			points.reduce((sum, curr) => sum + curr.y, 0) / points.length
		);
		this._vectors = [];
		points.forEach(p => this._vectors.push(new VectorFromPoints(
			this._axis, p
		)));
	}
	get type() {
		return this._type;
	}
	get axis() {
		return this._axis;
	}
	get points() {
		return this._points;
	}
	updatePoints() {
		let points = [];
		this._vectors.forEach(v => {
			points.push(Point.add(this._axis, v));
		});
		this._points = points;
	}
	getBoundingRect() {
		let points = this.points;
		let xMin = points[0].x;
		let xMax = points[0].x;
		let yMin = points[0].y;
		let yMax = points[0].y;
		for(let i = 1; i < points.length; i++) {
			if(xMin > points[i].x) xMin = points[i].x;
			if(yMin > points[i].y) yMin = points[i].y;
			if(xMax < points[i].x) xMax = points[i].x;
			if(yMax < points[i].y) yMax = points[i].y;
		}
		return new Rectangle(xMin, yMin, xMax - xMin, yMax - yMin);
	}
	translate(v) {
		this._axis.add(v);
		this.updatePoints();
	}
	rotate(angle) {
		this._vectors.forEach(v => v.rotate(angle));
		this.updatePoints();
	}
	static makePolygon(n, color = 'white', scale = 1) {
		var angle = 0;
		var angleInc = Math.PI * 2 / n;
		var points = [];
		for(let i = 0; i < n; i++) {
			let vx = Math.cos(angle);
			let vy = Math.sin(angle);
			angle += angleInc;
			points.push(new Point(vx * 25 * scale, vy * 25 * scale));
		}
		return new Shape(points, color);
	}

}


//Rework this...
class Quadtree {
	constructor(boundingRect, pos = -1, parrent = null, level = 0) {
		this.boundingRect = boundingRect;
		//top left, top right, bottom right, bottom left
		// this.nodes = [null, null, null, null];
		this.nodes = [];
		this.objects = [];
		this.maxObjects = 1;
		this.pos = pos;
		this.parrent = parrent;
		this.level = level;
		this.maxLevel = 100;
	}

	clear() {
		this.objects = [];
		this.nodes = [null, null, null, null];
	}

	getPartialRects(rect) {
		let rect0 = null;
		let rect1 = null;
		let rect2 = null;
		let rect3 = null;
		let rx, ry, rw, rh;
		let x = this.boundingRect.x;
		let y = this.boundingRect.y;
		let hW = this.boundingRect.width / 2 + this.boundingRect.x;
		let hH = this.boundingRect.height / 2 + this.boundingRect.y;
		//Checking top side
		if(rect.y < hH) {
			// checking left side
			if(rect.x < hW) {
				rx = rect.x;
				ry = rect.y;
				if(rect.x + rect.width < hW) {
					rw = rect.width;
				} else {
					rw = hW - rect.x;
				}
				if(rect.y + rect.height < hH) {
					rh = rect.height;
				} else {
					rh = hH - rect.y;
				}
				rect0 = {
					x: rx, 
					y: ry,
					width: rw,
					height: rh
				};
			}
			//Checking right side
			if(rect.x + rect.width > hW) {
				ry = rect.y;
				if(rect.x > hW) {
					rx = rect.x;
					rw = rect.width;
				} else {
					rx = hW;
					rw = rect.x + rect.width - hW;
				}
				if(rect.y + rect.height < hH) {
					rh = rect.height;
				} else {
					rh = hH - rect.y;
				}
				rect1 = {
					x: rx, 
					y: ry,
					width: rw,
					height: rh
				};
			}
		}
		//Checking bottom side
		if(rect.y + rect.height > hH) {
			//Checking right side
			if(rect.x + rect.width > hW) {
				if(rect.x > hW) {
					rx = rect.x;
					rw = rect.width;
				} else {
					rx = hW;
					rw = rect.x + rect.width - hW;
				}
				if(rect.y > hH) {
					ry = rect.y;
					rh = rect.height;
				} else {
					ry = hH;
					rh = rect.y + rect.height - hH;
				}
				rect2 = {
					x: rx, 
					y: ry,
					width: rw,
					height: rh
				};
			}
			//Checking left side
			if(rect.x < hW) {
				rx = rect.x;
				if(rect.x + rect.width < hW) {
					rw = rect.width;
				} else {
					rw = hW - rect.x;
				}
				if(rect.y > hH) {
					ry = rect.y;
					rh = rect.height;
				} else {
					ry = hH;
					rh = rect.y + rect.height - hH;
				}
				rect3 = {
					x: rx, 
					y: ry,
					width: rw,
					height: rh
				};
			}
		}
		return [rect0, rect1, rect2, rect3];
	}

	retrieveObjects(rect) {
		let index = this.getIndex(rect);
		if(index != -1) {
			if(this.nodes.length > 0) {
				return this.nodes[index].retrieveObjects(rect);
			} else {
				return this.objects;
			}
		} else {
			if(this.nodes.length != 0) {
				let pRects = this.getPartialRects(rect);
				let result = [];
				if(pRects[0]) {
					result = result.concat(this.nodes[0].retrieveObjects(pRects[0]));
				}
				if(pRects[1]) {
					result = result.concat(this.nodes[1].retrieveObjects(pRects[1]));
				}
				if(pRects[2]) {
					result = result.concat(this.nodes[2].retrieveObjects(pRects[2]));
				}
				if(pRects[3]) {
					result = result.concat(this.nodes[3].retrieveObjects(pRects[3]));
				}
				return this.objects.concat(result);
			} else {
				return this.objects;
			}
		}
	}

	getIndex(oRect) {
		let x = this.boundingRect.x;
		let y = this.boundingRect.y;
		let width = this.boundingRect.width / 2;
		let height = this.boundingRect.height / 2;
		let xPlusWidth = x + width;
		let yPlusHeight = y + height;
		let objX = oRect.x;
		let objY = oRect.y;
		let objWidth = oRect.width;
		let objHeight = oRect.height;
		let objXPlusObjWidth = objX + objWidth;
		let objYPlusObjHeight = objY + objHeight;
		let yPlusHeightTimes2 = yPlusHeight * 2;
		//Checking which node object belongs to
		//Checking left side
		if(objX >= x && objXPlusObjWidth <= xPlusWidth) {
			//checking top side
			if(objY >= y && objYPlusObjHeight <= yPlusHeight) {
				return 0;
				//checking bottom side
			} else if(objY >= yPlusHeight && objYPlusObjHeight <= yPlusHeightTimes2) {
				return 3;
			} else {
				//doesn't fit anywhere on left side, stays in parrent
				return -1;
			}
			//checking right side
		} else if(objX >= xPlusWidth && objXPlusObjWidth <= xPlusWidth * 2) {
			//checking top side
			if(objY >= y && objYPlusObjHeight <= yPlusHeight) {
				return 1;
				//checking bottom side
			} else if(objY >= yPlusHeight && objYPlusObjHeight <= yPlusHeightTimes2) {
				return 2;
			} else {
				//doesn't fit anywhere on right side, stays in parrent
				return -1;
			}
		} else {
			return -1;
		}
	}

	insert(obj) {
		if(this.level > this.maxLevel) {
			this.objects.push(obj);
			return;
		}
		let index;
		if(this.nodes.length == 0) {
			if(this.objects.length < this.maxObjects) {
				this.objects.push(obj);
				return;
			} else {
				this.split();
				for(let i = 0; i < this.objects.length; i++) {
					index = this.getIndex(this.objects[i].boundingRect());
					if(index != -1) {
						this.nodes[index].insert(this.objects[i]);
						this.objects.splice(i, 1);
						i--;
					}
				}
				index = this.getIndex(obj.boundingRect());
				if(index == -1) {
					this.objects.push(obj);
					return;
				} else {
					this.nodes[index].insert(obj);
				}
			}
		} else {
			index = this.getIndex(obj.boundingRect());
			if(index == -1) {
				this.objects.push(obj);
				return;
			} else {
				this.nodes[index].insert(obj);
			}
		}
	}

	draw() {
		if(this.nodes.length == 0) {
			let p = {
				x: this.boundingRect.x,
				y: this.boundingRect.y
			};
			if(CAMERA.isInCamera(p)) {
				p = CAMERA.worldToCanvas(p);
				let width = this.boundingRect.width;
				let height = this.boundingRect.height;
				strokeRectangle(ctx, p, width, height, 'white', 2);
			}
			
		} else {
			this.nodes.forEach(n => n.draw());
		}
	}

	//Only for nodes[null, null, null, null]
	makeNode(pos) {
		let x = this.boundingRect.x;
		let y = this.boundingRect.y;
		let width = this.boundingRect.width / 2;
		let height = this.boundingRect.height / 2;
		let boundingRect;

		switch(pos) {
			case 0:
				boundingRect = {
					x: x,
					y: y,
					width: width,
					height: height
				};
				this.nodes[0] = new Quadtree(boundingRect, 0, this, this.level + 1);
				break;

			case 1:
				boundingRect = {
					x: x + width,
					y: y,
					width: width,
					height: height
				};
				this.nodes[1] = new Quadtree(boundingRect, 1, this, this.level + 1);
				break;

			case 2: 
				boundingRect = {
					x: x + width,
					y: y + height,
					width: width,
					height: height
				};
				this.nodes[2] = new Quadtree(boundingRect, 2, this, this.level + 1);
				break;

			case 3:
				boundingRect = {
					x: x,
					y: y + height,
					width: width,
					height: height
				};
				this.nodes[3] = new Quadtree(boundingRect, 3, this, this.level + 1);
				break;
		}
	}

	split() {
		let x = this.boundingRect.x;
		let y = this.boundingRect.y;
		let width = this.boundingRect.width / 2;
		let height = this.boundingRect.height / 2;
		let xPlusWidth = x + width;
		let yPlusHeight = y + height;
		let childLevel = this.level + 1;
		//top left node
		let boundingRect = {
			x: x,
			y: y,
			width: width,
			height: height
		};
		// this.nodes[0] = new Quadtree(boundingRect, 0, this, childLevel);
		this.nodes.push(new Quadtree(boundingRect, 0, this, childLevel));
		//top right node
		boundingRect = {
			x: xPlusWidth,
			y: y,
			width: width,
			height: height
		};
		// this.nodes[1] = new Quadtree(boundingRect, 1, this, childLevel);
		this.nodes.push(new Quadtree(boundingRect, 1, this, childLevel));
		//bottom right node
		boundingRect = {
			x: xPlusWidth,
			y: yPlusHeight,
			width: width,
			height: height
		};
		// this.nodes[2] = new Quadtree(boundingRect, 2, this, childLevel);
		this.nodes.push(new Quadtree(boundingRect, 2, this, childLevel));
		//bottom left node
		boundingRect = {
			x: x,
			y: yPlusHeight,
			width: width,
			height: height
		};
		// this.nodes[3] = new Quadtree(boundingRect, 3, this, childLevel);
		this.nodes.push(new Quadtree(boundingRect, 3, this, childLevel));
	}
}

export function rectCollision(rect1, rect2) {
	if(rect1.X + rect1.width > rect2.X && rect1.X < rect2.X + rect2.width &&
		rect1.Y + rect1.height > rect2.Y && rect1.Y < rect2.Y + rect2.height) {
		return true;
	}
	return false;
}

export function SATCollision(shape1,shape2) {
	var projection1,projection2;
	var shapes = [];
	var edges = [];
	var data = [];
	var MTV;
	//Starting with edges from a shape with less edges to bail out faster on no collision
	if(shape1.points.length > shape2.points.length) {
		shapes.push(shape2);
		shapes.push(shape1);
	} else {
		shapes.push(shape1);
		shapes.push(shape2);
	}
	//Calculating and putting edges of both shapes in edges array, starting with shape having less edges
	for(let n = 0; n < 2; n++) {
		let start = shapes[n].points[shapes[n].points.length-1];
		let end = shapes[n].points[0];
		let v = new VectorFromPoints(start,end);
		let edge = {start: start, end: end, v: v};
		edges.push(edge);
		for(let i=0;i<shapes[n].points.length-1;i++) {
			start = shapes[n].points[i];
			end = shapes[n].points[i+1];
			v = new VectorFromPoints(start,end);
			edge = {start: start, end: end, v: v};
			edges.push(edge);
		}
	}
	//Iterating through each edge and calculating projection of all points of shape1 and shape2 onto
	//current edge, storing the projections in projection1 and projection2 arrays respectively
	for(let k = 0; k < edges.length; k++) {
		projection1 = [];
		for(let i = 0; i < shapes[0].points.length; i++) {
			projectedV = new VectorFromPoints(edges[k].start,shapes[0].points[i]);
			projection1.push(Vector.projection(edges[k].v, projectedV));
		}
		projection2 = [];
		for(let i = 0; i < shapes[1].points.length; i++) {
			projectedV = new VectorFromPoints(edges[k].start,shapes[1].points[i]);
			projection2.push(Vector.projection(edges[k].v, projectedV));
		}
		projection1.sort((a,b) => a - b);
		projection2.sort((a,b) => a - b);
		let d1 = Math.abs(projection2[projection2.length - 1] - projection1[0]);
		let d2 = Math.abs(projection1[projection1.length - 1] - projection2[0]);
		data.push({v: edges[k].v, d: d1});
		data.push({v: edges[k].v, d: d2});
		//Comparing projections, whether they overlap, if there is a gap at any point, there is no collision
		if(!(projection2[projection2.length-1] > projection1[0] &&
		     projection1[projection1.length-1] > projection2[0])) {
			return false;
		}
	}
	//No gaps were found, meaning collision happened
	data.sort((a, b) => a.d - b.d);
	data[0].v.unit();
	data[0].v.x = Math.abs(data[0].v.x);
	data[0].v.y = Math.abs(data[0].v.y);
	MTV = {length: data[0].d, v: data[0].v, shape1Left: false, shape1Up: false};
	if(shape1.axis.x < shape2.axis.x) {
		MTV.shape1Left = true;
	}
	if(shape1.axis.y < shape2.axis.y) {
		MTV.shape1Up = true;
	}
	return MTV;
}
