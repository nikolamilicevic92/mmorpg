const heroModel    = require('../model/hero'),
	  abilityModel = require("../model/ability"),
	  dragonModel  = require("../model/dragon"),
	  playerModel  = require('../model/player'),
	  baseUrl      = require('../base-url'),
	  fs           = require('fs')

module.exports = class Admin {

	static heroes(req, res) {
		 let promises = []
		 promises.push(heroModel.getHeroesData())
		 promises.push(abilityModel.getAll())
		 Promise.all(promises)
		.then(result => {
			res.render('heroes', {
				data: result[0],
				allAbilities: result[1]
			})
		 }).catch(err => console.log(err))
	}

	static updateHeroes(req, res) {
		 heroModel.updateHeroTypeData(req.body)
		.then(() => Admin.heroes(req, res))
		.catch(err => console.log(err))
	}

	static removeAbilityFromHero(req, res) {
		 heroModel.removeAbility(req.body.id)
		.then(() => {
			res.status(200)
			res.send('ok')
		}).catch(err => reject(err))
	}

	static addNewAbilityToHero(req, res) {
		const data = req.body
		heroModel.addAbility(data.heroTypeID, data.abilityID)
		.then(() => {
			res.writeHead(301, {
				Location: baseUrl + 'admin/heroes'
			})
			res.end()
		}).catch(err => console.log(err))
	}

	static abilities(req, res) {
		 abilityModel.getAll()
		.then(abilities => {
			res.render('abilities', {abilities: abilities})
		}).catch(err => console.log(err))
	}

	static updateAbility(req, res) {
		 abilityModel.update(req.body)
		.then(() => Admin.redirectTo(res, 'abilities'))
		.catch(err => console.log(err))
	}

	static newAbility(req, res) {
		 abilityModel.newAbility(req.body)
		.then(() => Admin.redirectTo(res, 'abilities'))
		.catch(err => console.log(err))
	}

	static deleteAbility(req, res) {
		 abilityModel.deleteAbility(req.body.id)
		.then(() => {
			res.status(200)
			res.send('ok')
		}).catch(err => reject(err))
	}

	static spawnedDragons(req, res) {
		 let promises = []
		 promises.push(dragonModel.getAllTypes())
		 promises.push(dragonModel.getSpawnedDragons())
		 promises.push(dragonModel.getDragonAnimations())
		 Promise.all(promises)
		.then(data => {
			res.render('spawned-dragons', {
				types:      data[0],
				spawned:    data[1],
				animations: data[2]
			})
		}).catch(err => console.log(err))
	}

	static spawnNewDragon(req, res) {
		 dragonModel.spawnNewDragon(req.body)
		.then(() => Admin.redirectTo(res, 'spawned-dragons'))
		.catch(err => console.log(err))
	}

	static showSpawnNewDragon(req, res) {
		 let promises = []
		 promises.push(dragonModel.getAllTypes())
		 promises.push(dragonModel.getDragonAnimations())
		 Promise.all(promises)
		.then(data => {
			res.render('spawn-new-dragon', {
				types:      data[0],
				animations: data[1]
			})
		}).catch(err => console.log(err))
	}

	static updateSpawnedDragon(req, res) {
		 dragonModel.updateSpawnedDragon(req.body)
		.then(() => Admin.redirectTo(res, 'spawned-dragons'))
		.catch(err => console.log(err))
	}

	static deleteSpawnedDragon(req, res) {
		 dragonModel.deleteSpawnedDragon(req.body.id)
		.then(() => {
			res.status(200)
			res.send(JSON.stringify({success: true}))
		}).catch(err => {
			console.log(err)
			res.status(200)
			res.send(JSON.stringify({success: false, message: err}))
		})
	}

	static dragonTypes(req, res) {
		 dragonModel.getAllTypes()
		.then(types => {
			res.render('dragon-types', {types: types})
		}).catch(err => console.log(err))
	}

	static newDragonType(req, res) {
		 dragonModel.newDragonType(req.body)
		.then(() => Admin.redirectTo(res, 'dragon-types'))
		.catch(err => console.log(err))
	}

	static updateDragon(req, res) {
		 dragonModel.updateDragonType(req.body)
		.then(() => Admin.redirectTo(res, 'dragon-types'))
		.catch(err => console.log(err))
	}

	static deleteDragonType(req, res) {
		 dragonModel.deleteDragonType(req.body.id)
		.then(() => {
			res.status(200)
			res.send(JSON.stringify({success: true}))
		}).catch(err => {
			console.log(err)
			res.status(200)
			res.send(JSON.stringify({success: false, message: err}))
		})
	}

	static loadMap(req, res = false) {
		fs.readFile(`server/maps/${req.body.map_name}.json`, 'utf8', (err, data) => {
			if(err) {
				res.status(200)
				res.send('0')
			} else {
				res.status(200)
				res.send(data)
			}
		})
	}

	static deliverMapToClient(socket) {
		fs.readFile(`server/maps/world.json`, 'utf8', (err, data) => {
			if(err) {
				socket.emit('mapData', false)
			} else {
				socket.emit('mapData', data)
			}
		})
	}

	static saveMap(req, res) {
		fs.writeFile(
			`server/maps/${req.body.map_name}.json`,
			req.body.map_data,
			err => {
				if(err) console.log(err)
				else {
					res.status(200)
					res.send('ok')
				}
			} 
		)
	}

	static players(req, res) {
		 playerModel.getAll()
		.then(players => {
			let promises = []
			players.forEach(player => {
				promises.push(heroModel.getByUsername(player.username))
			})
			Promise.all(promises)
			.then(heroes => {
				heroes.forEach((ownedHeroes, i) => {
					players[i].ownedHeroes = ownedHeroes
					console.log(ownedHeroes)
				})
				console.log(players)
				res.render('players', { players })
			}).catch(err => console.log(err))
		}).catch(err => console.log(err))
	}

	static redirectTo(res, page) {
		res.writeHead(301, {
			Location: baseUrl + 'admin/' + page
		})
		res.end()
	}
}