const conn = require('../database')

module.exports = class Dragon {

	static getEverything() {
		return new Promise((resolve, reject) => {
			const query = `select dragon.id, dragon_type.id as id_type, dragon_type.name, sprite, max_health,
				 a1_cooldown, a1_speed, a1_range, experience_worth, width, height,
				 gold_worth, respawn_timer, a1_damage, X, Y, dragon_animation.name as defaultAnimation
				 from dragon join dragon_type on dragon.id_dragon_type = dragon_type.id
				 join dragon_animation on dragon.default_animation = dragon_animation.id`
			conn.query(
				query,
				(err, res) => {
					if(err) throw err
					resolve(res)
				}
			)
		})
	}

	static getDragonAnimations() {
		return new Promise((resolve, reject) => {
			conn.query(
				'select * from dragon_animation',
				(err, res) => {
					if(err) throw err
					resolve(res)
				}
			)
		})
	}

	static getAllTypes() {
		return new Promise((resolve, reject) => {
			conn.query(
				`select * from dragon_type`,
				(err, res) => {
					if(err) throw err
					resolve(res)
				}
			)
		})
	}

	static getSpawnedDragons() {
		return new Promise((resolve, reject) => {
			conn.query(
				`select * from dragon`,
				(err, res) => {
					if(err) throw err
					resolve(res)
				}
			)
		})
	}

	static getDragonAnimations() {
		return new Promise((resolve, reject) => {
			conn.query(
				`select * from dragon_animation`,
				(err, res) => {
					if(err) throw err
					resolve(res)
				}
			)
		})
	}

	static newDragonType(data) {
		return new Promise((resolve, reject) => {
			conn.query(
				`insert into dragon_type (name, sprite, max_health,
				 a1_cooldown, a1_speed, a1_range, experience_worth,
				 gold_worth, respawn_timer, a1_damage) values
				 ('${data.name}', '${data.sprite}', ${data.max_health},
				 ${data.a1_cooldown}, ${data.a1_speed}, ${data.a1_range}, 
				 ${data.experience_worth}, ${data.gold_worth}, 
				 ${data.respawn_timer}, ${data.a1_damage})`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	} 

	static updateDragonType(data) {
		return new Promise((resolve, reject) => {
			conn.query(
				`update dragon_type set 
				 name = '${data.name}', sprite = '${data.sprite}', 
				 max_health = ${data.max_health}, a1_cooldown = ${data.a1_cooldown}, 
				 a1_speed = ${data.a1_speed} , a1_range = ${data.a1_range}, 
				 experience_worth = ${data.experience_worth}, gold_worth = ${data.gold_worth}, 
				 respawn_timer = ${data.respawn_timer} , a1_damage = ${data.a1_damage}
				 where id = ${data.id}`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static deleteDragonType(id) {
		return new Promise((resolve, reject) => {
			conn.query(
				`delete from dragon_type where id = ${id}`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static spawnNewDragon(data) {
		return new Promise((resolve, reject) => {
			conn.query(
				`insert into dragon (id_dragon_type, default_animation, X, Y)
				 values(${data.id_dragon_type}, ${data.default_animation},
				 ${data.X}, ${data.Y})`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static updateSpawnedDragon(data) {
		return new Promise((resolve, reject) => {
			conn.query(
				`update dragon set id_dragon_type = ${data.id_dragon_type},
				 default_animation = ${data.default_animation}, 
				 X = ${data.X}, Y = ${data.Y} where id = ${data.id}`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static deleteSpawnedDragon(id) {
		return new Promise((resolve, reject) => {
			conn.query(
				`delete from dragon where id = ${id}`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}
}