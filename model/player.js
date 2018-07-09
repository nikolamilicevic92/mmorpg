const conn = require('../database'),
	    md5  = require('md5')

class Player {

	static accountNotRegistered(email) {
		return new Promise((resolve, reject) => {
			conn.query(
				`select * from player where email = '${email}'`,
				(err, res) => {
					if(err) throw err
					if(res.length == 0) resolve()
					else reject('Account is already registered')
				}
			)
		})
	}

	static usernameNotTaken(username) {
		return new Promise((resolve, reject) => {
			conn.query(
				`select * from player where username = '${username}'`,
				(err, res) => {
					if(err) throw err
					if(res.length == 0) resolve()
					else reject('Username is taken')
				}
			)
		})
	}

	static insert(data) {
		return new Promise((resolve, reject) => {
			conn.query(
				`insert into player(email, username, password, char_slots)
				 values('${data.email}', '${data.username}', '${md5(data.password)}', 2)`,
				 (err, res) => {
				 	if(err) throw err
				 	resolve()
				 }
			)
		})
	}

	static hasFreeSlots(username) {
		return new Promise((resolve, reject) => {
			conn.query(
				`select char_slots from player where username = '${username}'`,
				(err, res) => {
					if(err) throw err
					if(res[0].char_slots > 0) resolve()
					else reject('Out of slots')
				}
			)
		})
	}

	static incrementHeroSlots(username) {
		return new Promise((resolve, reject) => {
			conn.query(
				`update player set char_slots = char_slots + 1 where 
				 username = '${username}'`,
				 (err, res) => {
				 	if(err) throw err
				 	resolve()
				 }
			)
		})
	}

	static decrementHeroSlots(username) {
		return new Promise((resolve, reject) => {
			conn.query(
				`update player set char_slots = char_slots - 1 where 
				 username = '${username}'`,
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
				`select * from player`,
				(err, res) => {
					if(err) throw err
					resolve(res)
				}
			)
		})
	}

	static exists(data) {
		return new Promise((resolve, reject) => {
			conn.query(
				`select * from player where 
				 username = '${data.username}' and password = '${md5(data.password)}'`,
				(err, res) => {
					if(err) throw err
					if(res.length == 1) resolve()
					else reject('Invalid username / password combination')
				}
			)
		})
	}

	static notLoggedIn(data) {
		return new Promise((resolve, reject) => {
			conn.query(
				`select logged_in from player where 
				 username = '${data.username}' and password = '${md5(data.password)}'`,
				(err, res) => {
					if(err) throw err
					if(res[0].logged_in == false) resolve()
					else (reject('Account is already logged in'))
				}
			)
		})
	}

	static login(data) {
		return new Promise((resolve, reject) => {
			conn.query(
				`update player set logged_in = true where 
				 username = '${data.username}' and password = '${md5(data.password)}'`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static logout(username) {
		return new Promise((resolve, reject) => {
			conn.query(
				`update player set logged_in = false where 
				 username = '${username}'`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

	static logoutEveryone() {
		conn.query(
			`update player set logged_in = false`,
			(err, res) => {
				if(err) throw err
			}
		)
	}

	static setCharSlots(id, char_slots) {
		return new Promise((resolve, reject) => {
			conn.query(
				`update player set char_slots = ${char_slots} where id = ${id}`,
				(err, res) => {
					if(err) throw err
					resolve()
				}
			)
		})
	}

}

module.exports = Player