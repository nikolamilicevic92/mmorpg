const express    = require('express'),
      app        = express(),
      path       = require('path'),
      formidable = require('formidable'),
      serv       = require('http').Server(app),
      io         = require('socket.io')(serv, {}),
      Player     = require('./server/controller/player'),
      Hero       = require('./server/controller/hero'),
      Chat       = require('./server/controller/chat'),
      Admin      = require('./server/controller/admin'),
      Dragon     = require('./server/controller/dragon'),
      handlebars = require('express-handlebars').create({
      	defaultLayout: 'main',
      	helpers      : {
      		isSelected: (id1, id2) => {
      			return id1 == id2 ? 'selected' : ''
      		}
      	}
      })

app.disable('x-powered-by')
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')


let PLAYERS = {}
let HEROES = {}
let NAMES_SOCKETS = {}
let PARTIES = {}
let DRAGONS = {}

//Safety measure in case of server crash
Player.logoutEveryone()
Dragon.getDragonsBootstrapPackage()
.then(data => {
	let animations = {}
	data[1].forEach(animData => {
		animations[animData.name] = JSON.parse(animData.coordinates)
	})
	data[0].forEach(_props => {
		const props = Object.assign({}, _props, {animations})
		DRAGONS[props.id] = Dragon.makeDragon(props)
	}) 
}).catch(err => console.log(err))




io.sockets.on('connection', socket => {

	//Full information about every hero type is sent on connection

	 Hero.getHeroesData(socket)
	

	//Sending map 
	Admin.deliverMapToClient(socket)


	socket.on('/player/login', data => {
		 Player.login(data, socket, PLAYERS)
	})

	socket.on('/player/register', data => {
		 Player.register(data, socket)
	})

	socket.on('/player/addHero', data => {
		 Player.addHero(data, socket)
	})

	socket.on('/player/deleteHero', data => {
		 Player.deleteHero(data, socket)
	})


	//In game events...

	socket.on('getInitPackage', heroProps => {		
		let heroesProps    = [], dragonsProps = []
		const newHero      = new Hero(heroProps, socket),
		      newHeroProps = newHero.getProps(true)
		
		for(let id in HEROES) {
			heroesProps.push(HEROES[id].getProps(true))
			HEROES[id].socket.emit('newHeroConnected', newHeroProps)
		}
		for(let id in DRAGONS) {
			dragonsProps.push(DRAGONS[id].getProps(true))
		}
		HEROES[socket.id] = newHero
		NAMES_SOCKETS[heroProps.name] = socket
		socket.emit('initPackage', {heroesProps, dragonsProps})
	})

	socket.on('selfState', heroProps => {
		if(HEROES[socket.id]) {
			HEROES[socket.id].setProps(heroProps)
		}
	})

	socket.on('ability', pack => {
		for(let id in HEROES) {
			HEROES[id].socket.emit('ability', pack)
		}
	})

	socket.on('dragonHit', data => {
		DRAGONS[data.ID].takeDamage(data, NAMES_SOCKETS)
	})

	socket.on('chat', data => {
		Chat.process(socket, data, NAMES_SOCKETS, io)
	})

	socket.on('party', data => {
		Chat.party(socket, data, PARTIES, HEROES)
	})

	socket.on('disconnect', () => {		
		Player.logout(PLAYERS[socket.id])
		delete PLAYERS[socket.id]
		//Notifying other heroes about disconnected hero so they can remove him

		if(!HEROES[socket.id]) return
		for(let id in HEROES) {
			HEROES[id].socket.emit('heroDisconnected', HEROES[socket.id].props.id)
		}
		delete NAMES_SOCKETS[HEROES[socket.id].name]
		if(HEROES[socket.id].party) {
			Chat.removeHeroFromParty(socket, {
				name    : HEROES[socket.id].party,
				id      : HEROES[socket.id].props.id,
				heroName: HEROES[socket.id].props.name
			}, PARTIES, HEROES)
		}
		delete HEROES[socket.id]
	})
		
})

setInterval(() => {
	let heroesProps = [], dragonsProps = []

	//Dragons
	for(let id in DRAGONS) {
		if(!DRAGONS[id].dead) {
			DRAGONS[id].update()
			dragonsProps.push(DRAGONS[id].getProps())
		}
	}

	//Heroes
	for(let id in HEROES) {
		heroesProps.push(HEROES[id].getProps())
	}
	const data = {heroesProps, dragonsProps}
	for(let id in HEROES) {
		HEROES[id].socket.emit('updatePackage', data)
	}
}, 16)








app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/client/game.html'))
})

app.get('/admin/map-editor', (req, res) => {
	res.render('map-editor')
})

app.get('/admin/heroes', (req, res) => {
	Admin.heroes(req, res)
})

app.get('/admin/abilities', (req, res) => {
	Admin.abilities(req, res)
})

app.get('/admin/dragon-types', (req, res) => {
	Admin.dragonTypes(req, res)
})

app.get('/admin/spawned-dragons', (req, res) => {
	Admin.spawnedDragons(req, res)
})

// Post requests

app.use(require('body-parser').urlencoded({limit: '50mb', extended: true}))

app.post('/admin/heroes', (req, res) => {
	 Admin.updateHeroes(req, res)
})

app.post('/admin/removeAbilityFromHero', (req, res) => {
	 Admin.removeAbilityFromHero(req, res)
})

app.post('/admin/addNewAbilityToHero', (req, res) => {
	 Admin.addNewAbilityToHero(req, res)
})

app.post('/admin/updateAbility', (req, res) => {
	Admin.updateAbility(req, res)
})

app.post('/admin/newAbility', (req, res) => {
	Admin.newAbility(req, res)
})

app.post('/admin/deleteAbility', (req, res) => {
	Admin.deleteAbility(req, res)
})

app.post('/admin/newDragonType', (req, res) => {
	Admin.newDragonType(req, res)
})

app.post('/admin/updateDragon', (req, res) => {
	Admin.updateDragon(req, res)
})

app.post('/admin/deleteDragonType', (req, res) => {
	Admin.deleteDragonType(req, res)
})

app.post('/admin/spawnNewDragon', (req, res) => {
	Admin.spawnNewDragon(req, res)
})

app.post('/admin/updateSpawnedDragon', (req, res) => {
	Admin.updateSpawnedDragon(req, res)
})

app.post('/admin/deleteSpawnedDragon', (req, res) => {
	Admin.deleteSpawnedDragon(req, res)
})

app.post('/admin/save-map', (req, res) => {
	Admin.saveMap(req, res)
})

app.post('/admin/load-map', (req, res) => {
	Admin.loadMap(req, res)
})















app.use('/client', express.static(__dirname + '/client'))

serv.listen(5000, () => {
	console.log('Listening on port 5000...')
})
// serv.listen(process.env.PORT || 5000);