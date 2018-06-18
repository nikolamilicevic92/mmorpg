import { Renderer } from './tools/renderer'
import { Map } from './tools/map'
import { Camera } from './tools/camera'
import { Keyboard } from './tools/keyboard'
import { Mouse } from './tools/mouse'
import { SoundManager } from './tools/sound-manager'
import { MovableDom } from './tools/movable-dom'

// import { Warrior } from './entities/warrior'
// import { Ninja } from './entities/ninja'
// import { Archer } from './entities/archer'
// import { Mage } from './entities/mage'
// import { Healer } from './entities/healer'
import { Dragon } from './entities/dragon'
import { Fireball } from './entities/fireball'
import { Hero } from './entities/hero'

// import { ANIMATIONS } from './config/animations'
// import { MAP_DATA } from './config/map-data'
import { ASSET_SOURCES } from './config/asset-sources'

import { LoginScreen } from './components/login-screen'
import { RegisterScreen } from './components/register-screen'
import { Chat } from './components/chat'
import { HeroCreation } from './components/hero-creation'
import { HeroSelection } from './components/hero-selection'
import { HeroUI } from './components/hero-ui'
import { QuestUI } from './components/quest-ui'

import { Client } from './client'



export class Game {

	constructor(socket, PIXI) {
		this.socket         = socket
		this.heroesData     = []
		this.ownedHeroes    = []
		this.client         = new Client(this, socket)
		this.soundManager   = new SoundManager()
		this.renderer       = new Renderer(PIXI, {width: 1200, height: 750})
		this.chat           = new Chat(this)
		this.heroUI         = null
		this.questUI        = null
		this.loginScreen    = new LoginScreen(this)
		this.map            = new Map(this)
		this.camera         = new Camera(this)
		this.keyboard       = new Keyboard()
		this.mouse          = new Mouse(this)
		this.movableDom     = new MovableDom()
		this.assets         = {images: {}, sounds: {}}
		this.heroes         = {}
		this.dragons        = {}
		this.fireballs      = {}
		this.quests         = {}
		this.registerScreen = new RegisterScreen(this) 
		this.heroCreation   = new HeroCreation(this)
		this.heroSelection  = new HeroSelection(this)
		this.self           = null
		this.username       = ''
		this.selectedHero   = ''
		this.movableDom.enableMovement(document.getElementById('heroUI'))
		this.movableDom.enableMovement(
			document.getElementById('chatContainer'), 
			document.getElementById('chatSettings')
		)
		this.renderer.load(ASSET_SOURCES.images, 'client/assets/images/')
		this.renderer.enableFullScreen()
		this.loadSounds(ASSET_SOURCES.sounds)
		.then(() => this.soundManager.init(this.assets.sounds))
	}


	start() {
		this.renderer.show()
		this.mouse.init()
		this.soundManager.play('Woodland Fantasy.mp3', true)
		this.soundManager.setVolume('Woodland Fantasy.mp3', 0.2)
		setInterval(() => this.update(), 16)
		this.render()
		this.heroUI = new HeroUI(this)
		this.heroUI.show()
		this.questUI = new QuestUI(this)
	}

	update() {
		this.camera.update()	
		this.soundManager.update()
		this.self.update()
		for(let id in this.heroes) {
			this.heroes[id].updateAbilitiesInstances()
		}
		for(let id in this.fireballs) {
			this.fireballs[id].update()
		}
		this.heroUI.update()
		this.socket.emit('selfState', this.self.getProps())
	}
	
	render() {
		this.renderer.clear()
		this.map.render()	
		for(let id in this.heroes) {
			this.heroes[id].render()
		}
		this.self.render()
		this.map.renderLastLayer()
		for(let id in this.fireballs) {
			this.fireballs[id].render()
		}
		for(let id in this.dragons) {
			this.dragons[id].render()
		}
		this.mouse.render()

		this.renderer.render()
		requestAnimationFrame(() => this.render())
	}


	makeSelf(activeStats) {
		this.self = Hero.makeHero(activeStats, this)
		console.log('This is self props...', this.self.props)
		this.selectedHero = this.self.props.name
		this.camera.follow(this.self)
		this.socket.emit('getInitPackage', this.self.getProps(true))
	}

	//Heroes 

	addHero(activeStats) {
		this.heroes[activeStats.id] = Hero.makeHero(activeStats, this)
	}

	updateHero(props) {
		if(this.heroes[props.id]) {
			this.heroes[props.id].setProps(props)
		}
	}

	deleteHero(id) {
		delete this.heroes[id]
	}


	//Dragons

	addDragon(props) {
		this.dragons[props.id] = new Dragon(this, props)
	}

	updateDragon(props) {
		if(this.dragons[props.id]) {
			this.dragons[props.id].setProps(props)
		}
	}

	//Firebals

	addFireball(props) {
		this.fireballs[props.ID] = new Fireball(this, props) 
	}

	removeFireball(id) {
		delete this.fireballs[id]
	}

	//Assets
	
	loadSounds(soundSources) {
		return new Promise((resolve, reject) => {
			let loadedSounds = 0
			soundSources.forEach(src => {
				this.assets.sounds[src] = document.createElement('audio')
				this.assets.sounds[src].src = 'client/assets/sounds/' + src
				this.assets.sounds[src].oncanplay = () => {
					if(++loadedSounds >= soundSources.length) {
						resolve()
					}
				}
			})
		})
	}

	
}