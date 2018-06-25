const heroModel    = require('../model/hero'),
      abilityModel = require('../model/ability'),
      questModel   = require('../model/quest')

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

	updateDBState() {
		heroModel.update({
			questID: this.props.id_quest, level: this.props.level,
			experience: this.props.experience, health: this.props.health,
			gold: this.props.gold, X: this.props.X, Y: this.props.Y,
			id: this.props.id
		}).catch(err => console.log(err))
	}

	static getHeroesData(socket) {
		 heroModel.getHeroesData()
		.then(data => socket.emit('heroesData', data))
		.catch(err => console.log(err))
	}

	static sendQuests(socket) {
		 questModel.getAll()
		.then(quests => socket.emit('quests', quests))
		.catch(err => console.log(err))
	}

	static win(id) {
		 heroModel.win(id)
		.catch(err => console.log(err))
	}
}