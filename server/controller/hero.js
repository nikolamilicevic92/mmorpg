const heroModel = require('../model/hero')
const abilityModel = require('../model/ability')

module.exports = class Hero {

	constructor(props, socket) {
		this.props  = props
		this.socket = socket
		this.party  = false
	}

	setProps(props) {
		for(let key in props) {
			this.props[key] = props[key]
		}
	}

	//Do we need to return all this on normal package???
	getProps(initial = false) {
		let props = {
			id: this.props.id, X: this.props.X, Y: this.props.Y,
			activeAnimation: this.props.activeAnimation,
			frame: this.props.frame, level: this.props.level,
			experience: this.props.experience, health: this.props.health,
			gold: this.props.gold, id_quest: this.props.id_quest 
		}
		if(initial) {
			props = Object.assign({}, props, {
				infoColor: this.props.infoColor,
				interval: this.props.interval,
				type: this.props.type, name: this.props.name

			})
		}
		return props
	}

	static getHeroesData(socket) {
		 heroModel.getHeroesData()
		.then(data => socket.emit('heroesData', data))
		.catch(err => console.log(err))
	}

}