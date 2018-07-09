const conn = require('../database')

module.exports = class Ability {

	static ownedByHero(heroID) {
		return new Promise((resolve, reject) => {
			conn.query(
				`select * from ability join hero_type_abilities on ability.id = id_ability where id_hero_type2 = ${heroID}`,
				(err, res) => {
					if(err) throw err
					resolve(res)
				}
			)
		})
	}

	static getAll() {
		return new Promise((resolve, reject) => {
			conn.query(
				`select * from ability`,
				(err, res) => {
					if(err) throw err
					resolve(res)
				}
			)
		})
	}

	static update(data) {
		return new Promise((resolve, reject) => {
			conn.query(
				`update ability set 
				 name = '${data.name}', sprite = '${data.sprite}', _range = ${data._range},
				 sound = '${data.sound}', width = ${data.width}, height = ${data.height},
				 damage = ${data.damage}, speed = ${data.speed}, cooldown = ${data.cooldown}, 
				 description = '${data.description}' where id = ${data.id}`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	//Make this generic key value building query !!!
	static newAbility(data) {
		return new Promise((resolve, reject) => {
			conn.query(
				`insert into ability (name, sprite, _range, sound, width, height, damage,
				 speed, cooldown, description) values('${data._name}', '${data._sprite}', 
				 ${data._range}, '${data._sound}', ${data._width}, ${data._height}, 
				 ${data._damage}, ${data._speed}, ${data._cooldown}, '${data._description}')`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)		
		})
	}

	static deleteAbility(id) {
		return new Promise((resolve, reject) => {
			conn.query(
				`delete from ability where id = ${id}`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}
}