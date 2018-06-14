class Player {

	//Initializing stuff

	constructor(data) {
		this.X = data.X
		this.Y = data.Y
		this.name = data.name
		this.type = data.type
		this.experience = data.experience
		this.level = data.level
		this.invisible = false
		this.paused = true
		this.maxHealth = 1000 + (this.level - 1) * 500
		this.health = this.maxHealth
		this.animation = 'right'
	}


	//Updates self based on data recieved from the client 

	updateState(data) {
		this.X = data.X
		this.Y = data.Y
		this.invisible = data.invisible
		// this.axis = data.axis
		this.animation = data.animation
		this.paused = data.paused
		this.experience = data.experience
		this.level = data.level
		this.health = data.health
		this.maxHealth = data.maxHealth
	}

	//Returns center of the player, used for firebal's destination

	get axisX() {
		return this.X + this.width / 2
	}
	get axisY() {
		return this.Y + this.height / 2
	}

	getPackage(initial = false) {
		if(initial) return {
			X: parseInt(this.X), Y: parseInt(this.Y), width: this.width, height: this.height,
			animation: this.animation, paused: this.paused,
			name: this.name, type: this.type,
			health: this.health, maxHealth: this.maxHealth,
			experience: this.experience, level: this.level
		}
		return {
			X: parseInt(this.X), Y: parseInt(this.Y),
			animation: this.animation, paused: this.paused, 
			health: this.health, maxHealth: this.maxHealth,
			experience: this.experience, level: this.level
		}
	}
}

module.exports = Player