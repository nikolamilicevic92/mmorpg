const express    = require('express'),
      app        = express(),
      session    = require('express-session'),
      parseurl   = require('parseurl'),
      path       = require('path'),
      formidable = require('formidable'),
      serv       = require('http').Server(app),
      io         = require('socket.io')(serv, {}),
      Player     = require('./server/controller/player'),
      Hero       = require('./server/controller/hero'),
      Chat       = require('./server/controller/chat'),
      Admin      = require('./server/controller/admin'),
      Dragon     = require('./server/controller/dragon'),
      Arena      = require('./server/managers/arena'),
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


let PLAYERS       = {}
let HEROES        = {}
let NAMES_SOCKETS = {}
let PARTIES       = {}
let DRAGONS       = {}
let FIREBALLS     = {}
const ARENA = new Arena(DRAGONS, HEROES, FIREBALLS)

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

	 //Sending quests
	 Hero.sendQuests(socket)
	

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

	socket.on('fireballDeath', ID => {
		socket.broadcast.emit('fireballDeath', ID)
	})

	socket.on('chat', data => {
		Chat.process(socket, data, NAMES_SOCKETS, io)
	})

	socket.on('party', data => {
		Chat.party(socket, data, PARTIES, HEROES)
	})

	socket.on('gameWon', heroID => {
		Hero.win(heroID)
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

	//Arena
	ARENA.update()
}, 16)

//Saving hero progress and position every second
setInterval(() => {
	for(let id in HEROES) {
		HEROES[id].updateDBState()
	}
}, 1000)




app.use(session({
	resave: false,
	saveUninitialized: true,
	secret: 'tobechanged'
}))

app.use(require('body-parser').urlencoded({limit: '50mb', extended: true}))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/client/game.html'))
})

app.get('/admin/login', (req, res) => {
	res.sendFile(__dirname + '/views/login.html')
})

app.get('/admin/logouttt', (req, res) => {
	req.session.destroy()
	Admin.redirectTo(res, 'login')
})

app.post('/admin/login', (req, res) => {
	const admin = {username: 'test', password: '123'}
	if(req.body.username == admin.username &&
		req.body.password == admin.password) {
		req.session.loggedIn = true
		Admin.redirectTo(res, 'heroes')
	} else {
		Admin.redirectTo(res, 'login')
	}
})

//Middleware not allowing request to go further unless session is set
app.use((req, res, next) => {
	if(req.url.includes('admin') && !req.session.loggedIn) {
		Admin.redirectTo(res, 'login')
	} else {
		next()
	}
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

app.get('/admin/new-ability', (req, res) => {
	res.render('new-ability')
})

app.get('/admin/dragon-types', (req, res) => {
	Admin.dragonTypes(req, res)
})

app.get('/admin/new-dragon-type', (req, res) => {
	res.render('new-dragon-type')
})

app.get('/admin/spawned-dragons', (req, res) => {
	Admin.spawnedDragons(req, res)
})

app.get('/admin/spawn-new-dragon', (req, res) => {
	Admin.showSpawnNewDragon(req, res)
})

app.get('/admin/players', (req, res) => {
	Admin.players(req, res)
})

app.get('/admin/update-quests', (req, res) => {
	Admin.editQuests(req, res)
})

app.get('/admin/new-quest', (req, res) => {
	Admin.newQuest(req, res)
})

// Post requests

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

app.post('/admin/set-char-slots', (req, res) => {
	Admin.setCharSlots(req, res)
})

app.post('/admin/update-owned-hero', (req, res) => {
	Admin.updateOwnedHero(req, res)
})

app.post('/admin/add-new-quest', (req, res) => {
	Admin.addNewQuest(req, res)
})

app.post('/admin/update-quest', (req, res) => {
	Admin.updateQuest(req, res)
})

app.post('/admin/delete-quest', (req, res) => {
	Admin.deleteQuest(req, res)
})















app.use('/client', express.static(__dirname + '/client'))

serv.listen(5000, () => {
	console.log('Listening on port 5000...')
})
// serv.listen(process.env.PORT || 5000);