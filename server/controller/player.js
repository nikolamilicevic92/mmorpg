const playerModel = require('../model/player')
const heroModel = require('../model/hero')

module.exports = class Player {

	constructor() {
		
	}

	static login(data, socket, PLAYERS) {
		 playerModel.exists(data)
		.then(() => playerModel.notLoggedIn(data))
		.then(() => playerModel.login(data))
		.then(() => Player.getOwnedHeroes(data))
		.then(ownedHeroes => {
			socket.emit('login', {
				success: true, ownedHeroes
			})
			PLAYERS[socket.id] = data.username
		})
		.catch(msg => {
			socket.emit('login', {
				success: false, message: msg
			})
		})
	}

	static logout(username) {
		return new Promise((resolve, reject) => {
			 playerModel.logout(username)
			.then(() => resolve())
			.catch((msg) => reject(msg))
		})
	}

	static logoutEveryone() {
		playerModel.logoutEveryone()
	}

	static register(data, socket) {
		 playerModel.accountNotRegistered(data.email)
		.then(() => playerModel.usernameNotTaken(data.username))
		.then(() => playerModel.insert(data))
		.then(() => socket.emit('register', {success: true}))
		.catch(msg => socket.emit('register', {
			success: false, message: msg
		}))
	}

	static addHero(data, socket) {
		 playerModel.hasFreeSlots(data.username)
		.then(() => heroModel.nameNotTaken(data.heroName))
		.then(() => heroModel.insert(data))
		.then(() => playerModel.decrementHeroSlots(data.username))
		.then(() => Player.getOwnedHeroes(data))
		.then(ownedHeroes => {
			socket.emit('heroCreation', {
				success: true, ownedHeroes
			})
		})
		.catch(msg => socket.emit('heroCreation', {
			success: false, message: msg
		}))
	}

	static deleteHero(data, socket) {
		 heroModel.delete(data.heroName)
		.then(() => playerModel.incrementHeroSlots(data.username))
		.then(() => Player.getOwnedHeroes(data))
		.then(ownedHeroes => {
			socket.emit('heroDeleted', ownedHeroes)
		})
		.catch(err => console.log(err))
	}

	static getOwnedHeroes(data) {
		return new Promise((resolve, reject) => {
			 heroModel.getByUsername(data.username)
			.then(chars => resolve(chars))
			.catch(msg => reject(msg))
		})
	}
}