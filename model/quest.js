const conn = require('../database')

module.exports = class Quest {

	static insert(data) {
		return new Promise((resolve, reject) => {
			console.log(data)
			conn.query(
				`insert into quest (name, description, gold, experience, dragon, amount)
				 values('${data.name}', '${data.description}', ${data.gold}, 
				 ${data.experience}, '${data.dragon}', ${data.amount})`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static getAll() {
		return new Promise((resolve, reject) => {
			conn.query(
				`select * from quest`,
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
				`update quest set name = '${data.name}', description = '${data.description}',
				 gold   = ${data.gold}, experience = ${data.experience}, 
				 dragon = '${data.dragon}', amount = ${data.amount} where id = ${data.id}`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static delete(id) {
		return new Promise((resolve, reject) => {
			conn.query(
				`delete from quest where id = ${id}`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}
}