
module.exports = class Chat {

	static process(socket, data, NAMES_SOCKETS, io) {
		//If it is a whisper
		if(data.activeCard == 3) {
			if(!NAMES_SOCKETS[data.to]) {
				socket.emit('chat', {
					message: `${data.to} is not online or does not exist, please check if you typed the name correctly`,
					activeCard: 3,
					sender: 'System'
				})
			} else {
				NAMES_SOCKETS[data.to].emit('chat', data)
			}
		} else {
			io.emit('chat', data)
		}
	}

	static party(socket, data, PARTIES, HEROES) {
		if(data.code == 'make') {
			Chat.makeParty(socket, data, PARTIES, HEROES)
		} else if(data.code == 'join') {
			Chat.addHeroToParty(socket, data, PARTIES, HEROES)
		} else if(data.code == 'message') {
			Chat.sendToParty(data, PARTIES)
		} else if(data.code == 'leave') {
			Chat.removeHeroFromParty(socket, data, PARTIES, HEROES)
		}
	}

	static makeParty(socket, data, PARTIES, HEROES) {
		if(PARTIES[data.name]) {
			socket.emit('party', {
				code: 'nameTaken'
			})
		} else {
			PARTIES[data.name]          = {}
			PARTIES[data.name][data.id] = socket
			HEROES[socket.id].party     = data.name
			socket.emit('party', {
				code: 'created',
				name: data.name
			})
		}
	}

	static addHeroToParty(socket, data, PARTIES, HEROES) {
		if(PARTIES[data.name]) {
			if(!PARTIES[data.name][data.id]) {
				Chat.sendToParty({
					sender  : 'System', name: data.name, 
					message : `${data.heroName} has joined the party` 
				}, PARTIES)
				PARTIES[data.name][data.id] = socket
				HEROES[socket.id].party     = data.name
				socket.emit('party', {
					code: 'joined',
					name: data.name
				})
			} else {
				//Already in party
			}
		} else {
			socket.emit('party', {
				code: 'notFound',
				name: data.name
			})
		}
	}

	static removeHeroFromParty(socket, data, PARTIES, HEROES) {
		delete PARTIES[data.name][data.id]
		HEROES[socket.id].party = false
		let partyHasMemebers = false
		for(let id in PARTIES[data.name]) {
			partyHasMemebers = true
			break
		}
		if(!partyHasMemebers) delete PARTIES[data.name]
		else Chat.sendToParty({
			sender  : 'System', name: data.name, 
			message : `${data.heroName} has left the party` 
		}, PARTIES)
	}

	static sendToParty(data, PARTIES) {
		for(let id in PARTIES[data.name]) {
			//socket is here
			PARTIES[data.name][id].emit('chat', {
				message    : data.message,
				activeCard : 2,
				sender     : data.sender
			})
		}
	}
}