const heroModel    = require('../model/hero'),
	  abilityModel = require("../model/ability"),
	  dragonModel  = require("../model/dragon"),
		playerModel  = require('../model/player'),
		assetsModel  = require('../model/assets'),
	  questModel   = require('../model/quest'),
	  baseUrl      = require('../base-url'),
	  fs           = require('fs'),
	  logger       = require('../logger')

module.exports = class Admin {

	//Heroes

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
		 }).catch(err => logger.log(err))
	}

	static updateHeroes(req, res) {
		 heroModel.updateHeroTypeData(req.body)
		.then(() => Admin.heroes(req, res))
		.catch(err => logger.log(err))
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
		}).catch(err => logger.log(err))
	}



	//Abilities

	static abilities(req, res) {
		 abilityModel.getAll()
		.then(abilities => {
			res.render('abilities', {abilities: abilities})
		}).catch(err => logger.log(err))
	}

	static updateAbility(req, res) {
		 abilityModel.update(req.body)
		.then(() => Admin.redirectTo(res, 'abilities'))
		.catch(err => logger.log(err))
	}

	static newAbility(req, res) {
		 abilityModel.newAbility(req.body)
		.then(() => Admin.redirectTo(res, 'abilities'))
		.catch(err => logger.log(err))
	}

	static deleteAbility(req, res) {
		 abilityModel.deleteAbility(req.body.id)
		.then(() => {
			res.status(200)
			res.send('ok')
		}).catch(err => reject(err))
	}



	//Dragons

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
		}).catch(err => logger.log(err))
	}

	static spawnNewDragon(req, res) {
		 dragonModel.spawnNewDragon(req.body)
		.then(() => Admin.redirectTo(res, 'spawned-dragons'))
		.catch(err => logger.log(err))
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
		}).catch(err => logger.log(err))
	}

	static updateSpawnedDragon(req, res) {
		 dragonModel.updateSpawnedDragon(req.body)
		.then(() => Admin.redirectTo(res, 'spawned-dragons'))
		.catch(err => logger.log(err))
	}

	static deleteSpawnedDragon(req, res) {
		 dragonModel.deleteSpawnedDragon(req.body.id)
		.then(() => {
			res.status(200)
			res.send(JSON.stringify({success: true}))
		}).catch(err => {
			logger.log(err)
			res.status(200)
			res.send(JSON.stringify({success: false, message: err}))
		})
	}

	static dragonTypes(req, res) {
		 dragonModel.getAllTypes()
		.then(types => {
			res.render('dragon-types', {types: types})
		}).catch(err => logger.log(err))
	}

	static newDragonType(req, res) {
		 dragonModel.newDragonType(req.body)
		.then(() => Admin.redirectTo(res, 'dragon-types'))
		.catch(err => logger.log(err))
	}

	static updateDragon(req, res) {
		 dragonModel.updateDragonType(req.body)
		.then(() => Admin.redirectTo(res, 'dragon-types'))
		.catch(err => logger.log(err))
	}

	static deleteDragonType(req, res) {
		 dragonModel.deleteDragonType(req.body.id)
		.then(() => {
			res.status(200)
			res.send(JSON.stringify({success: true}))
		}).catch(err => {
			logger.log(err)
			res.status(200)
			res.send(JSON.stringify({success: false, message: err}))
		})
	}



	//Map

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
				if(err) logger.log(err)
				else {
					res.status(200)
					res.send('ok')
				}
			} 
		)
	}



	//Players

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
					logger.log(ownedHeroes)
				})
				logger.log(players)
				res.render('players', { players })
			}).catch(err => logger.log(err))
		}).catch(err => logger.log(err))
	}

	static setCharSlots(req, res) {
		 playerModel.setCharSlots(req.body.id, req.body.char_slots)
		.then(() => Admin.redirectTo(res, 'players'))
		.catch(err => logger.log(err))
	}

	static updateOwnedHero(req, res) {
		 heroModel.update(req.body)
		.then(() => Admin.redirectTo(res, 'players'))
		.catch(err => logger.log(err))
	}



	//Quests

	static editQuests(req, res) {
		let promises = []
		promises.push(questModel.getAll())
		promises.push(dragonModel.getAllTypes())
		Promise.all(promises)
		.then(data => {
			res.render('edit-quests', {
				quests: data[0], dragons: data[1]
			})
		}).catch(err => logger.log(err))
	}

	static newQuest(req, res) {
		 dragonModel.getAllTypes()
		.then(types => {
			// logger.log(types)
			res.render('new-quest', {types})
		}).catch(err => logger.log(err))
	}

	static addNewQuest(req, res) {
		 questModel.insert(req.body)
		.then(() => Admin.redirectTo(res, 'new-quest'))
		.catch(err => logger.log(err))
	}

	static updateQuest(req, res) {
		 questModel.update(req.body)
		.then(() => Admin.redirectTo(res, 'update-quests'))
		.catch(err => logger.log(err))
	}

	static deleteQuest(req, res) {
		 questModel.delete(req.body.id)
		.then(() => {
			res.status = 200
			res.send('ok')
		}).catch(err => logger.log(err))
	}

	//Assets

	static images(req, res) {
		 assetsModel.getImages()
		.then(images => res.render('images', { images }))
		.catch(err => logger.log(err))
	}

	static uploadImage(req, res) {		 
		 assetsModel.uploadImage(req)
		.then(() => {			
			Admin.redirectTo(res, 'images')			
		})
		.catch(err => logger.log(err))
	}

	static renameImage(req, res) {
		 assetsModel.renameImage(req.body.image, req.body.new_name)
		.then(() => Admin.redirectTo(res, 'images'))
		.catch(err => logger.log(err))
	}

	static deleteImage(req, res) {
		 assetsModel.deleteImage(req.body.image)
		.then(() => Admin.redirectTo(res, 'images'))
		.catch((err) => logger.log(err))
	}

	static sounds(req, res) {
		 assetsModel.getSounds()
	  .then(sounds => {
			const weird = sounds.indexOf('Folder.jpg')
			if(weird != -1) {
				sounds.splice(weird, 1)
			}
			res.render('sounds', { sounds })
		})
	  .catch(err => logger.log(err))
  }

  static uploadSound(req, res) {
	  assetsModel.uploadSound(req)
	  .then(() => Admin.redirectTo(res, 'sounds'))
	  .catch(err => logger.log(err))
	}

  static renameSound(req, res) {
	   assetsModel.renameSound(req.body.sound, req.body.new_name)
		.then(() => Admin.redirectTo(res, 'sounds'))
		.catch(err => logger.log(err))
	}

	static deleteSound(req, res) {
		 assetsModel.deleteSound(req.body.sound)
		.then(() => Admin.redirectTo(res, 'sounds'))
		.catch((err) => logger.log(err))
  }

	static redirectTo(res, page) {
		res.writeHead(301, {
			Location: baseUrl + 'admin/' + page
		})
		res.end()
	}
}