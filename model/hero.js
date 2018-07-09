const conn         = require('../database'),
      abilityModel = require('./ability')

module.exports = class Hero {

	static nameNotTaken(name) {
		return new Promise((resolve, reject) => {
			conn.query(
				`select * from hero where name = '${name}'`,
				(err, res) => {
					if(err) throw err
					if(res.length == 0) resolve()
					else reject('Name is already taken')
				}
			)
		})
	}

	static insert(data) {
		return new Promise((resolve, reject) => {
			conn.query(
				`insert into hero (id_player, id_hero_type, name, health) values 
				 ((select id from player where username = '${data.username}'), 
				  (select id from hero_type where type = '${data.heroType}'), 
				  '${data.heroName}', 
				  (select base_health from hero_type where type = '${data.heroType}')
				 )`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static delete(heroName) {
		return new Promise((resolve, reject) => {
			conn.query(
				`delete from hero where name = '${heroName}'`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static getHeroesData() {
		return new Promise((resolve, reject) => {
			conn.query(
				`select * from hero_type`,
				(err, heroesData) => {
					if(err) throw err
					let promises = []
					heroesData.forEach(heroData => {
						promises.push(abilityModel.ownedByHero(heroData.id))
					})
					Promise.all(promises)
					.then(abilities => {
						abilities.forEach((heroAbilities, index) => {
							heroesData[index].abilities = heroAbilities
						})
						resolve(heroesData)
					}).catch(err => reject(err))
				}
			)
		})
	}

	static updateHeroTypeData(data) {
		return new Promise((resolve, reject) => {
			conn.query(
				`update hero_type set type = '${data.type}', description = '${data.description}', sprite = '${data.sprite}', base_attack = ${data.base_attack}, base_defence = ${data.base_defence}, base_mobility = ${data.base_mobility}, base_health = ${data.base_health} where id = ${data.hero_id}`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static getByUsername(username) {
		return new Promise((resolve, reject) => {
			conn.query(
				`select hero.id, id_quest, name, type, experience, level, gold, 
				 health, X, Y, won from hero 
				 join player on
				 hero.id_player = player.id
				 join hero_type on
				 hero_type.id = hero.id_hero_type
				 where username = '${username}'`,
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
				`update hero set id_quest = ${data.questID}, level = ${data.level}, 
				 experience = ${data.experience}, health = ${data.health}, 
				 gold = ${data.gold}, X = ${data.X}, Y = ${data.Y} where id = ${data.id}`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static addAbility(heroTypeID, abilityID) {
		return new Promise((resolve, reject) => {
			conn.query(
				`insert into hero_type_abilities (id_hero_type2, id_ability)
				 values(${heroTypeID}, ${abilityID})`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static removeAbility(id) {
		return new Promise((resolve, reject) => {
			conn.query(
				`delete from hero_type_abilities where id = ${id}`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static win(id) {
		return new Promise((resolve, reject) => {
			conn.query(
				`update hero set won = true where id = ${id}`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}	
}