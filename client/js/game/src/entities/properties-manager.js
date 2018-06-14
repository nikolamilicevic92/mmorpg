export class PropertiesManager {

	constructor(hero) {
		this.hero = hero
		this.props = hero.props
	}

	setProps(props) {
		for(let key in props) {
			this.hero.props[key] = props[key]
		}
	}

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
}