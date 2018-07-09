export class Client {


	constructor(game, socket) {
		this.game = game
		this.init(socket)
	}


	init(socket) {
		socket.on('heroesData', heroesData => {
			this.game.heroesData = {}
			heroesData.forEach(heroData => {
				this.game.heroesData[heroData.type] = heroData
			})
			console.log(this.game.heroesData)
			this.game.heroCreation.init(heroesData)
		})

		socket.on('quests', quests => {
			quests.forEach(quest => {
				this.game.quests[quest.id] = quest
			})
			console.log(this.game.quests)
		})

		socket.on('mapData', data => this.game.map.init(JSON.parse(data)))

		socket.on('heroCreation', data => {
			this.game.heroCreation.onEvent(data)
		})

		socket.on('heroDeleted', ownedHeroes => {
			this.game.heroSelection.init(ownedHeroes)
		})

		socket.on('login', data => {		
			this.game.loginScreen.onEvent(data)
		})

		socket.on('register', data => {			
			this.game.registerScreen.onEvent(data)
		})

		socket.on('initPackage', data => {
			data.heroesProps.forEach(heroProps => {
				this.game.addHero(heroProps)
			})
			data.dragonsProps.forEach(dragonProps => {
				this.game.addDragon(dragonProps)
			})
			console.log(this.game.dragons)
			this.game.start()
		})

		socket.on('updatePackage', data => {
			data.heroesProps.forEach(heroProps => {
				this.game.updateHero(heroProps)
			})
			data.dragonsProps.forEach(dragonProps => {
				this.game.updateDragon(dragonProps)
			})
		})

		socket.on('newHeroConnected', heroProps => {
			this.game.addHero(heroProps)
		})

		socket.on('heroDisconnected', id => {
			this.game.deleteHero(id)
		})

		socket.on('chat', data => {
			this.game.chat.appendMessage(data)
		})

		socket.on('party', data => {
			console.log(data)
			this.game.chat.onPartyEvent(data)
		})

		socket.on('ability', pack => {
			if(this.game.heroes[pack.heroID]) {
				this.game.heroes[pack.heroID].abilities[pack.id].processPackage(pack)
			} else if(pack.forOwner && this.game.self.props.id == pack.heroID) {
				this.game.self.abilities[pack.id].processPackage(pack)
			}
		})

		socket.on('expGoldBoost', data => {
			this.game.self.parseDragonRewards(data)
			if(this.game.questUI) {
				this.game.questUI.onDragonKill(data.dragon)
			}
		})

		socket.on('fireball', data => {
			this.game.addFireball(data)
		})

		socket.on('fireballDeath', ID => this.game.removeFireball(ID))
	}
}