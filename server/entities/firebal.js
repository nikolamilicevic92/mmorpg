module.exports = class Firebal {

	//Initializing stuff

	constructor(dragon, ID, X, Y, dX, dY, hitRadius, speed, damage, range) {
		this.dragon = dragon;
		this.dragonID = dragon.ID;
		this.ID = ID;
		//Center coordinates, not top left
		this.X = X;
		this.Y = Y;
		this.dX = dX;
		this.dY = dY;
		this.speed = speed;
		this.damage = damage
		//To avoid sqrt
		this.range = range
		this.width = 30;
		this.height = 26;
		this.spriteSource = 'firebal.png';
		this.hitRadius = hitRadius;
		this.magnitude = Math.sqrt(Math.pow(dX - X, 2) + Math.pow(dY - Y, 2));
		this.velocity = [
			(dX - X) / this.magnitude,
			(dY - Y) / this.magnitude
		];
	}



	update() {
		const xInc = this.velocity[0] * this.speed;
		const yInc = this.velocity[1] * this.speed;
		this.X += xInc;
		this.Y += yInc;
		this.range -= Math.sqrt(xInc * xInc + yInc * yInc)
		if(this.range <= 5) this.die()
	}


	//Returns information about firebal that is to be sent to a client

	getPackage(initial = false) {
		if(initial) return {
			dragonID: this.dragonID,
			damage: this.damage,
			ID: this.ID,
			X: this.X, 
			Y: this.Y
		}
		return {
			ID: this.ID,
			X: this.X, 
			Y: this.Y
		}
	}


	//Asks dragon to remove this firebal from its firebals array

	die() {
		this.dragon.removeFirebal(this.ID);
	}
}